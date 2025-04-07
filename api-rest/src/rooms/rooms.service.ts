import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../entities/room.entity'
import { CreateRoomDto, UpdateRoomDto } from 'src/dto/room.dto'

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomsRepository: Repository<Room>,
    ) {}

    findAll(skip: number, limit: number) {
        return this.roomsRepository.find({
            skip: skip,
            take: limit,
        })
    }

    async findOne(id: number) {
        const room = await this.roomsRepository.findOne({ where: { id } })
        if (!room) throw new NotFoundException(`Room ${id} not found`)
        return room
    }

    async create(data: CreateRoomDto) {
        const room = this.roomsRepository.create(data)
        return await this.roomsRepository.save(room)
    }

    async update(id: number, data: UpdateRoomDto) {
        const room = await this.findOne(id)
        return this.roomsRepository.save({ ...room, ...data })
    }

    async remove(id: number) {
        await this.roomsRepository.delete(id)
    }
}
