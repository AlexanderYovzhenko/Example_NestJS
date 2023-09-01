import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CONFIRM_CODE_SHOULD_BE_LENGTH,
  CONFIRM_CODE_SHOULD_BE_STRING,
  REQUEST_ID_SHOULD_BE_LENGTH,
  REQUEST_ID_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class ConfirmCodeRequestDto {
  @ApiProperty({
    example: 'Fw50',
    description: 'request id',
  })
  @IsString({ message: REQUEST_ID_SHOULD_BE_STRING })
  @Length(4, 4, { message: REQUEST_ID_SHOULD_BE_LENGTH })
  readonly request_id: string;

  @ApiProperty({
    example: 'w9YT',
    description: 'confirmation code from telegram',
  })
  @IsString({ message: CONFIRM_CODE_SHOULD_BE_STRING })
  @Length(4, 4, { message: CONFIRM_CODE_SHOULD_BE_LENGTH })
  readonly confirm_code: string;
}
