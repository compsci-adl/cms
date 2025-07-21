import { isAdmin } from '@/access/isAdmin';
import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

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
                    'Automatically populated with media where filename matches the event name.',
            },
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, req }) => {
                const eventName = data.eventName;
                if (!eventName) return data;

                const slug = slugify(eventName, { lower: true, strict: true });

                console.log(`Slugified event name: ${slug}`);
                // Find matching media
                const mediaResults = await req.payload.find({
                    collection: 'media',
                    where: {
                        and: [
                            {
                                filename: {
                                    like: `${slug}`,
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

                console.log(`Found ${mediaResults?.totalDocs || 0} media items for event: ${eventName}`);

                if (mediaResults && mediaResults.docs) {
                    data.images = mediaResults.docs.map((doc) => doc.id);
                }

                return data;
            },
        ],
    },
    access: {
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};
