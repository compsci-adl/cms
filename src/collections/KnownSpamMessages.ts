import { isAdmin } from '@/access/isAdmin';
import type { CollectionConfig } from 'payload';

export const KnownSpamMessages: CollectionConfig = {
    slug: 'known-spam-messages',
    admin: {
        useAsTitle: 'message',
    },
    fields: [
        {
            name: 'message',
            type: 'text',
            required: true,
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
