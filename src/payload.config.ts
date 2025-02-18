// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { Events } from './collections/Events';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },  
  cors: [process.env.CS_URL || ''],
  collections: [Users, Media, Events], // Include any new collections here
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  onInit: async (payload) => {
    const adminUsers = await payload.find({
      collection: 'users',
      where: { roles: { equals: 'admin' } },
    });

    if (adminUsers.docs.length === 0) {
      // Add new root user, prevents lock out
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: process.env.ROOT_EMAIL?.toString() || '',
          password: process.env.ROOT_PASS?.toString() || '',
          roles: ['admin'],
        },
      });
    }
  },
});
