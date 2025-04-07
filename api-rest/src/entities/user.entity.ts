import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    keycloak_id: string

    @Column({ unique: true })
    email: string

    @Column({ select: false })
    password: string

    @CreateDateColumn()
    created_at: Date
}
