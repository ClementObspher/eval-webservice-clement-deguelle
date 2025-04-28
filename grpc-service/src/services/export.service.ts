import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import {
  ExportReservationsDto,
  ExportReservationsResponse,
} from '../interfaces/notification.interface';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class ExportService {
  private minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async exportReservations(
    data: ExportReservationsDto,
  ): Promise<ExportReservationsResponse> {
    try {
      // Simuler la récupération des réservations (à remplacer par votre logique réelle)
      const reservations = [
        { id: 1, userId: data.userId, status: 'pending' },
        { id: 2, userId: data.userId, status: 'approved' },
      ];

      // Convertir en CSV
      const csvContent = stringify(reservations, {
        header: true,
        columns: {
          id: 'ID',
          userId: 'User ID',
          status: 'Status',
        },
      });

      // Générer un nom de fichier unique
      const fileName = `reservations-${data.userId}-${Date.now()}.csv`;

      // Upload vers MinIO
      await this.minioClient.putObject('reservations', fileName, csvContent, {
        'Content-Type': 'text/csv',
      });

      // Générer l'URL de téléchargement
      const url = await this.minioClient.presignedGetObject(
        'reservations',
        fileName,
      );

      return { url };
    } catch (error) {
      throw new Error(`Failed to export reservations: ${error.message}`);
    }
  }
}
