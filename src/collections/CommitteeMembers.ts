import { isAdmin } from '@/access/isAdmin';
import type { CollectionConfig } from 'payload';

export const CommitteeMembers: CollectionConfig = {
    slug: 'committee-members',
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            type: 'text',
            required: true,
        },
        {
            name: 'exec',
            type: 'checkbox',
            required: false,
            defaultValue: false,
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
