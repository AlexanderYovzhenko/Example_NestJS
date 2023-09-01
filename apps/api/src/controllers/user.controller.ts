import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SkipThrottle } from '@nestjs/throttler';
import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  schemaStatus,
  schemaAddRoles,
  schemaAddAdmin,
  schemaUser,
  schemaUsers,
  schemaUserWithOverUsers,
  schemaError400,
  schemaError401,
  schemaError403,
  schemaError404,
  schemaError409,
} from '../schemas-response-swagger';
import {
  CreateUserDto,
  CreateUserWithRoleDto,
  GetUsersQueryDto,
  SearchUsersQueryDto,
  UpdateBanDto,
  UpdateOverUserDto,
  UpdateUserPasswordDto,
  UpdateUserPhoneDto,
  UpdateUserTelegramDto,
} from '../dto';
import { GetCurrentUser, Public, Roles } from '../common/decorators';
import {
  CONFIRM_CODE_NOT_CONFIRMED,
  USER_ADMIN_ALREADY_EXIST,
  USER_LOGIN_EXISTS,
  USER_OVER_USER_UPDATE_ROLE_IDENTICAL,
  USER_OVER_USER_UPDATE_ROLE_IS_NOT_CORRECT,
  USER_NOT_FOUND,
  USER_PHONE_EXISTS,
  USER_TELEGRAM_EXISTS,
  USER_UPDATE_ROLE_IS_NOT_CORRECT,
  USER_ADMIN_CANNOT_DELETE,
  TELEGRAM_NOT_CONFIRMED,
} from '@app/shared/constants';
import { ConfirmCode, Status, User } from '@app/shared/interfaces';

@ApiTags('User')
@SkipThrottle()
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
    @Inject('TELEGRAM_BOT_SERVICE')
    private readonly telegramBotService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'check health - only for endpoint of health' })
  @ApiOkResponse({ schema: schemaStatus })
  @Public()
  @SkipThrottle(false)
  @Get('health')
  async health(): Promise<Status> {
    const status: boolean = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'user_health',
        },

        {},
      ),
    );

    return { status, message: 'user is running' };
  }

  @ApiOperation({ summary: 'add roles - use once when starting the server' })
  @ApiCreatedResponse({ schema: schemaAddRoles })
  @Public()
  @SkipThrottle(false)
  @HttpCode(HttpStatus.CREATED)
  @Post('add-roles')
  async addRoles(): Promise<{ isAddRoles: boolean }> {
    const isAddRoles: boolean = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'add_roles',
        },

        {},
      ),
    );

    return { isAddRoles };
  }

  @ApiOperation({ summary: 'add admin - use once when starting the server' })
  @ApiCreatedResponse({ schema: schemaAddAdmin })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiConflictResponse({ schema: schemaError409 })
  @Public()
  @SkipThrottle(false)
  @Post('add-admin')
  async addAdmin(
    @Body() user: CreateUserDto,
  ): Promise<{ isAddAdmin: boolean }> {
    const admin: User | string = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'add_admin',
        },

        { user },
      ),
    );

    switch (admin) {
      case 'login_exists':
        throw new ConflictException(USER_LOGIN_EXISTS);
      case 'telegram_exists':
        throw new ConflictException(USER_TELEGRAM_EXISTS);
      case 'phone_exists':
        throw new ConflictException(USER_PHONE_EXISTS);
      case 'admin_exists':
        throw new ConflictException(USER_ADMIN_ALREADY_EXIST);
    }

    return { isAddAdmin: !!admin };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'add user with role - only for admin' })
  @ApiCreatedResponse({ schema: schemaUser })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiConflictResponse({ schema: schemaError409 })
  @Roles('ADMIN')
  @Post('add-user')
  async addUser(@Body() user: CreateUserWithRoleDto): Promise<User> {
    const newUser: User | string = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'add_user',
        },

        { user },
      ),
    );

    switch (newUser) {
      case 'login_exists':
        throw new ConflictException(USER_LOGIN_EXISTS);
      case 'telegram_exists':
        throw new ConflictException(USER_TELEGRAM_EXISTS);
      case 'phone_exists':
        throw new ConflictException(USER_PHONE_EXISTS);
    }

    if (typeof newUser !== 'string') {
      return newUser;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user me' })
  @ApiOkResponse({ schema: schemaUserWithOverUsers })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @SkipThrottle(false)
  @Get('get-me')
  async getMe(@GetCurrentUser('id') id: number): Promise<User> {
    const user: User = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'get_user_me',
        },

        {
          id,
        },
      ),
    );

    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get users - depending on the role' })
  @ApiOkResponse({ schema: schemaUsers })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @Roles('ADMIN', 'DIRECTOR', 'TEAMLEAD', 'CURATOR')
  @Get('get-users')
  async getUsers(
    @Query() queryParams: GetUsersQueryDto,
    @GetCurrentUser('id') id: number,
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    const users: {
      rows: User[];
      count: number;
    } = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'get_all_users',
        },

        {
          id,
          queryParams,
        },
      ),
    );

    return users;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'search of users - depending on the role' })
  @ApiOkResponse({ schema: schemaUsers })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @Roles('ADMIN', 'DIRECTOR', 'TEAMLEAD', 'CURATOR')
  @Get('search-users')
  async searchUsers(
    @Query() queryParams: SearchUsersQueryDto,
    @GetCurrentUser('id') id: number,
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    const users: {
      rows: User[];
      count: number;
    } = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'search_users',
        },

        {
          id,
          queryParams,
        },
      ),
    );

    return users;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update user ban - only for admin' })
  @ApiCreatedResponse({ schema: schemaUserWithOverUsers })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Put('update-ban')
  async updateBan(@Body() userBan: UpdateBanDto): Promise<User> {
    const updateUser: User = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'update_ban',
        },

        { userBan },
      ),
    );

    if (!updateUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return updateUser;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update over user (manager) - only for admin or director',
  })
  @ApiCreatedResponse({ schema: schemaUserWithOverUsers })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @ApiConflictResponse({ schema: schemaError409 })
  @Roles('ADMIN', 'DIRECTOR')
  @HttpCode(HttpStatus.CREATED)
  @Put('update-over-user')
  async updateOverUser(
    @Body() updateOverUser: UpdateOverUserDto,
  ): Promise<User> {
    const updateUser: User | string = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'update_over_user',
        },

        { updateOverUser },
      ),
    );

    if (!updateUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    switch (updateUser) {
      case 'user_not_correct':
        throw new ConflictException(USER_UPDATE_ROLE_IS_NOT_CORRECT);
      case 'over_user_not_correct':
        throw new ConflictException(USER_OVER_USER_UPDATE_ROLE_IS_NOT_CORRECT);
      case 'user_and_over_user_identical':
        throw new ConflictException(USER_OVER_USER_UPDATE_ROLE_IDENTICAL);
    }

    if (typeof updateUser !== 'string') {
      return updateUser;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'update user telegram - only for own profile, need confirmed telegram',
  })
  @ApiCreatedResponse({ schema: schemaUser })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @ApiConflictResponse({ schema: schemaError409 })
  @HttpCode(HttpStatus.CREATED)
  @Put('update-telegram')
  async updateTelegram(
    @GetCurrentUser('id') id: number,
    @Body() updateTelegram: UpdateUserTelegramDto,
  ): Promise<User> {
    const updateUser: User | string = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'update_user_telegram',
        },

        {
          user_id: id,
          telegram: updateTelegram.telegram,
        },
      ),
    );

    if (!updateUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (updateUser === 'telegram_exists') {
      throw new ConflictException(USER_TELEGRAM_EXISTS);
    }

    if (updateUser === 'telegram_not_confirmed') {
      throw new ForbiddenException(TELEGRAM_NOT_CONFIRMED);
    }

    if (typeof updateUser !== 'string') {
      return updateUser;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update user phone - only for own profile, need confirmed code',
  })
  @ApiCreatedResponse({ schema: schemaUser })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @ApiConflictResponse({ schema: schemaError409 })
  @HttpCode(HttpStatus.CREATED)
  @Put('update-phone')
  async updatePhone(
    @GetCurrentUser('id') id: number,
    @Body() updatePhone: UpdateUserPhoneDto,
  ): Promise<User> {
    const checkConfirmedCode: ConfirmCode = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'get_confirm_code',
        },

        { request_id: updatePhone.request_id },
      ),
    );

    if (!checkConfirmedCode || !checkConfirmedCode.is_confirmed) {
      throw new ForbiddenException(CONFIRM_CODE_NOT_CONFIRMED);
    }

    const updateUser: User | string = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'update_user_phone',
        },

        {
          user_id: id,
          phone: updatePhone.phone,
        },
      ),
    );

    if (!updateUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (updateUser === 'phone_exists') {
      throw new ConflictException(USER_PHONE_EXISTS);
    }

    if (typeof updateUser !== 'string') {
      return updateUser;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update user password - only for own profile, need confirmed code',
  })
  @ApiCreatedResponse({ schema: schemaUser })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @HttpCode(HttpStatus.CREATED)
  @Put('update-password')
  async updatePassword(
    @GetCurrentUser('id') id: number,
    @Body() updatePassword: UpdateUserPasswordDto,
  ): Promise<User> {
    const checkConfirmedCode: ConfirmCode = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'get_confirm_code',
        },

        { request_id: updatePassword.request_id },
      ),
    );

    if (!checkConfirmedCode || !checkConfirmedCode.is_confirmed) {
      throw new ForbiddenException(CONFIRM_CODE_NOT_CONFIRMED);
    }

    const updateUser: User = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'update_user_password',
        },

        {
          user_id: id,
          password: updatePassword.password,
        },
      ),
    );

    if (!updateUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return updateUser;
  }

  @ApiOperation({ summary: 'reset user password - need confirmed code' })
  @ApiCreatedResponse({ schema: schemaUser })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Put('reset-password/:telegram')
  async resetPassword(
    @Param('telegram') telegram: string,
    @Body() updatePassword: UpdateUserPasswordDto,
  ): Promise<User> {
    const checkConfirmedCode: ConfirmCode = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'get_confirm_code',
        },

        { request_id: updatePassword.request_id },
      ),
    );

    if (!checkConfirmedCode || !checkConfirmedCode.is_confirmed) {
      throw new ForbiddenException(CONFIRM_CODE_NOT_CONFIRMED);
    }

    const updateUser: User = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'reset_user_password',
        },

        {
          telegram,
          password: updatePassword.password,
        },
      ),
    );

    if (!updateUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return updateUser;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete user to archived - only for admin' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete-user/:id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    const user: User | string = await firstValueFrom(
      this.userService.send(
        {
          cmd: 'delete_user',
        },

        { id },
      ),
    );

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (user === 'delete_admin_forbidden') {
      throw new ForbiddenException(USER_ADMIN_CANNOT_DELETE);
    }

    if (typeof user !== 'string') {
      return user;
    }
  }
}
