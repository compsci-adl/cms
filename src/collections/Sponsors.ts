import { isSponsorship } from '@/access/isSponsorships';
import type { CollectionConfig } from 'payload';

export const Sponsors: CollectionConfig = {
    // Collection for sponsors
    slug: 'sponsors',
    admin: {
        useAsTitle: 'Company name',
        description: 'Please upload a banner image to media before filling in sponsor.',
    },
    fields: [
        {
            name: 'Company name',
            type: 'text',
            required: true,
            admin: {
                description: 'Name of the company',
            },
        },
        {
            name: 'Company description',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Description of the company as obtained from representatives',
            },
        },
        {
            name: 'website link',
            type: 'text',
            admin: {
                description: "Link to the company's website",
            },
            required: false,
        },
        {
            name: 'sponsor tier',
            type: 'radio',
            options: [
                {
                    label: 'Gold',
                    value: 'gold',
                },
                {
                    label: 'Silver',
                    value: 'silver',
                },
                {
                    label: 'Bronze',
                    value: 'bronze',
                },
            ],
            required: true,
        },
        {
            name: 'logo',
            type: 'relationship',
            relationTo: 'media',
            filterOptions: () => ({
                type: {
                    equals: 'sponsor',
                },
            }),
            required: true,
            admin: {
                description:
                    'If not already done so upload desired image to Media collection, This is the logo of the company',
            },
        },
    ],
    access: {
        create: isSponsorship,
        update: isSponsorship,
        delete: isSponsorship,
        read: ({ req }) => {
            if (req.user) return true;

            return {
                _status: {
                    equals: 'published',
                },
            };
        },
        readVersions: isSponsorship,
    },
    versions: {
        drafts: true,
    },
};
