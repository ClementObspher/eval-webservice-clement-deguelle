import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Room } from '../entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  @Query(() => [Room])
  @UseGuards(GqlAuthGuard)
  async listRooms(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    const rooms = await this.roomRepository.find({
      skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    return rooms.map((room) => ({
      ...room,
      id: room.id.toString(),
    }));
  }

  @Query(() => Room, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async room(@Args('id', { type: () => ID }) id: string) {
    return this.roomRepository.findOne({ where: { id: parseInt(id) } });
  }

  @Mutation(() => Room)
  @UseGuards(GqlAuthGuard)
  async createRoom(
    @Args('name') name: string,
    @Args('capacity', { type: () => Int }) capacity: number,
    @Args('location', { nullable: true }) location?: string,
  ) {
    const room = this.roomRepository.create({
      name,
      capacity,
      location,
    });
    return this.roomRepository.save(room);
  }

  @Mutation(() => Room)
  @UseGuards(GqlAuthGuard)
  async updateRoom(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('capacity', { type: () => Int, nullable: true }) capacity?: number,
    @Args('location', { nullable: true }) location?: string,
  ) {
    const room = await this.roomRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!room) {
      throw new Error('Room not found');
    }

    if (name) room.name = name;
    if (capacity) room.capacity = capacity;
    if (location !== undefined) room.location = location;

    return this.roomRepository.save(room);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteRoom(@Args('id', { type: () => ID }) id: string) {
    const result = await this.roomRepository.delete(parseInt(id));
    return (result.affected ?? 0) > 0;
  }
}
