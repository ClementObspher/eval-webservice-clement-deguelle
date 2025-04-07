import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'MA_SUPER_CLE_SECRETE',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Reservation, Room, User]),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService, AuthResolver],
})
export class AuthModule {}
