import { isAdmin } from '@/access/isAdmin';
import { isOpenSource } from '@/access/isOpenSource';
import type { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
    slug: 'projects',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'image',
            type: 'relationship',
            relationTo: 'media',
            filterOptions: () => ({
                type: {
                    equals: 'project',
                },
            }),
            admin: {
                description:
                    'If not already done so upload desired image to Media collection, This is the logo of the project',
            },
        },
        {
            name: 'githubLink',
            type: 'text',
            required: false,
        },
        {
            name: 'websiteLink',
            type: 'text',
            required: false,
        },
        {
            name: 'techStack',
            type: 'relationship',
            relationTo: 'tech-stack',
            hasMany: true,
            required: true,
            admin: {
                description: 'Ensure all tech stacks required for project are added accordingly.',
            },
        },
        {
            name: 'isCurrent',
            type: 'radio',
            options: ['true', 'false'],
            required: true,
        },
    ],
    access: {
        create: isOpenSource || isAdmin,
        update: isOpenSource || isAdmin,
        delete: isOpenSource || isAdmin,
        read: () => {
            return true;
        },
    },
    versions: {
        drafts: true,
    },
};
