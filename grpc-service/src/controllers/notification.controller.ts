import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';
import { ExportService } from '../services/export.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  ExportReservationsDto,
  ExportReservationsResponse,
} from '../interfaces/notification.interface';
import { NotificationEntity } from '../entities/notification.entity';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly exportService: ExportService,
  ) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    return await this.notificationService.createNotification(data);
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(
    data: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    return await this.notificationService.updateNotification(data);
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async getNotification(data: { id: string }): Promise<NotificationEntity> {
    return await this.notificationService.getNotification(data.id);
  }

  @GrpcMethod('ExportService', 'ExportReservations')
  async exportReservations(
    data: ExportReservationsDto,
  ): Promise<ExportReservationsResponse> {
    return await this.exportService.exportReservations(data);
  }
}
