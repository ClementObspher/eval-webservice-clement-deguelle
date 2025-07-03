import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql'
import { Reservation } from '../entities/reservation.entity'
import { Notification } from '../entities/notification.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { UseGuards } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

@Resolver(() => Reservation)
export class ReservationResolver {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    @Query(() => [Reservation])
    @UseGuards(GqlAuthGuard)
    async listReservations(@Args('skip', { nullable: true, type: () => Int }) skip?: number, @Args('limit', { nullable: true, type: () => Int }) limit?: number) {
        return this.reservationRepository.find({
            skip,
            take: limit,
        })
    }

    @Query(() => Reservation, { nullable: true })
    @UseGuards(GqlAuthGuard)
    async reservation(@Args('id', { type: () => ID }) id: string) {
        return this.reservationRepository.findOne({ where: { id: parseInt(id) } })
    }

    @Mutation(() => Reservation)
    @UseGuards(GqlAuthGuard)
    async createReservation(
        @Args('user_id', { type: () => ID }) user_id: string,
        @Args('room_id', { type: () => ID }) room_id: string,
        @Args('start_time') start_time: Date,
        @Args('end_time') end_time: Date,
    ) {
        const reservation = this.reservationRepository.create({
            user_id: parseInt(user_id),
            room_id: parseInt(room_id),
            start_time: start_time,
            end_time: end_time,
            status: 'pending',
        })
        const savedReservation = await this.reservationRepository.save(reservation)

        // Créer une notification pour la nouvelle réservation
        const notification = this.notificationRepository.create({
            id: uuidv4(),
            reservation_id: savedReservation.id,
            message: `Nouvelle réservation créée pour l'utilisateur ${user_id} dans la salle ${room_id}`,
            notification_date: new Date(),
        })
        await this.notificationRepository.save(notification)

        return savedReservation
    }

    @Mutation(() => Reservation)
    @UseGuards(GqlAuthGuard)
    async updateReservation(
        @Args('id', { type: () => ID }) id: string,
        @Args('user_id', { type: () => ID, nullable: true }) user_id?: string,
        @Args('room_id', { type: () => ID, nullable: true }) room_id?: string,
        @Args('start_time', { nullable: true }) start_time?: Date,
        @Args('end_time', { nullable: true }) end_time?: Date,
    ) {
        const reservation = await this.reservationRepository.findOne({
            where: { id: parseInt(id) },
        })
        if (!reservation) {
            throw new Error('Reservation not found')
        }

        if (user_id) reservation.user_id = parseInt(user_id)
        if (room_id) reservation.room_id = parseInt(room_id)
        if (start_time) reservation.start_time = start_time
        if (end_time) reservation.end_time = end_time

        return this.reservationRepository.save(reservation)
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteReservation(@Args('id', { type: () => ID }) id: string) {
        const result = await this.reservationRepository.delete(id)
        return (result.affected ?? 0) > 0
    }
}
