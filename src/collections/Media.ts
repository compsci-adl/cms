import { isAdmin } from '@/access/isAdmin';
import path from 'path';
import { type CollectionConfig } from 'payload';
import sharp from 'sharp';

export const Media: CollectionConfig = {
    // Collection for media uploads
    slug: 'media',
    // Upload svg's as svg type not xml
    upload: {
        modifyResponseHeaders({ headers }) {
            if (headers.get('content-type') === 'application/xml') {
                headers.set('content-type', 'image/svg+xml; charset=utf-8');
            }
            return headers;
        },
    },
    access: {
        read: () => true,
        delete: isAdmin,
        update: ({ req: { user } }) => {
            return Boolean(user);
        },
        create: ({ req: { user } }) => {
            return Boolean(user);
        },
    },
    hooks: {
        afterChange: [
            async ({ doc, req }) => {
                // Only convert jpg, jpeg and png
                const filename: string = doc.filename;
                const fileExt = path.extname(filename).toLowerCase();
                const validExts = ['.jpg', '.jpeg', '.png'];

                if (!validExts.includes(fileExt)) return;

                const mediaDir = path.resolve(process.cwd(), 'media');
                const inputPath = path.join(mediaDir, filename);
                const webpFilename = filename.replace(/\.[^.]+$/, '.webp');
                const outputPath = path.join(mediaDir, webpFilename);

                try {
                    // Convert to webp
                    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

                    // Update the document in the database to reflect the new filename
                    await req.payload.update({
                        collection: 'media',
                        id: doc.id,
                        data: {
                            filename: webpFilename,
                            mimeType: 'image/webp',
                        },
                    });
                } catch (error) {
                    console.error('Error converting image to WebP:', error);
                }
            },
        ],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
            admin: {
                description: 'Please include alt name for file',
            },
        },
        {
            name: 'type',
            type: 'radio',
            options: [
                {
                    label: 'Project',
                    value: 'project',
                },
                {
                    label: 'Sponsors',
                    value: 'sponsor',
                },
                {
                    label: 'Events',
                    value: 'event',
                },
            ],
        },
    ],
};
