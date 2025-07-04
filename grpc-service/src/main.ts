import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(__dirname, '..', 'src', 'proto', 'service.proto'),
        url: process.env.GRPC_URL || 'localhost:50051',
      },
    },
  );
  await app.listen();
}
bootstrap();
