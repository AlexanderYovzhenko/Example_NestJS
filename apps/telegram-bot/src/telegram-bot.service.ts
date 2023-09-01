import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import * as TelegramBot from 'node-telegram-bot-api';
import { nanoid } from 'nanoid/async';
import { ConfirmCode, TelegramChat } from './entities';
import {
  TelegramBotCommandList,
  TelegramBotCommandListDescription,
  TELEGRAM_CONFIRMED,
  TELEGRAM_NOT_USERNAME,
  CONFIRM_CODE_MSG,
} from '@app/shared/constants';
import {
  TelegramChat as TelegramChatInterface,
  ConfirmCode as ConfirmCodeInterface,
  ConfirmCodeRequest,
} from '@app/shared/interfaces';
import { convertToMillisecondsUtil } from '@app/shared/utils';

@Injectable()
export class TelegramBotService {
  private readonly telegramBot: TelegramBot;

  constructor(
    @InjectModel(TelegramChat)
    private readonly telegramChatRepository: Repository<TelegramChat>,
    @InjectModel(ConfirmCode)
    private readonly confirmCodeRepository: Repository<ConfirmCode>,
    private readonly configService: ConfigService,
  ) {
    const token = this.configService.get('TELEGRAM_BOT_ACCESS_TOKEN');

    this.telegramBot = new TelegramBot(token, { polling: true });

    this.telegramBot.setMyCommands([
      {
        command: '/start',
        description: TelegramBotCommandListDescription.START,
      },
    ]);

    this.telegramBot.on('polling_error', () => {
      this.telegramBot.stopPolling({ cancel: true });

      const timer = setTimeout(() => {
        this.telegramBot.startPolling({ polling: true });
      }, 3000);

      clearTimeout(timer);
    });

    this.telegramBot.onText(TelegramBotCommandList.START, async ({ chat }) => {
      const { username, id } = chat;

      if (!username) {
        return this.telegramBot.sendMessage(id, TELEGRAM_NOT_USERNAME);
      }

      const telegramChat = await this.getTelegramChat(username);

      if (!telegramChat) {
        await this.createTelegramChat(chat);

        return this.telegramBot.sendMessage(id, TELEGRAM_CONFIRMED);
      }

      if (telegramChat.is_blocked) {
        await this.updateTelegramChat(username, false);
      }

      return this.telegramBot.sendMessage(id, TELEGRAM_CONFIRMED);
    });
  }

  async health(): Promise<boolean> {
    return true;
  }

  // Telegram chat
  async getTelegramChat(username: string): Promise<TelegramChat> {
    const usernameLowerCase = username.toLocaleLowerCase();

    const telegramChat = await this.telegramChatRepository.findOne({
      where: {
        username: usernameLowerCase,
      },
    });

    return telegramChat;
  }

  async telegramConfirmRegistration(username: string): Promise<boolean> {
    const telegramChat = await this.getTelegramChat(username);

    return telegramChat ? true : false;
  }

  // Confirm code
  async sendConfirmCode(username: string): Promise<string> {
    try {
      const telegramChat = await this.getTelegramChat(username);

      if (!telegramChat) {
        return null;
      }

      if (telegramChat.is_blocked) {
        return 'telegram_bot_blocked';
      }

      const requestId = await this.generationCode();
      const confirmCode = await this.generationCode();

      await this.createConfirmCode(requestId, confirmCode);

      const confirmCodeMsg = `${CONFIRM_CODE_MSG}${confirmCode}`;
      await this.telegramBot.sendMessage(telegramChat.chat_id, confirmCodeMsg);

      return requestId;
    } catch (error) {
      await this.updateTelegramChat(username, true);

      return 'telegram_bot_blocked';
    }
  }

  async validationConfirmCode(
    confirmCodeRequest: ConfirmCodeRequest,
  ): Promise<string | boolean> {
    const { request_id, confirm_code } = confirmCodeRequest;

    const checkConfirmCode = await this.getConfirmCode(request_id);

    if (!checkConfirmCode) {
      return null;
    }

    if (confirm_code !== checkConfirmCode.code) {
      return false;
    }

    const lifeTimeConfirmCode = convertToMillisecondsUtil(
      await this.configService.get('CONFIRM_CODE_LIFETIME'),
    );

    if (
      Date.now() - new Date(checkConfirmCode.created_at).getTime() >
      lifeTimeConfirmCode
    ) {
      return 'code_expired';
    }

    await this.updateConfirmCode(request_id, true);

    return true;
  }

  async getConfirmCode(
    request_id: string,
  ): Promise<Partial<ConfirmCodeInterface>> {
    const confirmCode = await this.confirmCodeRepository.findOne({
      where: {
        request_id,
      },
    });

    return confirmCode;
  }

  // Private methods
  // Telegram chat to db methods
  private async createTelegramChat(
    chat: TelegramBot.Chat,
  ): Promise<TelegramChatInterface> {
    const { username, first_name, id: chat_id } = chat;

    const correctFormatChat = {
      username: username.toLowerCase(),
      first_name,
      chat_id: chat_id.toString(),
    };

    const newTelegramChat = await this.telegramChatRepository.create(
      correctFormatChat,
    );

    return newTelegramChat;
  }

  private async updateTelegramChat(
    username: string,
    is_blocked: boolean,
  ): Promise<void> {
    const usernameLowerCase = username.toLocaleLowerCase();

    await this.telegramChatRepository.update(
      { is_blocked },
      { where: { username: usernameLowerCase } },
    );
  }

  // Confirm code to db methods
  private async createConfirmCode(
    request_id: string,
    code: string,
  ): Promise<void> {
    await this.confirmCodeRepository.create({
      request_id,
      code,
    });
  }

  private async updateConfirmCode(
    request_id: string,
    is_confirmed: boolean,
  ): Promise<void> {
    await this.confirmCodeRepository.update(
      { is_confirmed },
      { where: { request_id } },
    );
  }

  // Generation of code
  private async generationCode(): Promise<string> {
    const lengthConfirmCode = await this.configService.get(
      'CONFIRM_CODE_LENGTH',
    );

    return await nanoid(+lengthConfirmCode);
  }
}
