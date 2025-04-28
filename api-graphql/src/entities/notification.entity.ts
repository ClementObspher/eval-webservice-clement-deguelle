import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
@Entity('notifications')
export class Notification {
    @Field(() => ID)
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Field()
    @Column({ nullable: false })
    reservationId: number

    @Field()
    @Column()
    message: string

    @Field()
    @Column({ type: 'timestamp', nullable: false })
    notificationDate: Date

    @Field()
    @CreateDateColumn()
    created_at: Date
}
