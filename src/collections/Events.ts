import { isEvents } from '@/access/isEvents';
import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
    // Collection for events, only admins and event team has access
    slug: 'events',
    admin: {
        useAsTitle: 'title',
        enableRichTextLink: true,
        description: 'Please upload a banner image to media before filling in event.',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            admin: {
                description: 'Title of the event',
            },
        },
        {
            name: 'details',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Description of event (does not need to include time/date)',
            },
        },
        {
            name: 'time',
            type: 'group',
            fields: [
                {
                    name: 'start',
                    type: 'date',
                    admin: {
                        date: {
                            pickerAppearance: 'timeOnly',
                        },
                    },
                    required: true,
                },
                {
                    name: 'end',
                    type: 'date',
                    admin: {
                        date: {
                            pickerAppearance: 'timeOnly',
                        },
                    },
                    required: true,
                },
            ],
        },
        {
            name: 'date',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'default',
                },
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
            filterOptions: () => ({
                type: {
                    equals: 'event',
                },
            }),
            admin: {
                description: 'If not already done so upload desired image to Media collection',
            },
        },
        {
            type: 'group',
            name: 'link',
            fields: [
                {
                    name: 'displayText',
                    type: 'text',
                    admin: {
                        description: 'Desired display text for the URL',
                    },
                },
                {
                    type: 'text',
                    name: 'Link',
                    admin: {
                        description: 'URL for the link',
                    },
                },
            ],
        },
    ],
    // Access to event or admin
    access: {
        create: isEvents,
        update: isEvents,
        delete: isEvents,
        read: ({ req }) => {
            if (req.user) return true;

            return {
                _status: {
                    equals: 'published',
                },
            };
        },
        readVersions: isEvents,
    },
    versions: {
        drafts: true,
    },
};
