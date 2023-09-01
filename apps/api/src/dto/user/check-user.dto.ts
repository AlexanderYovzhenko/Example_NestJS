import {
  IsString,
  Length,
  Matches,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_LOGIN_SHOULD_BE_LENGTH,
  USER_LOGIN_SHOULD_BE_STRING,
  USER_LOGIN_SHOULD_INCLUDE,
  USER_LOGIN_SHOULD_START,
  USER_PASSWORD_SHOULD_BE_LENGTH,
  USER_PASSWORD_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class CheckUserDto {
  @ApiProperty({
    example: 'nickname',
    description: 'user login',
  })
  @IsString({ message: USER_LOGIN_SHOULD_BE_STRING })
  @Length(3, 30, { message: USER_LOGIN_SHOULD_BE_LENGTH })
  @Matches(/^[A-Za-z0-9][A-Za-z0-9_-]+$/, {
    message: (validationArguments: ValidationArguments) => {
      const login = validationArguments.value;

      if (!login) {
        return USER_LOGIN_SHOULD_START;
      }

      return login[0] === '-' || login[0] === '_'
        ? USER_LOGIN_SHOULD_START
        : USER_LOGIN_SHOULD_INCLUDE;
    },
  })
  readonly login: string;

  @ApiProperty({
    example: 'password',
    description: 'user password',
  })
  @IsString({ message: USER_PASSWORD_SHOULD_BE_STRING })
  @Length(8, 50, { message: USER_PASSWORD_SHOULD_BE_LENGTH })
  readonly password: string;
}
