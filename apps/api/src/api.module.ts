import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import {
  ApiController,
  HealthController,
  AuthController,
  PublicationController,
  TelegramBotController,
  UserController,
} from './controllers';
import { ApiService } from './api.service';
import { AllExceptionsFilter } from './config/exception-filter/all-exception-filter';
import { CorsMiddleware } from './common/middleware';
import { JwtStrategy } from './common/strategies';
import { JwtAuthGuard, RoleGuard } from './common/guards';
import {
  ConfigSettingsModule,
  RabbitModule,
  SequelizeConnectModule,
  ThrottlerSettingsModule,
} from '@app/shared/modules';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    SequelizeConnectModule,
    ConfigSettingsModule,
    ThrottlerSettingsModule,
    RabbitModule.registerRmq('AUTH_SERVICE', process.env.RABBIT_AUTH_QUEUE),
    RabbitModule.registerRmq('USER_SERVICE', process.env.RABBIT_USER_QUEUE),
    RabbitModule.registerRmq(
      'TELEGRAM_BOT_SERVICE',
      process.env.RABBIT_TELEGRAM_BOT_QUEUE,
    ),
    RabbitModule.registerRmq(
      'PUBLICATION_SERVICE',
      process.env.RABBIT_PUBLICATION_QUEUE,
    ),
  ],
  controllers: [
    HealthController,
    ApiController,
    AuthController,
    UserController,
    TelegramBotController,
    PublicationController,
  ],
  providers: [
    ApiService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes(AuthController);
  }
}
