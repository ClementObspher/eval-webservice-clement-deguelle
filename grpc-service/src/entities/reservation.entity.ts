import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  room_id: number;

  @Column({ type: 'timestamp without time zone' })
  start_time: Date;

  @Column({ type: 'timestamp without time zone' })
  end_time: Date;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
