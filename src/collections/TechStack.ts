import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/isAdmin';
import { isOpenSource } from '@/access/isOpenSource';

export const Tech_Stack: CollectionConfig = {
    slug: 'tech-stack', 
    admin: {
        useAsTitle: 'tech-name',
        description: 'Tech to be included in tech stack for open source projects'
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
            }
        }
    ],
    access: {
        create: isAdmin || isOpenSource,
        update: isAdmin || isOpenSource,
        delete: isAdmin || isOpenSource,
        read: () => {
            return true;
        }
    },
}