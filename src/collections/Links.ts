import { isEvents } from '@/access/isEvents';
import type { CollectionConfig } from 'payload';

export const Links: CollectionConfig = {
    slug: 'links',
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'url',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
        },
    ],
    access: {
        create: isEvents,
        update: isEvents,
        delete: isEvents,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};
