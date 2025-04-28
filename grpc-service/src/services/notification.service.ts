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

  async createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = new NotificationEntity();
    notification.id = uuidv4();
    notification.reservationId = data.reservationId;
    notification.message = data.message;
    notification.notificationDate = data.notificationDate;

    return await this.notificationRepository.save(notification);
  }

  async updateNotification(
    data: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id: data.id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.message = data.message;
    notification.notificationDate = data.notificationDate;

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
