import { isGallery } from '@/access/isGallery';
import type { CollectionConfig } from 'payload';

export const Gallery: CollectionConfig = {
    slug: 'gallery',
    labels: {
        singular: 'Gallery',
        plural: 'Galleries',
    },
    fields: [
        {
            name: 'eventName',
            type: 'text',
            required: true,
        },
        {
            name: 'eventDate',
            type: 'date',
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                },
            },
        },
        {
            name: 'images',
            type: 'relationship',
            relationTo: 'media',
            hasMany: true,
            required: false,
            filterOptions: () => ({
                type: {
                    equals: 'gallery',
                },
            }),
            admin: {
                readOnly: true,
                description:
                    'Automatically populated with media where eventName metadata matches the event name.',
            },
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, req }) => {
                const eventName = data.eventName;
                if (!eventName) return data;

                // Find matching media by eventName metadata
                const mediaResults = await req.payload.find({
                    collection: 'media',
                    where: {
                        and: [
                            {
                                eventName: {
                                    equals: eventName,
                                },
                            },
                            {
                                type: {
                                    equals: 'gallery',
                                },
                            },
                        ],
                    },
                    limit: 1000,
                });

                if (mediaResults && mediaResults.docs) {
                    data.images = mediaResults.docs.map((doc) => doc.id);
                }

                return data;
            },
        ],
    },
    access: {
        create: isGallery,
        update: isGallery,
        delete: isGallery,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};
