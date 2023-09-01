import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PublicationModule } from './publication.module';
import { RabbitService } from '@app/shared/services';

async function bootstrap() {
  const app = await NestFactory.create(PublicationModule);

  const configService = app.get(ConfigService);
  const rabbitService = app.get(RabbitService);

  const queue = configService.get('RABBIT_PUBLICATION_QUEUE');

  app.connectMicroservice(rabbitService.getRmqOptions(queue));
  app.startAllMicroservices();
}

bootstrap();
