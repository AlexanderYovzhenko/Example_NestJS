import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';
import { UserController } from '../src/controllers';
import { telegramBotServiceMock, userServiceMock } from './mocks';
import {
  createUserStub,
  queryLimitOffsetRoleStub,
  querySearchRoleStub,
  uniqueUserStub,
  userBanStub,
  userDbStub,
  overUserStub,
  userUpdatePasswordStub,
  userUpdatePhoneStub,
} from './stubs';
import {
  USER_ADMIN_ALREADY_EXIST,
  USER_LOGIN_EXISTS,
  USER_NOT_FOUND,
  USER_PHONE_EXISTS,
  USER_TELEGRAM_EXISTS,
} from '@app/shared/constants';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: userServiceMock,
        },
        {
          provide: 'TELEGRAM_BOT_SERVICE',
          useValue: telegramBotServiceMock,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('addRoles', () => {
    it('should be defined', () => {
      expect(userController.addRoles()).toBeDefined();
    });

    it('should return true on successful add roles', async () => {
      expect(await userController.addRoles()).toEqual({ isAddRoles: true });
    });
  });

  describe('addAdmin', () => {
    it('should be defined', () => {
      expect(userController.addAdmin(uniqueUserStub())).toBeDefined();
    });

    it('should be return 409 error and message if login already exists', async () => {
      try {
        await userController.addAdmin({
          ...createUserStub(),
          telegram: 'uniqueTelegram',
          phone: 'uniquePhone',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_LOGIN_EXISTS);
      }
    });

    it('should be return 409 error and message if telegram already exists', async () => {
      try {
        await userController.addAdmin({
          ...createUserStub(),
          login: 'uniqLogin',
          phone: 'uniquePhone',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_TELEGRAM_EXISTS);
      }
    });

    it('should be return 409 error and message if phone already exists', async () => {
      try {
        await userController.addAdmin({
          ...createUserStub(),
          login: 'uniqLogin',
          telegram: 'uniqueTelegram',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_PHONE_EXISTS);
      }
    });

    it('should return true on successful add admin', async () => {
      expect(await userController.addAdmin(uniqueUserStub())).toEqual({
        isAddAdmin: true,
      });
    });

    it('should be return 409 error and message if admin already exists', async () => {
      jest
        .spyOn(userServiceMock, 'send')
        .mockImplementationOnce(() => of('admin_exists'));

      try {
        await userController.addAdmin(uniqueUserStub());
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_ADMIN_ALREADY_EXIST);
      }
    });
  });

  describe('addUser', () => {
    it('should be defined', () => {
      expect(
        userController.addUser({ ...uniqueUserStub(), role: 'curator' }),
      ).toBeDefined();
    });

    it('should be return 409 error and message if login already exists', async () => {
      try {
        await userController.addUser({
          ...createUserStub(),
          telegram: 'uniqueTelegram',
          phone: 'uniquePhone',
          role: 'curator',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_LOGIN_EXISTS);
      }
    });

    it('should be return 409 error and message if telegram already exists', async () => {
      try {
        await userController.addUser({
          ...createUserStub(),
          login: 'uniqLogin',
          phone: 'uniquePhone',
          role: 'curator',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_TELEGRAM_EXISTS);
      }
    });

    it('should be return 409 error and message if phone already exists', async () => {
      try {
        await userController.addUser({
          ...createUserStub(),
          login: 'uniqLogin',
          telegram: 'uniqueTelegram',
          role: 'curator',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(USER_PHONE_EXISTS);
      }
    });

    it('should return new user with role on successful add user', async () => {
      expect(
        await userController.addUser({ ...uniqueUserStub(), role: 'curator' }),
      ).toEqual({ ...uniqueUserStub(), role: 'curator' });
    });
  });

  describe('getMe', () => {
    it('should be defined', () => {
      expect(userController.getMe(userDbStub().id)).toBeDefined();
    });

    it('should return user by id', async () => {
      expect(await userController.getMe(userDbStub().id)).toEqual(userDbStub());
    });
  });

  describe('getAllUsers', () => {
    it('should be defined', () => {
      expect(
        userController.getUsers(queryLimitOffsetRoleStub(), userDbStub().id),
      ).toBeDefined();
    });

    it('should return amount users and array of users', async () => {
      expect(
        await userController.getUsers(
          queryLimitOffsetRoleStub(),
          userDbStub().id,
        ),
      ).toEqual({ count: 1, rows: [userDbStub()] });
    });
  });

  describe('searchUsers', () => {
    it('should be defined', () => {
      expect(
        userController.searchUsers(querySearchRoleStub(), userDbStub().id),
      ).toBeDefined();
    });

    it('should return amount users and array of users', async () => {
      expect(
        await userController.searchUsers(
          querySearchRoleStub(),
          userDbStub().id,
        ),
      ).toEqual({ count: 1, rows: [userDbStub()] });
    });
  });

  describe('updateBan', () => {
    it('should be defined', () => {
      expect(userController.updateBan(userBanStub())).toBeDefined();
    });

    it('should return banned user', async () => {
      expect(await userController.updateBan(userBanStub())).toEqual(
        userDbStub(),
      );
    });
  });

  describe('updatePhone', () => {
    it('should be defined', () => {
      jest
        .spyOn(telegramBotServiceMock, 'send')
        .mockImplementationOnce(() => of({ is_confirmed: true }));

      expect(
        userController.updatePhone(userDbStub().id, userUpdatePhoneStub()),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      jest
        .spyOn(telegramBotServiceMock, 'send')
        .mockImplementationOnce(() => of({ is_confirmed: true }));

      expect(
        await userController.updatePhone(
          userDbStub().id,
          userUpdatePhoneStub(),
        ),
      ).toEqual(userDbStub());
    });
  });

  describe('updatePassword', () => {
    it('should be defined', () => {
      jest
        .spyOn(telegramBotServiceMock, 'send')
        .mockImplementationOnce(() => of({ is_confirmed: true }));

      expect(
        userController.updatePassword(
          userDbStub().id,
          userUpdatePasswordStub(),
        ),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      jest
        .spyOn(telegramBotServiceMock, 'send')
        .mockImplementationOnce(() => of({ is_confirmed: true }));

      expect(
        await userController.updatePassword(
          userDbStub().id,
          userUpdatePasswordStub(),
        ),
      ).toEqual(userDbStub());
    });
  });

  describe('resetPassword', () => {
    it('should be defined', () => {
      jest
        .spyOn(telegramBotServiceMock, 'send')
        .mockImplementationOnce(() => of({ is_confirmed: true }));

      expect(
        userController.resetPassword(
          userDbStub().telegram,
          userUpdatePasswordStub(),
        ),
      ).toBeDefined();
    });

    it('should return update user', async () => {
      jest
        .spyOn(telegramBotServiceMock, 'send')
        .mockImplementationOnce(() => of({ is_confirmed: true }));

      expect(
        await userController.resetPassword(
          userDbStub().telegram,
          userUpdatePasswordStub(),
        ),
      ).toEqual(userDbStub());
    });
  });

  describe('updateOverUser', () => {
    it('should be defined', () => {
      expect(userController.updateOverUser(overUserStub())).toBeDefined();
    });

    it('should return user with new over user', async () => {
      expect(await userController.updateOverUser(overUserStub())).toEqual(
        userDbStub(),
      );
    });

    it('should be return 404 error and message if user not found', async () => {
      try {
        await userController.updateOverUser({
          ...overUserStub(),
          user_id: -10,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual(USER_NOT_FOUND);
      }
    });
  });

  describe('deleteUser', () => {
    it('should be defined', () => {
      expect(userController.deleteUser(userDbStub().id)).toBeDefined();
    });

    it('should return deleted user', async () => {
      expect(await userController.deleteUser(userDbStub().id)).toEqual(
        userDbStub(),
      );
    });

    it('should be return 404 error and message if user not found', async () => {
      try {
        await userController.deleteUser(-10);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual(USER_NOT_FOUND);
      }
    });
  });
});
