import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/user.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(skip: number, limit: number) {
        return await this.usersRepository.find({
            skip: skip,
            take: limit,
        })
    }

    async findOne(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException(`User ${id} not found`)
        return user
    }

    async create(data: CreateUserDto) {
        const userData = {
            email: data.email,
            password: data.password, // Note: In a real app, this should be hashed
            keycloak_id: uuidv4(), // Generate a temporary UUID for testing
        }
        const user = this.usersRepository.create(userData)
        return await this.usersRepository.save(user)
    }

    // async update(id: number, data: Partial<User>) {
    //     const user = await this.findOne(id)
    //     return this.usersRepository.save({ ...user, ...data })
    // }

    // async remove(id: number) {
    //     await this.usersRepository.delete(id)
    // }
}
