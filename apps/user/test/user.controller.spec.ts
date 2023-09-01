import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { UserController } from '../src/user.controller';
import { UserService } from '../src/user.service';
import { userServiceMock, contextMock, rabbitServiceMock } from './mocks';
import {
  createUserStub,
  queryLimitOffsetRoleStub,
  querySearchRoleStub,
  userBanStub,
  userDbStub,
  overUserStub,
  userUpdatePasswordStub,
  userUpdatePhoneStub,
  userUpdateTelegramStub,
} from './stubs';
import { RabbitService } from '@app/shared/services';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: 'RABBIT_SERVICE',
          useClass: RabbitService,
        },
        {
          provide: RabbitService,
          useValue: rabbitServiceMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('addRoles', () => {
    it('should be defined', async () => {
      return expect(
        await userController.addRoles(contextMock as RmqContext),
      ).toBeDefined();
    });

    it('should return boolean (true)', async () => {
      const result = await userController.addRoles(contextMock as RmqContext);

      expect(result).toEqual(true);
    });
  });

  describe('addAdmin', () => {
    it('should be defined', async () => {
      return expect(
        await userController.addAdmin(contextMock as RmqContext, {
          user: createUserStub(),
        }),
      ).toBeDefined();
    });

    it('should return new user (admin)', async () => {
      const result = await userController.addAdmin(contextMock as RmqContext, {
        user: createUserStub(),
      });

      expect(result).toEqual(userDbStub());
    });
  });

  describe('addUser', () => {
    it('should be defined', async () => {
      return expect(
        await userController.addUser(contextMock as RmqContext, {
          user: { ...createUserStub(), role: 'webmaster' },
        }),
      ).toBeDefined();
    });

    it('should return new user with role', async () => {
      const result = await userController.addUser(contextMock as RmqContext, {
        user: { ...createUserStub(), role: 'webmaster' },
      });

      expect(result).toEqual(userDbStub());
    });
  });

  describe('getMe', () => {
    it('should be defined', async () => {
      return expect(
        await userController.getMe(contextMock as RmqContext, {
          id: userDbStub().id,
        }),
      ).toBeDefined();
    });

    it('should return self user', async () => {
      const result = await userController.getMe(contextMock as RmqContext, {
        id: userDbStub().id,
      });

      expect(result).toEqual(userDbStub());
    });
  });

  describe('getAllUsers', () => {
    it('should be defined', async () => {
      return expect(
        await userController.getUsers(contextMock as RmqContext, {
          id: userDbStub().id,
          queryParams: queryLimitOffsetRoleStub(),
        }),
      ).toBeDefined();
    });

    it('should return amount users and array of users', async () => {
      const result = await userController.getUsers(contextMock as RmqContext, {
        id: userDbStub().id,
        queryParams: queryLimitOffsetRoleStub(),
      });

      expect(result).toEqual({ count: 5, rows: [userDbStub()] });
    });
  });

  describe('searchUsers', () => {
    it('should be defined', async () => {
      return expect(
        await userController.searchUsers(contextMock as RmqContext, {
          id: userDbStub().id,
          queryParams: querySearchRoleStub(),
        }),
      ).toBeDefined();
    });

    it('should return amount users and array of users', async () => {
      const result = await userController.searchUsers(
        contextMock as RmqContext,
        {
          id: userDbStub().id,
          queryParams: querySearchRoleStub(),
        },
      );

      expect(result).toEqual({ count: 5, rows: [userDbStub()] });
    });
  });

  describe('updateBan', () => {
    it('should be defined', async () => {
      return expect(
        await userController.updateBan(contextMock as RmqContext, {
          userBan: userBanStub(),
        }),
      ).toBeDefined();
    });

    it('should return banned user', async () => {
      const result = await userController.updateBan(contextMock as RmqContext, {
        userBan: userBanStub(),
      });

      expect(result).toEqual(userDbStub());
    });
  });

  describe('updateOverUser', () => {
    it('should be defined', async () => {
      return expect(
        await userController.updateOverUser(contextMock as RmqContext, {
          updateOverUser: overUserStub(),
        }),
      ).toBeDefined();
    });

    it('should return user with over user', async () => {
      const result = await userController.updateOverUser(
        contextMock as RmqContext,
        {
          updateOverUser: overUserStub(),
        },
      );

      expect(result).toEqual(userDbStub());
    });
  });

  describe('updateTelegram', () => {
    it('should be defined', async () => {
      return expect(
        await userController.updateTelegram(contextMock as RmqContext, {
          user_id: userDbStub().id,
          telegram: userUpdateTelegramStub().telegram,
        }),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      const result = await userController.updateTelegram(
        contextMock as RmqContext,
        {
          user_id: userDbStub().id,
          telegram: userUpdateTelegramStub().telegram,
        },
      );

      expect(result).toEqual(userDbStub());
    });
  });

  describe('updatePhone', () => {
    it('should be defined', async () => {
      return expect(
        await userController.updatePhone(contextMock as RmqContext, {
          user_id: userDbStub().id,
          phone: userUpdatePhoneStub().phone,
        }),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      const result = await userController.updatePhone(
        contextMock as RmqContext,
        {
          user_id: userDbStub().id,
          phone: userUpdatePhoneStub().phone,
        },
      );

      expect(result).toEqual(userDbStub());
    });
  });

  describe('updatePassword', () => {
    it('should be defined', async () => {
      return expect(
        await userController.updatePassword(contextMock as RmqContext, {
          user_id: userDbStub().id,
          password: userUpdatePasswordStub().password,
        }),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      const result = await userController.updatePassword(
        contextMock as RmqContext,
        {
          user_id: userDbStub().id,
          password: userUpdatePasswordStub().password,
        },
      );

      expect(result).toEqual(userDbStub());
    });
  });

  describe('resetPassword', () => {
    it('should be defined', async () => {
      return expect(
        await userController.resetPassword(contextMock as RmqContext, {
          telegram: userDbStub().telegram,
          password: userUpdatePasswordStub().password,
        }),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      const result = await userController.resetPassword(
        contextMock as RmqContext,
        {
          telegram: userDbStub().telegram,
          password: userUpdatePasswordStub().password,
        },
      );

      expect(result).toEqual(userDbStub());
    });
  });

  describe('deleteUser', () => {
    it('should be defined', async () => {
      return expect(
        await userController.deleteUser(contextMock as RmqContext, {
          id: userDbStub().id,
        }),
      ).toBeDefined();
    });

    it('should return deleted user', async () => {
      const result = await userController.deleteUser(
        contextMock as RmqContext,
        {
          id: userDbStub().id,
        },
      );

      expect(result).toEqual(userDbStub());
    });
  });
});
