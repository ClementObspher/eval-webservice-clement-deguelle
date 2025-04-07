import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async listUsers(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.userRepository.find({
      skip,
      take: limit,
    });
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.userRepository.findOne({ where: { id: parseInt(id) } });
  }
}
