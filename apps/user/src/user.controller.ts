import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';
import { RabbitService } from '@app/shared/services';
import {
  QueryLimitOffsetRole,
  QuerySearchRole,
  User,
  UserBan,
  OverUser,
  UserWithRole,
} from '@app/shared/interfaces';

@Controller()
export class UserController {
  constructor(
    @Inject('RABBIT_SERVICE')
    private readonly rabbitService: RabbitService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: 'user_health' })
  async health(@Ctx() context: RmqContext): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.health();
  }

  @MessagePattern({ cmd: 'add_roles' })
  async addRoles(@Ctx() context: RmqContext): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.addRoles();
  }

  @MessagePattern({ cmd: 'add_admin' })
  async addAdmin(
    @Ctx() context: RmqContext,
    @Payload() data: { user: User },
  ): Promise<User | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.addAdmin(data.user);
  }

  @MessagePattern({ cmd: 'add_user' })
  async addUser(
    @Ctx() context: RmqContext,
    @Payload() data: { user: UserWithRole },
  ): Promise<User | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.addUser(data.user);
  }

  @MessagePattern({ cmd: 'get_user_me' })
  async getMe(
    @Ctx() context: RmqContext,
    @Payload() data: { id: number },
  ): Promise<User> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.getMe(data.id);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getUsers(
    @Ctx() context: RmqContext,
    @Payload() data: { id: number; queryParams: QueryLimitOffsetRole },
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.getUsers(data.id, data.queryParams);
  }

  @MessagePattern({ cmd: 'search_users' })
  async searchUsers(
    @Ctx() context: RmqContext,
    @Payload() data: { id: number; queryParams: QuerySearchRole },
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.searchUsers(data.id, data.queryParams);
  }

  @MessagePattern({ cmd: 'update_ban' })
  async updateBan(
    @Ctx() context: RmqContext,
    @Payload() data: { userBan: UserBan },
  ): Promise<User> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.updateBan(data.userBan);
  }

  @MessagePattern({ cmd: 'update_over_user' })
  async updateOverUser(
    @Ctx() context: RmqContext,
    @Payload() data: { updateOverUser: OverUser },
  ): Promise<User | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.updateOverUser(data.updateOverUser);
  }

  @MessagePattern({ cmd: 'update_user_telegram' })
  async updateTelegram(
    @Ctx() context: RmqContext,
    @Payload() data: { user_id: number; telegram: string },
  ): Promise<User | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.updateTelegram(data.user_id, data.telegram);
  }

  @MessagePattern({ cmd: 'update_user_phone' })
  async updatePhone(
    @Ctx() context: RmqContext,
    @Payload() data: { user_id: number; phone: string },
  ): Promise<User | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.updatePhone(data.user_id, data.phone);
  }

  @MessagePattern({ cmd: 'update_user_password' })
  async updatePassword(
    @Ctx() context: RmqContext,
    @Payload() data: { user_id: number; password: string },
  ): Promise<User> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.updatePassword(data.user_id, data.password);
  }

  @MessagePattern({ cmd: 'reset_user_password' })
  async resetPassword(
    @Ctx() context: RmqContext,
    @Payload() data: { telegram: string; password: string },
  ): Promise<User> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.resetPassword(data.telegram, data.password);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(
    @Ctx() context: RmqContext,
    @Payload() data: { id: number },
  ): Promise<User | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.userService.deleteUser(data.id);
  }
}
