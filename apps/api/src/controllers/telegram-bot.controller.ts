import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Body,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ConfirmCodeRequestDto } from '../dto';
import {
  schemaStatus,
  schemaConfirmRequest,
  schemaValidationConfirmCode,
  schemaCheckTelegramChat,
  schemaError404,
  schemaError403,
  schemaError400,
  schemaError409,
} from '../schemas-response-swagger';
import { Public } from '../common/decorators';
import {
  CONFIRM_CODE_EXPIRED,
  REQUEST_ID_NOT_FOUND,
  TELEGRAM_BOT_BLOCKED,
  TELEGRAM_CHAT_NOT_FOUND,
} from '@app/shared/constants';
import {
  ConfirmCodeRequest,
  Status,
  TelegramChat,
} from '@app/shared/interfaces';

@ApiTags('Telegram Bot')
@Public()
@Controller('telegram')
export class TelegramBotController {
  constructor(
    @Inject('TELEGRAM_BOT_SERVICE')
    private readonly telegramBotService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'check health - only for endpoint of health' })
  @ApiOkResponse({ schema: schemaStatus })
  @Get('health')
  async health(): Promise<Status> {
    const status: boolean = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'telegram_health',
        },

        {},
      ),
    );

    return { status, message: 'telegram is running' };
  }

  @ApiOperation({ summary: 'check telegram chat' })
  @ApiOkResponse({ schema: schemaCheckTelegramChat })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @Get('chat/:telegram')
  async checkTelegramChat(
    @Param('telegram') telegram: string,
  ): Promise<{ isChat: boolean }> {
    const telegramChat: TelegramChat = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'get_telegram_chat',
        },

        { username: telegram },
      ),
    );

    if (!telegramChat) {
      throw new NotFoundException(TELEGRAM_CHAT_NOT_FOUND);
    }

    if (telegramChat.is_blocked) {
      throw new ForbiddenException(TELEGRAM_BOT_BLOCKED);
    }

    return { isChat: true };
  }

  @ApiOperation({ summary: 'send confirmation code to telegram' })
  @ApiCreatedResponse({ schema: schemaConfirmRequest })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @HttpCode(HttpStatus.CREATED)
  @Get('code/:telegram')
  async sendConfirmCode(
    @Param('telegram') telegram: string,
  ): Promise<Pick<ConfirmCodeRequest, 'request_id'>> {
    const request_id: string = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'send_confirm_code',
        },

        { username: telegram },
      ),
    );

    if (!request_id) {
      throw new NotFoundException(TELEGRAM_CHAT_NOT_FOUND);
    }

    if (request_id === 'telegram_bot_blocked') {
      throw new ForbiddenException(TELEGRAM_BOT_BLOCKED);
    }

    return { request_id };
  }

  @ApiOperation({ summary: 'validation of confirmation code' })
  @ApiOkResponse({ schema: schemaValidationConfirmCode })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @ApiConflictResponse({ schema: schemaError409 })
  @HttpCode(HttpStatus.OK)
  @Post('code/validation')
  async validationConfirmCode(
    @Body() confirmCodeRequest: ConfirmCodeRequestDto,
  ): Promise<{ isValidConfirmCode: boolean }> {
    const isValidConfirmCode: string | boolean = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'validation_confirm_code',
        },

        confirmCodeRequest,
      ),
    );

    if (typeof isValidConfirmCode !== 'boolean' && !isValidConfirmCode) {
      throw new NotFoundException(REQUEST_ID_NOT_FOUND);
    }

    if (isValidConfirmCode === 'code_expired') {
      throw new ConflictException(CONFIRM_CODE_EXPIRED);
    }

    if (typeof isValidConfirmCode === 'boolean') {
      return { isValidConfirmCode };
    }
  }
}
