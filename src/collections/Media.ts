import { isAdmin } from '@/access/isAdmin';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { type CollectionConfig } from 'payload';
import sharp from 'sharp';
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
                // Only convert jpg, jpeg and png
                if (operation !== 'create') return; // Only process newly created uploads

                const filename: string = doc.filename;
                const fileExt = path.extname(filename).toLowerCase();
                const validExts = ['.jpg', '.jpeg', '.png'];

                if (!validExts.includes(fileExt)) return;

                try {
                    const bucket = process.env.S3_BUCKET || '';
                    const key = filename;

                    // Download original file from S3
                    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
                    const s3Response = await s3Client.send(getObjectCommand);

                    if (!s3Response.Body) {
                        console.error('S3 object body is empty');
                        return;
                    }

                    const originalBuffer = await streamToBuffer(s3Response.Body as Readable);

                    // Convert image to WebP buffer
                    const webpBuffer = await sharp(originalBuffer).webp({ quality: 80 }).toBuffer();

                    // New WebP filename
                    const webpFilename = filename.replace(/\.[^.]+$/, '.webp');

                    // Upload WebP image back to S3
                    const putObjectCommand = new PutObjectCommand({
                        Bucket: bucket,
                        Key: webpFilename,
                        Body: webpBuffer,
                        ContentType: 'image/webp',
                    });
                    await s3Client.send(putObjectCommand);

                    // Delete original file from S3
                    await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

                    // Update Payload document with new filename and mimeType
                    await req.payload.update({
                        collection: 'media',
                        id: doc.id,
                        data: {
                            filename: webpFilename,
                            mimeType: 'image/webp',
                        },
                    });
                } catch (error) {
                    console.error('Error converting image to WebP and uploading to S3:', error);
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
                {
                    label: 'Gallery',
                    value: 'gallery',
                },
            ],
        },
    ],
};
