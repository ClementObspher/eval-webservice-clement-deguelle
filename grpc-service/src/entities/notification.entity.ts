import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  reservationId: number;

  @Column()
  message: string;

  @Column()
  notificationDate: string;
}
