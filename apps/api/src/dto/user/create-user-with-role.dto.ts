import { IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  CustomValidatorRole,
  roles,
} from '../custom-validators/validator-role';
import {
  USER_ROLE_IS_NOT_CORRECT,
  USER_ROLE_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class CreateUserWithRoleDto extends CreateUserDto {
  @ApiProperty({
    example: 'curator',
    description: 'user role',
  })
  @IsString({ message: USER_ROLE_SHOULD_BE_STRING })
  @Validate(CustomValidatorRole, {
    message: USER_ROLE_IS_NOT_CORRECT + roles,
  })
  readonly role: string;
}
