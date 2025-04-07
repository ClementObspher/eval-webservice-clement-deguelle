import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('rooms')
export class Room {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  capacity: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
