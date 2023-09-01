import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_ID_SHOULD_BE_NUMBER,
  USER_OVER_USER_ID_SHOULD_BE_NUMBER,
} from '@app/shared/constants';

export class UpdateOverUserDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @IsInt({ message: USER_ID_SHOULD_BE_NUMBER })
  readonly user_id: number;

  @ApiProperty({
    example: 2,
    description: 'over user (manager) id',
  })
  @IsInt({ message: USER_OVER_USER_ID_SHOULD_BE_NUMBER })
  readonly over_user_id: number;
}
