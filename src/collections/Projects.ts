import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/isAdmin';
import { isOpenSource } from '@/access/isOpenSource';

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
            admin: {
                description: 'If not already done so upload desired image to Media collection, This is the logo of the company',
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
                
            }
        }, 
        {
            name: 'active',
            type: 'radio',
            options: [
                'true',
                'false'
            ], 
            required: true
        }
    ],
    access: {
        create: isAdmin || isOpenSource,
        update: isAdmin || isOpenSource,
        delete: isAdmin || isOpenSource,
        read: () => {
            return true;
        },
    },
}