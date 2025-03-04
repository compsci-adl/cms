import type { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
    slug: 'Projects',
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
            name: 'github link',
            type: 'text'
        },
        {
            name: 'website link',
            type: 'text',
        },
        {
            name: 'text stack',
            type: 'relationship',
            relationTo: 'tech-stack',
            hasMany: true,
            required: true,
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
}