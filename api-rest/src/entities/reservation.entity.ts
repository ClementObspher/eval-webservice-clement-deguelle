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

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @CreateDateColumn()
  created_at: Date;
}
