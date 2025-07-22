import { isAdmin } from '@/access/isAdmin';
import path from 'path';
import { type CollectionConfig } from 'payload';
import sharp from 'sharp';
import slugify from 'slugify';
import { Readable } from 'stream';

import fs from 'fs'

// TODO: Only import if storage type matches
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    HeadObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';

let s3Client: S3Client | undefined;

const storageType = process.env.MEDIA_STORAGE_LOCATION || 'local';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (storageType == 's3') {
    s3Client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
    });
}


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
    if (!s3Client) return false;
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
        staticDir: path.resolve(process.cwd(), 'uploads'),
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
    hooks: {},
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
                    'Used to name gallery images. Format should be "Event Name S1 2025" or "Event Name 2025".',
            },
        },
    ],
};

if (!Media.hooks) {
    Media.hooks = {}
}

if (s3Client) {
    Media.hooks.afterChange = [
        async ({ doc, req, operation }) => {
            // Only convert jpg, jpeg and png
            if (operation !== 'create') return; // Only process newly created uploads

            const filename: string = doc.filename;
            const fileExt = path.extname(filename).toLowerCase();
            const validExts = ['.jpg', '.jpeg', '.png'];

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

                // Resize and convert to WebP
                const webpBuffer = await sharp(originalBuffer)
                    .resize({
                        width: 1600,
                        height: 1600,
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .webp({ quality: 75 })
                    .toBuffer();

                // Get metadata from resized WebP image
                const metadata = await sharp(webpBuffer).metadata();
                const dimensions = {
                    width: metadata.width || null,
                    height: metadata.height || null,
                    filesize: webpBuffer.length,
                };

                // Determine new filename
                let baseName = filename.replace(/\.[^.]+$/, ''); // default fallback
                if (doc.type === 'gallery' && doc.eventName) {
                    baseName = slugify(doc.eventName, { lower: true, strict: true });
                }

                let newFilename = `${baseName}.webp`;
                let counter = 1;

                while (await keyExists(bucket, newFilename)) {
                    newFilename = `${baseName}-${counter}.webp`;
                    counter++;
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

                // Update Payload document with new filename and mimeType
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

    ]
} else {
    Media.hooks.afterChange = [
        async ({ doc, req, operation }) => {
            if (operation !== 'create') return;

            const filename = doc.filename;
            const fileExt = path.extname(filename).toLowerCase();
            const validExts = ['.jpg', '.jpeg', '.png'];
            if (!validExts.includes(fileExt)) return;

            const fs = await import('fs/promises');
            const originalFilePath = path.join(uploadDir, filename);

            try {

                // Read original file buffer
                const originalBuffer = await fs.readFile(originalFilePath);

                // Resize and convert to WebP
                const webpBuffer = await sharp(originalBuffer)
                    .resize({ 
                        width: 1600, 
                        height: 1600, 
                        fit: 'inside', 
                        withoutEnlargement: true 
                    })
                    .webp({ quality: 75 })
                    .toBuffer();

                const metadata = await sharp(webpBuffer).metadata();
                const dimensions = {
                    width: metadata.width || null,
                    height: metadata.height || null,
                    filesize: webpBuffer.length,
                };

                let baseName = filename.replace(/\.[^.]+$/, '');
                if (doc.type === 'gallery' && doc.eventName) {
                    baseName = slugify(doc.eventName, { lower: true, strict: true });
                }

                let newFilename = `${baseName}.webp`;
                let counter = 1;

                
                // Avoid overwriting existing files
                while (true) {
                    try {
                        await fs.access(path.join(uploadDir, newFilename));
                        newFilename = `${baseName}-${counter}.webp`;
                        counter++;
                    } catch {
                        break;
                    }
                }

                const newFilePath = path.join(uploadDir, newFilename);
                await fs.writeFile(newFilePath, webpBuffer);

                // Delete original file
                await fs.unlink(originalFilePath);

                // Update Payload document
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
                console.error('Error processing local image:', error);
            }
        },
    ];
}