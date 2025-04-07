import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Reservation } from '../entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  @Query(() => [Reservation])
  @UseGuards(GqlAuthGuard)
  async listReservations(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.reservationRepository.find({
      skip,
      take: limit,
    });
  }

  @Query(() => Reservation, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async reservation(@Args('id', { type: () => ID }) id: string) {
    return this.reservationRepository.findOne({ where: { id: parseInt(id) } });
  }

  @Mutation(() => Reservation)
  @UseGuards(GqlAuthGuard)
  async createReservation(
    @Args('userId') userId: string,
    @Args('roomId') roomId: string,
    @Args('startTime') startTime: Date,
    @Args('endTime') endTime: Date,
  ) {
    const reservation = this.reservationRepository.create({
      user_id: parseInt(userId),
      room_id: parseInt(roomId),
      start_time: startTime,
      end_time: endTime,
    });
    return this.reservationRepository.save(reservation);
  }

  @Mutation(() => Reservation)
  @UseGuards(GqlAuthGuard)
  async updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('userId', { nullable: true }) userId?: string,
    @Args('roomId', { nullable: true }) roomId?: string,
    @Args('startTime', { nullable: true }) startTime?: Date,
    @Args('endTime', { nullable: true }) endTime?: Date,
  ) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (userId) reservation.user_id = parseInt(userId);
    if (roomId) reservation.room_id = parseInt(roomId);
    if (startTime) reservation.start_time = startTime;
    if (endTime) reservation.end_time = endTime;

    return this.reservationRepository.save(reservation);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteReservation(@Args('id', { type: () => ID }) id: string) {
    const result = await this.reservationRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
