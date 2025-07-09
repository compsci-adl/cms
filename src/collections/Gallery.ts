import { isAdmin } from '@/access/isAdmin';
import type { CollectionConfig } from 'payload';

export const Gallery: CollectionConfig = {
    slug: 'gallery',
    labels: {
        singular: 'Gallery',
        plural: 'Galleries',
    },
    fields: [
        {
            name: 'eventName',
            type: 'text',
            required: true,
        },
        {
            name: 'eventDate',
            type: 'date',
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                },
            },
        },
        {
            name: 'images',
            type: 'relationship',
            relationTo: 'media',
            hasMany: true,
            required: true,
            filterOptions: () => ({
                type: {
                    equals: 'gallery',
                },
            }),
            admin: {
                description:
                    'Select or upload photos to the Media collection. Make sure they are tagged as type "gallery".',
            },
        },
    ],
    access: {
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};
