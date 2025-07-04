import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { ExportService } from './services/export.service';
import { Reservation } from './entities/reservation.entity';
import { Room } from './entities/room.entity';
import { User } from './entities/user.entity';
import { NotificationEntity } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'pguser',
      password: process.env.DB_PASS || 'pgpass',
      database: process.env.DB_NAME || 'pgdb',
      entities: [Reservation, Room, User, NotificationEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, ExportService],
})
export class AppModule {}
