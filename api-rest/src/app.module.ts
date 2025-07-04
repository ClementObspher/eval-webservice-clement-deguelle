import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Reservation } from './entities/reservation.entity'
import { Room } from './entities/room.entity'
import { User } from './entities/user.entity'
import { ReservationsController } from './reservations/reservations.controller'
import { RoomsController } from './rooms/rooms.controller'
import { UsersController } from './users/users.controller'
import { ReservationsService } from './reservations/reservations.service'
import { RoomsService } from './rooms/rooms.service'
import { UsersService } from './users/users.service'
import { AuthModule } from './auth/jwt/jwt.module'
import { PassportModule } from '@nestjs/passport'
import { CsvExportService } from './common/csv-export.service'
import { MinioService } from './common/miniio.service'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { NOTIFICATION_PACKAGE } from './common/constants'
import { join } from 'path'

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST ?? 'db',
            port: parseInt(process.env.DB_PORT ?? '5432'),
            username: process.env.DB_USERNAME ?? 'pguser',
            password: process.env.DB_PASSWORD ?? 'pgpass',
            database: process.env.DB_NAME ?? 'pgdb',
            entities: [Reservation, Room, User],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Reservation, Room, User]),
        AuthModule,
        PassportModule,
        ClientsModule.register([
            {
                name: NOTIFICATION_PACKAGE,
                transport: Transport.GRPC,
                options: {
                    url: process.env.GRPC_URL ?? 'grpc-service:50051',
                    package: 'notification',
                    protoPath: join(__dirname, '../proto/service.proto'),
                },
            },
        ]),
    ],
    controllers: [ReservationsController, RoomsController, UsersController, AuthController],
    providers: [ReservationsService, RoomsService, UsersService, JwtService, CsvExportService, AuthService, MinioService],
})
export class AppModule {}
