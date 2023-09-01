import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_BAN_SHOULD_BE_BOOLEAN,
  USER_ID_SHOULD_BE_NUMBER,
} from '@app/shared/constants';

export class UpdateBanDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @IsInt({ message: USER_ID_SHOULD_BE_NUMBER })
  readonly user_id: number;

  @ApiProperty({
    example: 'true',
    description: 'is ban - true or false',
  })
  @IsOptional()
  @IsBoolean({ message: USER_BAN_SHOULD_BE_BOOLEAN })
  readonly is_ban: boolean;
}
