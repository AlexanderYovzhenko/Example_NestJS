import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TelegramBotController } from './telegram-bot.controller';
import { TelegramBotService } from './telegram-bot.service';
import { ConfirmCode, TelegramChat } from './entities';
import { RabbitService } from '@app/shared/services';
import {
  ConfigSettingsModule,
  RabbitModule,
  SequelizeConnectModule,
} from '@app/shared/modules';

@Module({
  imports: [
    ConfigSettingsModule,
    RabbitModule,
    SequelizeConnectModule,
    SequelizeModule.forFeature([TelegramChat, ConfirmCode]),
  ],
  controllers: [TelegramBotController],
  providers: [
    TelegramBotService,
    {
      provide: 'RABBIT_SERVICE',
      useClass: RabbitService,
    },
  ],
})
export class TelegramBotModule {}
