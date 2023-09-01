import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token } from './entities';
import { jwtOptions } from './config';
import {
  ConfigSettingsModule,
  RabbitModule,
  SequelizeConnectModule,
} from '@app/shared/modules';
import { RabbitService } from '@app/shared/services';
import { Balance, Profile, Role, User } from '@app/user/entities';
import { Category, Publication } from '@app/publication/entities';

@Module({
  imports: [
    ConfigSettingsModule,
    RabbitModule,
    SequelizeConnectModule,
    SequelizeModule.forFeature([
      Token,
      User,
      Role,
      Profile,
      Balance,
      Publication,
      Category,
    ]),
    JwtModule.registerAsync(jwtOptions()),
    RabbitModule.registerRmq(
      'TELEGRAM_BOT_SERVICE',
      process.env.RABBIT_TELEGRAM_BOT_QUEUE,
    ),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'RABBIT_SERVICE',
      useClass: RabbitService,
    },
  ],
})
export class AuthModule {}
