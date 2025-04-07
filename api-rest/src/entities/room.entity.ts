import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    capacity: number

    @Column({ nullable: true })
    location: string

    @CreateDateColumn()
    created_at: Date
}
