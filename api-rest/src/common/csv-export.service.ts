import { Injectable } from '@nestjs/common'
import { MinioService } from './miniio.service'
import { stringify } from 'csv-stringify/sync'
import { Client } from 'minio'

@Injectable()
export class CsvExportService {
    private minioClient: Client
    constructor(private readonly minioService: MinioService) {
        this.minioClient = new Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT || '9000'),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
            secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        })
    }

    async generateCsvAndUpload(email: string, reservations: any[]): Promise<string> {
        const timestamp = new Date().getTime()
        const fileName = `reservations-${email}-${timestamp}.csv`
        const bucketName = 'csv-exports'
        const bucketExists = await this.minioClient.bucketExists(bucketName)
        if (!bucketExists) {
            await this.minioClient.makeBucket(bucketName)
        }

        // Générer le CSV (format Buffer)
        const records = reservations.map((r) => ({
            reservationId: r.id,
            userId: r.userId,
            roomId: r.roomId,
            startTime: r.startTime,
            endTime: r.endTime,
            status: r.status,
        }))

        const csvContent = stringify(records, {
            header: true,
            columns: ['reservationId', 'userId', 'roomId', 'startTime', 'endTime', 'status'],
        })

        const buffer = Buffer.from(csvContent)

        // Uploader dans MinIO
        await this.minioService.uploadFile(bucketName, fileName, buffer, 'text/csv')

        // Générer une URL de téléchargement
        const url = await this.minioService.getPresignedUrl(bucketName, fileName)

        return url
    }
}
