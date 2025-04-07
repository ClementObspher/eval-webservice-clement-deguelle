import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './jwt.service'
import { JwtStrategy } from './jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reservation } from 'src/entities/reservation.entity'
import { Room } from 'src/entities/room.entity'
import { User } from 'src/entities/user.entity'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'MA_SUPER_CLE_SECRETE', // À externaliser en variable d'environnement
            signOptions: { expiresIn: '1d' }, // ex: 1 jour
        }),
        TypeOrmModule.forFeature([Reservation, Room, User]),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
