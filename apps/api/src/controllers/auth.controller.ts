import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Inject,
  Post,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CheckUserDto, CreateUserDto, RefreshTokenDto } from '../dto';
import {
  schemaDeleteRefreshToken,
  schemaStatus,
  schemaTokens,
  schemaError400,
  schemaError401,
  schemaError403,
  schemaErrorWrongLoginPassword403,
  schemaError409,
} from '../schemas-response-swagger';
import { Public } from '../common/decorators';
import {
  TELEGRAM_NOT_CONFIRMED,
  UNAUTHORIZED,
  USER_LOGIN_EXISTS,
  USER_NOT_SAVED,
  USER_PHONE_EXISTS,
  USER_TELEGRAM_EXISTS,
  USER_WRONG_LOGIN_PASSWORD,
} from '@app/shared/constants';
import { Status, Tokens } from '@app/shared/interfaces';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'check health - only for endpoint of health' })
  @ApiOkResponse({ schema: schemaStatus })
  @Get('health')
  async health(): Promise<Status> {
    const status: boolean = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'auth_health',
        },

        {},
      ),
    );

    return { status, message: 'auth is running' };
  }

  @ApiOperation({ summary: 'signup' })
  @ApiCreatedResponse({ schema: schemaTokens })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiConflictResponse({ schema: schemaError409 })
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    const tokens: Tokens | string = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'signup',
        },

        { user },
      ),
    );

    if (!tokens) {
      throw new InternalServerErrorException(USER_NOT_SAVED);
    }

    switch (tokens) {
      case 'login_exists':
        throw new ConflictException(USER_LOGIN_EXISTS);
      case 'telegram_exists':
        throw new ConflictException(USER_TELEGRAM_EXISTS);
      case 'phone_exists':
        throw new ConflictException(USER_PHONE_EXISTS);
      case 'telegram_not_confirmed':
        throw new ForbiddenException(TELEGRAM_NOT_CONFIRMED);
    }

    if (typeof tokens !== 'string') {
      return { ...tokens.accessToken, ...tokens.refreshToken };
    }
  }

  @ApiOperation({ summary: 'login' })
  @ApiCreatedResponse({ schema: schemaTokens })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiForbiddenResponse({ schema: schemaErrorWrongLoginPassword403 })
  @Post('login')
  async logIn(@Body() user: CheckUserDto) {
    const tokens: Tokens = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'login',
        },

        { user },
      ),
    );

    if (!tokens) {
      throw new ForbiddenException(USER_WRONG_LOGIN_PASSWORD);
    }

    return { ...tokens.accessToken, ...tokens.refreshToken };
  }

  @ApiOperation({ summary: 'refresh access token' })
  @ApiCreatedResponse({ schema: schemaTokens })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    const refresh_token = refreshToken.refresh_token;

    if (!refresh_token) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    const tokens: Tokens = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'refresh',
        },

        { refresh_token },
      ),
    );

    if (!tokens) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return { ...tokens.accessToken, ...tokens.refreshToken };
  }

  @ApiOperation({ summary: 'logout' })
  @ApiOkResponse({ schema: schemaDeleteRefreshToken })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  async logOut(@Body() refreshToken: RefreshTokenDto) {
    const refresh_token = refreshToken.refresh_token;

    if (!refresh_token) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    const isLogout: boolean = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'logout',
        },

        { refresh_token },
      ),
    );

    if (typeof isLogout !== 'boolean' && !isLogout) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return { isLogout };
  }
}
