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
            id: r.id,
            room_id: r.room_id,
            start_time: r.start_time,
            end_time: r.end_time,
            created_at: r.created_at,
        }))

        const csvContent = stringify(records, {
            header: true,
            columns: ['id', 'room_id', 'start_time', 'end_time', 'created_at'],
        })

        const buffer = Buffer.from(csvContent)

        // Uploader dans MinIO
        await this.minioService.uploadFile(bucketName, fileName, buffer, 'text/csv')

        // Générer une URL de téléchargement
        const url = await this.minioService.getPresignedUrl(bucketName, fileName)

        return url
    }
}
