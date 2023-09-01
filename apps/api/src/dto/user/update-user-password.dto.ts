import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestIdDto } from './request-id.dto';
import {
  USER_PASSWORD_SHOULD_BE_LENGTH,
  USER_PASSWORD_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class UpdateUserPasswordDto extends RequestIdDto {
  @ApiProperty({
    example: 'password',
    description: 'user password',
  })
  @IsString({ message: USER_PASSWORD_SHOULD_BE_STRING })
  @Length(8, 50, { message: USER_PASSWORD_SHOULD_BE_LENGTH })
  readonly password: string;
}
