import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import {
  CustomValidatorRole,
  roles,
} from '../custom-validators/validator-role';
import {
  USERS_MAXIMUM_LIMIT,
  QUERY_LIMIT_MAX,
  QUERY_LIMIT_MIN,
  QUERY_LIMIT_SHOULD_BE_NUMBER,
  QUERY_OFFSET_MIN,
  QUERY_OFFSET_SHOULD_BE_NUMBER,
  USER_ROLE_IS_NOT_CORRECT,
  USER_ROLE_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class GetUsersQueryDto {
  @ApiProperty({
    example: 50,
    description: 'limit users',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: QUERY_LIMIT_SHOULD_BE_NUMBER })
  @Min(0, { message: QUERY_LIMIT_MIN + 0 })
  @Max(USERS_MAXIMUM_LIMIT, {
    message: QUERY_LIMIT_MAX + USERS_MAXIMUM_LIMIT,
  })
  readonly limit?: number;

  @ApiProperty({
    example: 0,
    description: 'offset users',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: QUERY_OFFSET_SHOULD_BE_NUMBER })
  @Min(0, { message: QUERY_OFFSET_MIN + 0 })
  readonly offset?: number;

  @ApiProperty({
    example: 'webmaster',
    description: 'users role',
    required: false,
  })
  @IsOptional()
  @IsString({ message: USER_ROLE_SHOULD_BE_STRING })
  @Validate(CustomValidatorRole, {
    message: USER_ROLE_IS_NOT_CORRECT + roles,
  })
  readonly role?: string;
}
