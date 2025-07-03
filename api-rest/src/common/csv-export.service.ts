import { Injectable } from '@nestjs/common'
import { MinioService } from './miniio.service'
import { stringify } from 'csv-stringify/sync'

@Injectable()
export class CsvExportService {
    constructor(private readonly minioService: MinioService) {}

    async generateCsvAndUpload(email: string, reservations: any[]): Promise<string> {
        const timestamp = new Date().getTime()
        const fileName = `reservations-${email}-${timestamp}.csv`
        const bucketName = 'csv-exports'

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
