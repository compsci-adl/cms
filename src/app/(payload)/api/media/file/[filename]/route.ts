import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime';

const storageType = process.env.MEDIA_STORAGE_LOCATION || 'local';

let s3Client: S3Client | undefined;

if (storageType === 's3') {
    s3Client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
    });
}

// Convert ReadableStream to Uint8Array
async function streamToBuffer(stream: Readable): Promise<Uint8Array> {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export async function GET(req: NextRequest, context: { params: Promise<{ filename: string }> }) {
    const params = await context.params;
    const filename = params.filename;

    if (storageType == 's3' && s3Client) {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: filename,
            });

            const data = await s3Client.send(command);

            if (!data.Body) {
                return new NextResponse('File not found', { status: 404 });
            }

            // AWS SDK v3 returns a stream in Body
            const bodyBuffer = await streamToBuffer(data.Body as Readable);

            // Build response headers
            const headers = new Headers();

            if (data.ContentType) {
                headers.set('Content-Type', data.ContentType);
            }
            if (data.ContentLength) {
                headers.set('Content-Length', data.ContentLength.toString());
            }
            if (data.ETag) {
                headers.set('ETag', data.ETag);
            }

            return new NextResponse(bodyBuffer, {
                status: 200,
                headers,
            });
        } catch (err: any) {
            if (err.name === 'NoSuchKey') {
                return new NextResponse('File not found', { status: 404 });
            }

            console.error('Failed to fetch S3 object:', err);

            if (err.name === 'AccessDenied') {
                return new NextResponse('Access Denied', { status: 403 });
            }

            return new NextResponse('Internal Server Error', { status: 500 });
        }
    } else {
        try {
            const uploadDir = path.resolve(process.cwd(), 'uploads');
            const filePath = path.join(uploadDir, filename);
            console.log("FILENAME: ", filename)
            const fileBuffer = await fs.readFile(filePath);

            // application/octet-stream is default case for MIME types for non-text files if no match found
            const contentType = mime.getType(filePath) || 'application/octet-stream';

            const headers = new Headers();
            headers.set('Content-Type', contentType);
            headers.set('Content-Length', fileBuffer.length.toString());

            return new NextResponse(fileBuffer, {
                status: 200,
                headers,
            });
        } catch (error) {
            console.error('Failed to fetch local file:', error);
            return new NextResponse('File not found', { status: 404 });
        }
    }
}
