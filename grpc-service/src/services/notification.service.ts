import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../interfaces/notification.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async createNotification(data: any): Promise<NotificationEntity> {
    // Support de la compatibilité camelCase/snake_case
    const reservationId = data.reservationId || data.reservation_id;
    const notificationDate = data.notificationDate || data.notification_date;

    if (!reservationId) {
      throw new Error('reservation_id is required');
    }

    const notification = new NotificationEntity();
    notification.id = uuidv4();
    notification.reservation_id = parseInt(reservationId);
    notification.message = data.message;
    notification.notification_date = new Date(notificationDate);

    return await this.notificationRepository.save(notification);
  }

  async updateNotification(data: any): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id: data.id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    // Support de la compatibilité camelCase/snake_case
    const notificationDate = data.notificationDate || data.notification_date;

    notification.message = data.message;
    notification.notification_date = new Date(notificationDate);

    return await this.notificationRepository.save(notification);
  }

  async getNotification(id: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }
}
