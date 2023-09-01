import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CheckUserDto } from './check-user.dto';
import {
  USER_PHONE_SHOULD_BE_LENGTH,
  USER_PHONE_SHOULD_BE_STRING,
  USER_PHONE_SHOULD_INCLUDE,
  USER_TELEGRAM_SHOULD_BE_STRING,
  USER_TELEGRAM_SHOULD_INCLUDE,
} from '@app/shared/constants';

export class CreateUserDto extends CheckUserDto {
  @ApiProperty({
    example: 'nickname_telegram',
    description: 'nickname in telegram',
  })
  @IsString({ message: USER_TELEGRAM_SHOULD_BE_STRING })
  @Matches(/^[A-Za-z\d_]{5,32}$/, { message: USER_TELEGRAM_SHOULD_INCLUDE })
  readonly telegram: string;

  @ApiProperty({
    example: '79221110500',
    description: 'phone number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: USER_PHONE_SHOULD_BE_STRING })
  @Length(11, 18, { message: USER_PHONE_SHOULD_BE_LENGTH })
  @Matches(/^[0-9]+$/, { message: USER_PHONE_SHOULD_INCLUDE })
  readonly phone?: string;
}
