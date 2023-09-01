import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestIdDto } from './request-id.dto';
import {
  USER_PHONE_SHOULD_BE_LENGTH,
  USER_PHONE_SHOULD_BE_STRING,
  USER_PHONE_SHOULD_INCLUDE,
} from '@app/shared/constants';

export class UpdateUserPhoneDto extends RequestIdDto {
  @ApiProperty({
    example: '79221110500',
    description: 'phone number',
    required: false,
  })
  @IsString({ message: USER_PHONE_SHOULD_BE_STRING })
  @Length(11, 18, { message: USER_PHONE_SHOULD_BE_LENGTH })
  @Matches(/^[0-9]+$/, { message: USER_PHONE_SHOULD_INCLUDE })
  readonly phone: string;
}
