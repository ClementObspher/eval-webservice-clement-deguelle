import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { Room } from './entities/room.entity'
import { Reservation } from './entities/reservation.entity'
import { User } from './entities/user.entity'
import { Notification } from './entities/notification.entity'
import { RoomResolver } from './resolvers/room.resolver'
import { ReservationResolver } from './resolvers/reservation.resolver'
import { UserResolver } from './resolvers/user.resolver'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST ?? 'db',
            port: parseInt(process.env.DB_PORT ?? '5432'),
            username: process.env.DB_USERNAME ?? 'pguser',
            password: process.env.DB_PASSWORD ?? 'pgpass',
            database: process.env.DB_NAME ?? 'pgdb',
            entities: [Room, Reservation, User, Notification],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Room, Reservation, User, Notification]),
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
