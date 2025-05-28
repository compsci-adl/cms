import { GlobalConfig } from 'payload';

const Notification: GlobalConfig = {
    slug: 'notification',
    label: 'Website Notification',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'enabled',
            type: 'checkbox',
            label: 'Show Notification',
            defaultValue: false,
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            label: 'Notification Type',
            required: true,
            defaultValue: 'banner',
            options: [
                { label: 'Banner', value: 'banner' },
                { label: 'Popup', value: 'popup' },
            ],
            admin: {
                condition: (_, siblingData) => siblingData.enabled === true,
            },
        },
        {
            name: 'text',
            type: 'text',
            label: 'Notification Text',
            required: true,
            admin: {
                condition: (_, siblingData) => siblingData.enabled === true,
            },
        },
        {
            name: 'url',
            type: 'text',
            label: 'Notification URL',
            admin: {
                condition: (_, siblingData) => siblingData.enabled === true,
            },
        },
        {
            name: 'urlText',
            type: 'text',
            label: 'Link Text',
            admin: {
                condition: (_, siblingData) => siblingData.enabled === true && !!siblingData.url,
            },
        },
        {
            name: 'leftImage',
            type: 'upload',
            label: 'Left Image',
            relationTo: 'media',
            required: false,
            admin: {
                condition: (_, siblingData) =>
                    siblingData.enabled === true && siblingData.type === 'popup',
            },
        },
        {
            name: 'rightImage',
            type: 'upload',
            label: 'Right Image',
            relationTo: 'media',
            required: false,
            admin: {
                condition: (_, siblingData) =>
                    siblingData.enabled === true && siblingData.type === 'popup',
            },
        },
    ],
};

export default Notification;
