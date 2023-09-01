import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_TELEGRAM_SHOULD_BE_STRING,
  USER_TELEGRAM_SHOULD_INCLUDE,
} from '@app/shared/constants';

export class UpdateUserTelegramDto {
  @ApiProperty({
    example: 'nickname_telegram',
    description: 'nickname in telegram',
  })
  @IsString({ message: USER_TELEGRAM_SHOULD_BE_STRING })
  @Matches(/^[A-Za-z\d_]{5,32}$/, { message: USER_TELEGRAM_SHOULD_INCLUDE })
  readonly telegram: string;
}
