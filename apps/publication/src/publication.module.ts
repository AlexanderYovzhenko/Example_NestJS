import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { Category, Publication } from './entities';
import { RabbitService } from '@app/shared/services';
import {
  ConfigSettingsModule,
  RabbitModule,
  SequelizeConnectModule,
} from '@app/shared/modules';
import { Balance, Profile, Role, User } from '@app/user/entities';
import { Token } from '@app/auth/entities';

@Module({
  imports: [
    ConfigSettingsModule,
    RabbitModule,
    SequelizeConnectModule,
    SequelizeModule.forFeature([
      Category,
      Publication,
      User,
      Profile,
      Balance,
      Role,
      Token,
    ]),
  ],
  controllers: [PublicationController],
  providers: [
    PublicationService,
    {
      provide: 'RABBIT_SERVICE',
      useClass: RabbitService,
    },
  ],
})
export class PublicationModule {}
