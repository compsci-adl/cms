import { isAdmin } from '@/access/isAdmin';
import { type CollectionConfig, type Access, accessOperation } from 'payload';
import { bool } from 'sharp';

export const Media: CollectionConfig = {
    // Collection for media uploads
    slug: 'media',
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
    ],
    upload: true,
};
