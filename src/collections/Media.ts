import { isAdmin } from '@/access/isAdmin';
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { type CollectionConfig } from 'payload';
import sharp from 'sharp';
import slugify from 'slugify';
import { Readable } from 'stream';

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
});

function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

// Check if an object with this key already exists in S3
async function keyExists(bucket: string, key: string): Promise<boolean> {
    try {
        await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        return true;
    } catch {
        return false;
    }
}

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
            async ({ doc, req, operation }) => {
                if (operation !== 'create') return; // Only process newly created uploads

                const filename: string = doc.filename;
                const fileExt = path.extname(filename).toLowerCase();
                const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

                if (!validExts.includes(fileExt)) return;

                const bucket = process.env.S3_BUCKET || '';
                const key = filename;

                try {
                    // Download original file from S3
                    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
                    const s3Response = await s3Client.send(getObjectCommand);

                    if (!s3Response.Body) {
                        console.error('S3 object body is empty');
                        return;
                    }

                    const originalBuffer = await streamToBuffer(s3Response.Body as Readable);
                    const fileIsWebP = path.extname(filename).toLowerCase() === '.webp';

                    // Slugify base name
                    let baseName = filename.replace(/\.[^.]+$/, '');
                    if (doc.type === 'gallery' && doc.eventName) {
                        baseName = slugify(doc.eventName, { lower: true, strict: true });
                    } else {
                        baseName = slugify(baseName, { lower: true, strict: true });
                    }

                    let newFilename = `${baseName}.webp`;
                    let counter = 1;

                    while (await keyExists(bucket, newFilename)) {
                        newFilename = `${baseName}-${counter}.webp`;
                        counter++;
                    }

                    let webpBuffer: Buffer;
                    let dimensions: {
                        width: number | null;
                        height: number | null;
                        filesize: number;
                    };

                    if (fileIsWebP) {
                        // Reuse the original buffer
                        webpBuffer = originalBuffer;

                        const metadata = await sharp(webpBuffer).metadata();
                        dimensions = {
                            width: metadata.width || null,
                            height: metadata.height || null,
                            filesize: webpBuffer.length,
                        };
                    } else {
                        // Resize and convert to WebP
                        webpBuffer = await sharp(originalBuffer)
                            .resize({
                                width: 1600,
                                height: 1600,
                                fit: 'inside',
                                withoutEnlargement: true,
                            })
                            .webp({ quality: 75 })
                            .toBuffer();

                        const metadata = await sharp(webpBuffer).metadata();
                        dimensions = {
                            width: metadata.width || null,
                            height: metadata.height || null,
                            filesize: webpBuffer.length,
                        };
                    }

                    // Upload new image to S3
                    await s3Client.send(
                        new PutObjectCommand({
                            Bucket: bucket,
                            Key: newFilename,
                            Body: webpBuffer,
                            ContentType: 'image/webp',
                        })
                    );

                    // Delete original file from S3
                    await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

                    // Update Payload document with new filename and metadata
                    await req.payload.update({
                        collection: 'media',
                        id: doc.id,
                        data: {
                            filename: newFilename,
                            mimeType: 'image/webp',
                            width: dimensions.width,
                            height: dimensions.height,
                            filesize: dimensions.filesize,
                        },
                    });
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            },
        ],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: false,
            admin: {
                description: 'Please include alt name for file',
            },
        },
        {
            name: 'type',
            type: 'select',
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
                {
                    label: 'Gallery',
                    value: 'gallery',
                },
            ],
        },
        {
            name: 'eventName',
            type: 'text',
            required: false,
            admin: {
                condition: (_, siblingData) => siblingData?.type === 'gallery',
                description:
                    'Used to name gallery images. Format should be "Event Name S1 2025" or "Event Name 2025".\n\n Please run the compress-images script before uploading gallery images.',
            },
        },
    ],
};
