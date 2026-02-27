import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { buildConfig } from 'payload';
import type { Plugin } from 'payload';
import { authjsPlugin } from 'payload-authjs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { authConfig } from './auth.config';
import { CommitteeMembers } from './collections/CommitteeMembers';
import { CommonEvents } from './collections/CommonEvents';
import { Events } from './collections/Events';
import { Gallery } from './collections/Gallery';
import { HonoraryMembers } from './collections/HonoraryMembers';
import { KnownSpamMessages } from './collections/KnownSpamMessages';
import { Links } from './collections/Links';
import { Media } from './collections/Media';
import { Projects } from './collections/Projects';
import { Sponsors } from './collections/Sponsors';
import { Tech_Stack } from './collections/TechStack';
import { Users } from './collections/Users';
import Notification from './globals/Notification';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

type Role =
  | 'admin'
  | 'events'
  | 'open-source'
  | 'sponsorships'
  | 'gallery'
  | 'discord-mod'
  | 'committee-manager'
  | 'exec';

interface AdminUserInput {
  email: string;
  password: string;
  roles: Role[];
}

const buildConfigPlugins: Plugin[] = [];
const isKeycloak = process.env.LOGIN_TYPE === 'keycloak';

if (process.env.LOGIN_TYPE && process.env.LOGIN_TYPE == 'keycloak') {
  buildConfigPlugins.push(
    authjsPlugin({
      authjsConfig: {
        ...authConfig,
        providers: isKeycloak ? authConfig.providers : [],
      },
    })
  );
}

if (process.env.MEDIA_STORAGE_LOCATION && process.env.MEDIA_STORAGE_LOCATION === 's3') {
  buildConfigPlugins.push(
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION,
      },
    })
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [Notification],
  routes: {
    admin: '/',
  },
  cors: [
    process.env.FRONTEND_URL || '',
    process.env.FRONTEND_URL?.startsWith('https')
      ? `https://www.${new URL(process.env.FRONTEND_URL).hostname}`
      : '',
  ].filter(Boolean),
  collections: [
    Users,
    Media,
    Events,
    CommonEvents,
    Links,
    Sponsors,
    Tech_Stack,
    Projects,
    Gallery,
    CommitteeMembers,
    HonoraryMembers,
    KnownSpamMessages,
  ], // Include any new collections here
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: buildConfigPlugins,
  onInit: async (payload) => {
    const adminUsers = await payload.find({
      collection: 'users',
      where: { roles: { equals: 'admin' } },
    });

    // TODO: Fix issue where admin user is already created by env var and upon changing the var, does not change the admin user
    if (adminUsers.docs.length === 0) {
      // Add new root user, prevents lock out
      const rootEmail = process.env.ROOT_EMAIL?.toString() || '';
      const rootPass = process.env.ROOT_PASS?.toString() || '';

      const newUser: AdminUserInput = {
        email: rootEmail,
        password: rootPass,
        roles: ['admin'],
      };

      await payload.create({
        collection: 'users',
        data: newUser,
      });
    }
  },
});
