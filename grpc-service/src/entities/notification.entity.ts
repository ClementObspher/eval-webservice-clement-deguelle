import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  reservation_id: number;

  @Column()
  message: string;

  @Column({ type: 'timestamp', nullable: false })
  notification_date: Date;

  // Getter pour la compatibilité avec les tests
  get reservationId(): number {
    return this.reservation_id;
  }
}
