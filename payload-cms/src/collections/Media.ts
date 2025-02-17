import { isAdmin } from '@/access/isAdmin'
import { type CollectionConfig, type Access, accessOperation } from 'payload'

export const Media: CollectionConfig = {
  // Collection for media uploads
  slug: 'media',
  access: {
    read: () => true,
    delete: isAdmin,
    update: ({req}) => {
      return !req.user;
    },
    create: ({req}) => {
      return !req.user;
    },
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
