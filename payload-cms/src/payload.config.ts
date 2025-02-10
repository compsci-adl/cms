// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Events } from './collections/Events'
import { DevBundlerService } from 'next/dist/server/lib/dev-bundler-service'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Events
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
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  onInit: async (payload) => {
    const adminUsers = await payload.find({
      collection: 'users',
      where: {roles: {equals: 'admin'}}
    })

    if (adminUsers.docs.length === 0) {
      // Add new root user, prevents lock out
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 'dev@csclub.org.au',
          password: 'test',
          roles: ['admin'],
        }
      })
    }
  }
})
