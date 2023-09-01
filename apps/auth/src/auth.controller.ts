import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RabbitService } from '@app/shared/services';
import { Tokens, User } from '@app/shared/interfaces';

@Controller()
export class AuthController {
  constructor(
    @Inject('RABBIT_SERVICE')
    private readonly rabbitService: RabbitService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'auth_health' })
  async health(@Ctx() context: RmqContext): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.authService.health();
  }

  @MessagePattern({ cmd: 'signup' })
  async signUp(
    @Ctx() context: RmqContext,
    @Payload() data: { user: User },
  ): Promise<Tokens | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.authService.signUp(data.user);
  }

  @MessagePattern({ cmd: 'login' })
  async logIn(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      user: Pick<User, 'login' | 'password'>;
    },
  ): Promise<Tokens> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.authService.logIn(data.user);
  }

  @MessagePattern({ cmd: 'refresh' })
  async refresh(
    @Ctx() context: RmqContext,
    @Payload() data: { refresh_token: string },
  ): Promise<Tokens> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.authService.refresh(data.refresh_token);
  }

  @MessagePattern({ cmd: 'logout' })
  async logOut(
    @Ctx() context: RmqContext,
    @Payload() data: { refresh_token: string },
  ): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.authService.logOut(data.refresh_token);
  }
}
