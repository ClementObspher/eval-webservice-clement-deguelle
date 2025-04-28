import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  reservationId: number;

  @Column()
  message: string;

  @Column()
  notificationDate: string;
}
