import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('rooms')
export class Room {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  capacity: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
