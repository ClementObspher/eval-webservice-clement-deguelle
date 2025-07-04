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

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'pguser',
            password: process.env.DB_PASS || 'pgpass',
            database: process.env.DB_NAME || 'pgdb',
            entities: [Reservation, Room, User],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Reservation, Room, User]),
        AuthModule,
        PassportModule,
    ],
    controllers: [ReservationsController, RoomsController, UsersController, AuthController],
    providers: [ReservationsService, RoomsService, UsersService, JwtService, CsvExportService, AuthService, MinioService],
})
export class AppModule {}
