import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  Validate,
  IsDefined,
} from 'class-validator';
import {
  CustomValidatorRole,
  roles,
} from '../custom-validators/validator-role';
import {
  QUERY_SEARCH_SHOULD_BE,
  QUERY_SEARCH_SHOULD_BE_LENGTH,
  USER_ROLE_IS_NOT_CORRECT,
  USER_ROLE_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class SearchUsersQueryDto {
  @ApiProperty({
    example: 'nickname',
    description: 'id or name or telegram',
    required: true,
  })
  @IsDefined({ message: QUERY_SEARCH_SHOULD_BE })
  @MinLength(3, { message: QUERY_SEARCH_SHOULD_BE_LENGTH })
  readonly search: string;

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
