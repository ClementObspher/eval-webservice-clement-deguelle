import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import {
  ExportReservationsDto,
  ExportReservationsResponse,
} from '../interfaces/notification.interface';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class ExportService {
  private minioClient: Client;

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {
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
      // S'assurer que le bucket existe
      const bucketName = 'reservations';
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName);
      }

      // Récupérer les vraies réservations depuis la base de données
      const reservations = await this.reservationRepository.find({
        where: { user_id: data.userId },
      });

      // Convertir en CSV
      const csvData = reservations.map((reservation) => ({
        reservationId: reservation.id,
        userId: reservation.user_id,
        roomId: reservation.room_id,
        startTime: reservation.start_time,
        endTime: reservation.end_time,
        status: reservation.status,
      }));

      const csvContent = stringify(csvData, {
        header: true,
        columns: {
          reservationId: 'reservationId',
          userId: 'userId',
          roomId: 'roomId',
          startTime: 'startTime',
          endTime: 'endTime',
          status: 'status',
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
