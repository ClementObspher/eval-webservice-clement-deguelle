import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class MinioService {
    private s3Client: S3Client

    constructor() {
        this.s3Client = new S3Client({
            region: 'ue-west-1',
            endpoint: 'http://localhost:9000',
            credentials: {
                accessKeyId: 'minioadmin',
                secretAccessKey: 'minioadmin',
            },
            forcePathStyle: true,
        })
    }

    async uploadFile(bucket: string, fileName: string, fileContent: Buffer, mimeType: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: fileName,
            Body: fileContent,
            ContentType: mimeType,
        })

        await this.s3Client.send(command)
    }

    async getPresignedUrl(bucket: string, fileName: string, expiresIn = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: fileName,
        })

        const url = await getSignedUrl(this.s3Client, command, { expiresIn })

        return url
    }
}
