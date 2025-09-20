import { isExec } from '@/access/isExec';
import type { CollectionConfig } from 'payload';

export const HonoraryMembers: CollectionConfig = {
    slug: 'honorary-members',
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
            name: 'yearAwarded',
            type: 'number',
            required: true,
        },
        {
            name: 'positions',
            type: 'array',
            required: false,
            fields: [
                {
                    name: 'position',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'year',
                    type: 'number',
                    required: true,
                },
            ],
            minRows: 0,
            maxRows: 20,
        },
    ],
    access: {
        create: isExec,
        update: isExec,
        delete: isExec,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};
