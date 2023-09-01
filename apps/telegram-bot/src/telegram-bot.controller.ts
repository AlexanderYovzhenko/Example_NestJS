import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TelegramBotService } from './telegram-bot.service';
import { RabbitService } from '@app/shared/services';
import {
  ConfirmCodeRequest,
  TelegramChat,
  ConfirmCode,
} from '@app/shared/interfaces';

@Controller()
export class TelegramBotController {
  constructor(
    @Inject('RABBIT_SERVICE')
    private readonly rabbitService: RabbitService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @MessagePattern({ cmd: 'telegram_health' })
  async health(@Ctx() context: RmqContext): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.telegramBotService.health();
  }

  @MessagePattern({ cmd: 'get_telegram_chat' })
  async getTelegramChat(
    @Ctx() context: RmqContext,
    @Payload('username') username: string,
  ): Promise<TelegramChat> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.telegramBotService.getTelegramChat(username);
  }

  @MessagePattern({ cmd: 'telegram_confirm_registration' })
  async telegramConfirmRegistration(
    @Ctx() context: RmqContext,
    @Payload('username') username: string,
  ): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.telegramBotService.telegramConfirmRegistration(username);
  }

  @MessagePattern({ cmd: 'send_confirm_code' })
  async sendConfirmCode(
    @Ctx() context: RmqContext,
    @Payload('username') username: string,
  ): Promise<string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.telegramBotService.sendConfirmCode(username);
  }

  @MessagePattern({ cmd: 'validation_confirm_code' })
  async validationConfirmCode(
    @Ctx() context: RmqContext,
    @Payload() confirmCodeRequest: ConfirmCodeRequest,
  ): Promise<string | boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.telegramBotService.validationConfirmCode(
      confirmCodeRequest,
    );
  }

  @MessagePattern({ cmd: 'get_confirm_code' })
  async getConfirmCode(
    @Ctx() context: RmqContext,
    @Payload('request_id') request_id: string,
  ): Promise<Partial<ConfirmCode>> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.telegramBotService.getConfirmCode(request_id);
  }
}
