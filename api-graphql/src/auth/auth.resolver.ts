/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginResponse } from './types/login-response.type';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    const token = await this.authService.loginWithKeycloak(
      input.email,
      input.password,
    );
    return { accessToken: token };
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() userId: { userId: string }) {
    return this.userRepository.findOne({
      where: { id: parseInt(userId.userId) },
    });
  }
}
