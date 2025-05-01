import { isAdmin } from '@/access/isAdmin';
import { type CollectionConfig, type Access, accessOperation } from 'payload';
import { bool } from 'sharp';

export const Media: CollectionConfig = {
    // Collection for media uploads
    slug: 'media',
    // Upload svg's as svg type not xml
    upload: {
        modifyResponseHeaders({ headers }) {
          if (headers.get('content-type') === 'application/xml') {
            headers.set('content-type', 'image/svg+xml; charset=utf-8')
          }
          return headers
        },
    },
    access: {
        read: () => true,
        delete: isAdmin,
        update: ({ req: { user } }) => {
            return Boolean(user);
        },
        create: ({ req: { user } }) => {
            return Boolean(user);
        },
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
            admin: {
                description: 'Please include alt name for file',
            },
        },
        {
            name: 'type',
            type: 'radio',
            options: [
                {
                    label: 'Project',
                    value: 'project',
                },
                {
                    label: 'Sponsors',
                    value: 'sponsor',
                },
                {
                    label: 'Events',
                    value: 'event',
                }
            ],
        },
    ],
};
