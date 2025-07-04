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
      host: process.env.DB_HOST ?? 'db',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME ?? 'pguser',
      password: process.env.DB_PASSWORD ?? 'pgpass',
      database: process.env.DB_NAME ?? 'pgdb',
      entities: [Reservation, Room, User, NotificationEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NotificationEntity, Reservation]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, ExportService],
})
export class AppModule {}
