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
            host: 'localhost',
            port: 5432,
            username: 'pguser',
            password: 'pgpass',
            database: 'pgdb',
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
                    url: 'localhost:50051',
                    package: 'notification',
                    protoPath: join(__dirname, '../../grpc-service/src/proto/service.proto'),
                },
            },
        ]),
    ],
    controllers: [ReservationsController, RoomsController, UsersController, AuthController],
    providers: [ReservationsService, RoomsService, UsersService, JwtService, CsvExportService, AuthService, MinioService],
})
export class AppModule {}
