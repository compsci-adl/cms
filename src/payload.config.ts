// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { authjsPlugin } from 'payload-authjs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { authConfig } from './auth.config';
import { Events } from './collections/Events';
import { Media } from './collections/Media';
import { Projects } from './collections/Projects';
import { Sponsors } from './collections/Sponsors';
import { Tech_Stack } from './collections/TechStack';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

type Role = 'admin' | 'events' | 'openSource' | 'sponsorships';

interface AdminUserInput {
  email: string;
  password: string;
  roles: Role[];
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: '/',
  },
  cors: [process.env.FRONTEND_URL || ''],
  collections: [Users, Media, Events, Sponsors, Tech_Stack, Projects], // Include any new collections here
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    authjsPlugin({
      authjsConfig: authConfig,
    }),
  ],
  onInit: async (payload) => {
    const adminUsers = await payload.find({
      collection: 'users',
      where: { roles: { equals: 'admin' } },
    });

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
