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
    versions: {
        drafts: true,
    }
    ,
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'richText',
            required: true,
        },
        {
            name: 'start-time',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'timeOnly',
                }
            },
            required: true,
        },
        {
            name: 'end-time',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'timeOnly',
                }
            },
            required: true,
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
        }
    ],
    // Access to event or admin
    access: {
        create: (isAdmin || isEvents),
        update: (isAdmin || isEvents),
        delete: (isAdmin || isEvents)
    }
}