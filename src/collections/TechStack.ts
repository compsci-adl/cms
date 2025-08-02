import { isOpenSource } from '@/access/isOpenSource';
import type { CollectionConfig } from 'payload';

export const Tech_Stack: CollectionConfig = {
    slug: 'tech-stack',
    admin: {
        useAsTitle: 'tech-name',
        description: 'Tech to be included in tech stack for open source projects',
    },
    fields: [
        {
            name: 'tech-name',
            type: 'text',
            required: true,
        },
        {
            name: 'color',
            type: 'text',
            required: true,
            admin: {
                description: 'Hex code of the color in the form #XXXXXX',
            },
        },
    ],
    access: {
        create: isOpenSource,
        update: isOpenSource,
        delete: isOpenSource,
        read: () => {
            return true;
        },
    },
};
