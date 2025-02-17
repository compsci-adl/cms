import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isEvents } from '@/access/isEvents'

export const Events: CollectionConfig = {
    // Collection for events, only admins and event team has access
    slug: 'events',
    admin: {
        useAsTitle: 'title',
        enableRichTextLink: true,
        description: "Please upload a banner image to media before filling in event."
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'details',
            type: 'textarea',
            required: true,
        },
        {
            name: 'time',
            type: 'text',
        },
        {
            name: 'date',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                }
            },
            required: true,
        },
        {
            name: 'location',
            type: 'text',
            required: true,
        },
        {
            name: 'banner',
            type: 'relationship',
            relationTo: 'media',
            required: true,
        },
        {
            type: 'group',
            name: 'link',
            fields: [
                {
                    name: 'URL-text',
                    type: 'text',
                },
                {
                    type: 'text',
                    name: 'URL',
                }
            ]
        }

    ],
    // Access to event or admin
    access: {
        create: (isAdmin || isEvents),
        update: (isAdmin || isEvents),
        delete: (isAdmin || isEvents),
        read: ({req}) => {
            if (req.user) return true;
            
            return {
                _status: {
                    equals: 'published',
                },
            }
        },
        readVersions: (isAdmin || isEvents),
    },
    versions: {
        drafts: true,
    }
}