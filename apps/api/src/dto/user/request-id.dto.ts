import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  REQUEST_ID_SHOULD_BE_LENGTH,
  REQUEST_ID_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class RequestIdDto {
  @ApiProperty({
    example: 'Fw50',
    description: 'request id',
  })
  @IsString({ message: REQUEST_ID_SHOULD_BE_STRING })
  @Length(4, 4, { message: REQUEST_ID_SHOULD_BE_LENGTH })
  readonly request_id: string;
}
