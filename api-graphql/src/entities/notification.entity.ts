import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  reservation_id: number;

  @Field()
  @Column()
  message: string;

  @Field()
  @Column({ type: 'timestamp', nullable: false })
  notificationDate: Date;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
