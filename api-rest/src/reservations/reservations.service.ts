import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Reservation } from '../entities/reservation.entity'
import { UsersService } from 'src/users/users.service'
import { RoomsService } from 'src/rooms/rooms.service'
import { CreateReservationDto, UpdateReservationDto } from 'src/dto/reservation.dto'
import { ClientGrpc } from '@nestjs/microservices'
import { NOTIFICATION_PACKAGE } from '../common/constants'

@Injectable()
export class ReservationsService {
    private notificationService: any

    constructor(
        @InjectRepository(Reservation)
        private reservationsRepository: Repository<Reservation>,
        private readonly usersService: UsersService,
        private readonly roomsService: RoomsService,
        @Inject(NOTIFICATION_PACKAGE) private readonly client: ClientGrpc,
    ) {
        this.notificationService = this.client.getService('NotificationService')
    }

    async findAll(skip: number, limit: number) {
        const reservations = await this.reservationsRepository.find({
            skip: skip,
            take: limit,
        })
        return reservations
    }

    async findOne(id: number) {
        const reservation = await this.reservationsRepository.findOne({ where: { id } })
        if (!reservation) throw new NotFoundException(`Reservation ${id} not found`)
        return reservation
    }

    async findByUser(userId: number) {
        return await this.reservationsRepository.find({ where: { user_id: userId } })
    }

    async create(data: CreateReservationDto) {
        const user = await this.usersService.findOne(data.user_id)
        const room = await this.roomsService.findOne(data.room_id)
        if (!user) throw new NotFoundException(`User ${data.user_id} not found`)
        if (!room) throw new NotFoundException(`Room ${data.room_id} not found`)

        const reservationData = {
            user_id: data.user_id,
            room_id: data.room_id,
            start_time: data.start_time,
            end_time: data.end_time,
            status: data.status,
        }

        const reservation = this.reservationsRepository.create(reservationData)
        const savedReservation = await this.reservationsRepository.save(reservation)

        if (!savedReservation || !savedReservation.id) {
            throw new Error('Failed to create reservation: no ID returned')
        }

        const notificationData = {
            reservationId: savedReservation.id,
            message: `Nouvelle réservation créée pour l'utilisateur ${data.user_id} dans la salle ${data.room_id}`,
            notificationDate: new Date().toISOString(),
        }

        try {
            await this.notificationService.createNotification(notificationData).toPromise()
        } catch (error) {
            console.log('Erreur lors de la création de notification gRPC:', error.message)
        }

        return savedReservation
    }

    async update(id: number, data: UpdateReservationDto) {
        console.log('Données reçues pour update:', data)
        const reservation = await this.findOne(id)
        // Rétrocompatibilité : convertir les anciens noms vers les nouveaux
        const updateData = {
            ...data,
            ...(data.startTime && { start_time: data.startTime }),
            ...(data.endTime && { end_time: data.endTime }),
        }

        const reservationData = {
            ...reservation,
            ...(updateData.start_time && { start_time: updateData.start_time }),
            ...(updateData.end_time && { end_time: updateData.end_time }),
            ...(updateData.status && { status: updateData.status }),
        }
        const updatedReservation = await this.reservationsRepository.save(reservationData)

        // Créer une notification pour la mise à jour via gRPC
        const notificationData = {
            reservationId: id,
            message: `Réservation ${id} mise à jour`,
            notificationDate: new Date().toISOString(),
        }

        try {
            await this.notificationService.createNotification(notificationData).toPromise()
        } catch (error) {
            console.log('Erreur lors de la création de notification gRPC pour mise à jour:', error.message)
        }

        return updatedReservation
    }

    async remove(id: number) {
        await this.reservationsRepository.delete(id)
    }
}
