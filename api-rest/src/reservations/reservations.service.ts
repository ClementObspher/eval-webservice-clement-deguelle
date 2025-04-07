import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Reservation } from '../entities/reservation.entity'
import { UsersService } from 'src/users/users.service'
import { RoomsService } from 'src/rooms/rooms.service'
import { CreateReservationDto, UpdateReservationDto } from 'src/dto/reservation.dto'

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationsRepository: Repository<Reservation>,
        private readonly usersService: UsersService,
        private readonly roomsService: RoomsService,
    ) {}

    async findAll(skip: number, limit: number) {
        return await this.reservationsRepository.find({
            skip: skip,
            take: limit,
        })
    }

    async findOne(id: number) {
        const reservation = await this.reservationsRepository.findOne({ where: { id } })
        if (!reservation) throw new NotFoundException(`Reservation ${id} not found`)
        return reservation
    }

    async findByUser(user_id: number) {
        return await this.reservationsRepository.find({ where: { user_id } })
    }

    async create(data: CreateReservationDto) {
        const user = await this.usersService.findOne(data.user_id)
        const room = await this.roomsService.findOne(data.room_id)
        if (!user) throw new NotFoundException(`User ${data.user_id} not found`)
        if (!room) throw new NotFoundException(`Room ${data.room_id} not found`)
        const reservation = this.reservationsRepository.create(data)
        return await this.reservationsRepository.save(reservation)
    }

    async update(id: number, data: UpdateReservationDto) {
        const reservation = await this.findOne(id)
        return this.reservationsRepository.save({ ...reservation, ...data })
    }

    async remove(id: number) {
        await this.reservationsRepository.delete(id)
    }
}
