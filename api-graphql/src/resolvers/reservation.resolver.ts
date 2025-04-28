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
        @Args('user_id', { type: () => Int }) userId: number,
        @Args('room_id', { type: () => Int }) roomId: number,
        @Args('start_time') startTime: Date,
        @Args('end_time') endTime: Date,
    ) {
        const reservation = this.reservationRepository.create({
            user_id: userId,
            room_id: roomId,
            start_time: startTime,
            end_time: endTime,
        })
        const savedReservation = await this.reservationRepository.save(reservation)

        // Créer une notification pour la nouvelle réservation
        const notification = this.notificationRepository.create({
            id: uuidv4(),
            reservationId: savedReservation.id,
            message: `Nouvelle réservation créée pour l'utilisateur ${userId} dans la salle ${roomId}`,
            notificationDate: new Date(),
        })
        await this.notificationRepository.save(notification)

        return savedReservation
    }

    @Mutation(() => Reservation)
    @UseGuards(GqlAuthGuard)
    async updateReservation(
        @Args('id', { type: () => ID }) id: string,
        @Args('user_id', { type: () => Int, nullable: true }) userId?: number,
        @Args('room_id', { type: () => Int, nullable: true }) roomId?: number,
        @Args('start_time', { nullable: true }) startTime?: Date,
        @Args('end_time', { nullable: true }) endTime?: Date,
    ) {
        const reservation = await this.reservationRepository.findOne({
            where: { id: parseInt(id) },
        })
        if (!reservation) {
            throw new Error('Reservation not found')
        }

        if (userId) reservation.user_id = userId
        if (roomId) reservation.room_id = roomId
        if (startTime) reservation.start_time = startTime
        if (endTime) reservation.end_time = endTime

        return this.reservationRepository.save(reservation)
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteReservation(@Args('id', { type: () => ID }) id: string) {
        const result = await this.reservationRepository.delete(id)
        return (result.affected ?? 0) > 0
    }
}
