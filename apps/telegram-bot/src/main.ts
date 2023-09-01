import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { TelegramBotModule } from './telegram-bot.module';
import { RabbitService } from '@app/shared/services';

async function bootstrap() {
  const app = await NestFactory.create(TelegramBotModule);

  const configService = app.get(ConfigService);
  const rabbitService = app.get(RabbitService);

  const queue = configService.get('RABBIT_TELEGRAM_BOT_QUEUE');

  app.connectMicroservice(rabbitService.getRmqOptions(queue));
  app.startAllMicroservices();
}

bootstrap();
