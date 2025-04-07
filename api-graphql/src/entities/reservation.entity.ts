import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('reservations')
export class Reservation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  user_id: number;

  @Field()
  @Column()
  room_id: number;

  @Field()
  @Column()
  start_time: Date;

  @Field()
  @Column()
  end_time: Date;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
