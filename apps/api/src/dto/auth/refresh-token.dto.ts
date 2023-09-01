import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { REFRESH_TOKEN_SHOULD_BE_STRING } from '@app/shared/constants';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibG9naW4iOiJuaWNrbmFtZSIsImlhdCI6MTY4ODUzODA5OSwiZXhwIjoxNjg4NTM5ODk5fQ.1bKzIyaXArJf_-IxKiwQD4JVX5XX2GEayz5RsVJ7eM8',
    description: 'refresh token',
  })
  @IsString({ message: REFRESH_TOKEN_SHOULD_BE_STRING })
  readonly refresh_token: string;
}
