import { Entity, Column, PrimaryColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
@Entity('notifications')
export class Notification {
    @Field(() => ID)
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Field()
    @Column({ nullable: false })
    reservation_id: number

    @Field()
    @Column()
    message: string

    @Field()
    @Column({ type: 'timestamp', nullable: false })
    notification_date: Date
}
