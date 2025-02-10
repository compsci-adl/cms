import { isAdmin, isFieldAdmin, isAdminOrSelf } from '../access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  // Collection for users
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  // Any user can update themselves, admin updates all
  access: {
    create: isAdminOrSelf,
    update: isAdminOrSelf,
    read: isAdminOrSelf,
    delete: isAdmin
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'open-source',
          value: 'openSource',
        },
        {
          label: 'events',
          value: 'events',
        },
        {
          label: 'Sponsorships',
          value: 'sponsorships',
        },       
      ],
      // Only admins can add or change roles
      access: {
        create: isFieldAdmin,
        update: isFieldAdmin,
      }
    }
  ],
}
