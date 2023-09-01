import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Balance, Profile, Role, User } from './entities';
import { RabbitService } from '@app/shared/services';
import {
  ConfigSettingsModule,
  RabbitModule,
  SequelizeConnectModule,
} from '@app/shared/modules';
import { Token } from '@app/auth/entities';
import { Category, Publication } from '@app/publication/entities';

@Module({
  imports: [
    ConfigSettingsModule,
    RabbitModule,
    SequelizeConnectModule,
    SequelizeModule.forFeature([
      User,
      Profile,
      Balance,
      Role,
      Token,
      Publication,
      Category,
    ]),
    RabbitModule.registerRmq(
      'TELEGRAM_BOT_SERVICE',
      process.env.RABBIT_TELEGRAM_BOT_QUEUE,
    ),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'RABBIT_SERVICE',
      useClass: RabbitService,
    },
  ],
})
export class UserModule {}
