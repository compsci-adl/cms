import { isAdmin } from '@/access/isAdmin'
import { type CollectionConfig, type Access, accessOperation } from 'payload'

export const Media: CollectionConfig = {
  // Collection for media uploads
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    delete: isAdmin,
    update: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
