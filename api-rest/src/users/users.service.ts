import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'

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

    // create(data: Partial<User>) {
    //     const user = this.usersRepository.create(data)
    //     return this.usersRepository.save(user)
    // }

    // async update(id: number, data: Partial<User>) {
    //     const user = await this.findOne(id)
    //     return this.usersRepository.save({ ...user, ...data })
    // }

    // async remove(id: number) {
    //     await this.usersRepository.delete(id)
    // }
}
