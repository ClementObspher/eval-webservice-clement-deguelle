import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { Room } from './entities/room.entity';
import { Reservation } from './entities/reservation.entity';
import { User } from './entities/user.entity';
import { RoomResolver } from './resolvers/room.resolver';
import { ReservationResolver } from './resolvers/reservation.resolver';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [Room, Reservation, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Room, Reservation, User]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    AuthModule,
  ],
  providers: [RoomResolver, ReservationResolver, UserResolver],
  controllers: [],
})
export class AppModule {}
