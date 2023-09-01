import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { RabbitService } from '@app/shared/services';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);
  const rabbitService = app.get(RabbitService);

  const queue = configService.get('RABBIT_AUTH_QUEUE');

  app.connectMicroservice(rabbitService.getRmqOptions(queue));
  app.startAllMicroservices();
}

bootstrap();
