import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UserService } from '../src/user.service';
import {
  balanceRepositoryMock,
  profileRepositoryMock,
  roleRepositoryMock,
  telegramBotServiceMock,
  userRepositoryMock,
} from './mocks';
import {
  createUserStub,
  queryLimitOffsetRoleStub,
  querySearchRoleStub,
  uniqueUserStub,
  userBanStub,
  userDbStub,
  overUserStub,
  userUpdatePasswordStub,
  roleDbStub,
  userUpdatePhoneStub,
  userUpdateTelegramStub,
} from './stubs';
import { Balance, Profile, Role, User } from '@app/user/entities';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getModelToken(Role),
          useValue: roleRepositoryMock,
        },
        {
          provide: getModelToken(Balance),
          useValue: balanceRepositoryMock,
        },
        {
          provide: getModelToken(Profile),
          useValue: profileRepositoryMock,
        },
        {
          provide: 'TELEGRAM_BOT_SERVICE',
          useValue: telegramBotServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('addRoles', () => {
    it('should be defined', async () => {
      expect(await userService.addRoles()).toBeDefined();
    });

    it('should return boolean (true)', async () => {
      expect(await userService.addRoles()).toEqual(true);
    });
  });

  describe('addAdmin', () => {
    it('should be defined', async () => {
      expect(await userService.addAdmin(createUserStub())).toBeDefined();
    });

    it('should return login_exists if he already exists', async () => {
      expect(
        await userService.addAdmin({
          ...createUserStub(),
          telegram: 'uniqueTelegram',
          phone: 'uniquePhone',
        }),
      ).toEqual('login_exists');
    });

    it('should return telegram_exists if he already exists', async () => {
      expect(
        await userService.addAdmin({
          ...createUserStub(),
          login: 'uniqLogin',
          phone: 'uniquePhone',
        }),
      ).toEqual('telegram_exists');
    });

    it('should return phone_exists if he already exists', async () => {
      expect(
        await userService.addAdmin({
          ...createUserStub(),
          login: 'uniqLogin',
          telegram: 'uniqueTelegram',
        }),
      ).toEqual('phone_exists');
    });

    it('should return new user (admin)', async () => {
      expect(await userService.addAdmin(uniqueUserStub())).toEqual(
        userDbStub(),
      );
    });

    it('should return admin_exists if he already exists', async () => {
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValueOnce(() => Promise.resolve(userDbStub()));

      expect(await userService.addAdmin(uniqueUserStub())).toEqual(
        'admin_exists',
      );
    });
  });

  describe('addUser', () => {
    it('should be defined', async () => {
      expect(
        await userService.addUser({ ...createUserStub(), role: 'curator' }),
      ).toBeDefined();
    });

    it('should return login_exists if he already exists', async () => {
      expect(
        await userService.addUser({
          ...createUserStub(),
          telegram: 'uniqueTelegram',
          phone: 'uniquePhone',
          role: 'curator',
        }),
      ).toEqual('login_exists');
    });

    it('should return telegram_exists if he already exists', async () => {
      expect(
        await userService.addUser({
          ...createUserStub(),
          login: 'uniqLogin',
          phone: 'uniquePhone',
          role: 'curator',
        }),
      ).toEqual('telegram_exists');
    });

    it('should return phone_exists if he already exists', async () => {
      expect(
        await userService.addUser({
          ...createUserStub(),
          login: 'uniqLogin',
          telegram: 'uniqueTelegram',
          role: 'curator',
        }),
      ).toEqual('phone_exists');
    });

    it('should return new user with role', async () => {
      expect(
        await userService.addUser({ ...uniqueUserStub(), role: 'curator' }),
      ).toEqual(userDbStub());
    });
  });

  describe('getMe', () => {
    it('should be defined', async () => {
      expect(await userService.getMe(userDbStub().id)).toBeDefined();
    });

    it('should return user by id', async () => {
      expect(await userService.getMe(userDbStub().id)).toEqual(userDbStub());
    });
  });

  describe('getAllUsers', () => {
    it('should be defined', async () => {
      expect(
        await userService.getUsers(userDbStub().id, queryLimitOffsetRoleStub()),
      ).toBeDefined();
    });

    it('should return amount users and array of users', async () => {
      expect(
        await userService.getUsers(userDbStub().id, queryLimitOffsetRoleStub()),
      ).toEqual({ count: 1, rows: [userDbStub()] });
    });
  });

  describe('searchUsers', () => {
    it('should be defined', async () => {
      expect(
        await userService.searchUsers(userDbStub().id, querySearchRoleStub()),
      ).toBeDefined();
    });

    it('should return amount users and array of users', async () => {
      expect(
        await userService.searchUsers(userDbStub().id, querySearchRoleStub()),
      ).toEqual({ count: 1, rows: [userDbStub()] });
    });
  });

  describe('updateBan', () => {
    it('should be defined', async () => {
      expect(await userService.updateBan(userBanStub())).toBeDefined();
    });

    it('should return banned user', async () => {
      expect(await userService.updateBan(userBanStub())).toEqual(userDbStub());
    });
  });

  describe('updateOverUser', () => {
    it('should be defined', async () => {
      expect(await userService.updateOverUser(overUserStub())).toBeDefined();
    });

    it('should return null, user not found', async () => {
      expect(
        await userService.updateOverUser({
          ...overUserStub(),
          user_id: -10,
        }),
      ).toEqual(null);
    });

    it('should return message over user not correct', async () => {
      expect(
        await userService.updateOverUser({
          user_id: 1,
          over_user_id: 1,
        }),
      ).toEqual('over_user_not_correct');
    });
  });

  describe('updateTelegram', () => {
    it('should be defined', async () => {
      expect(
        await userService.updateTelegram(
          userDbStub().id,
          userUpdateTelegramStub().telegram,
        ),
      ).toBeDefined();
    });

    it('should return null, user not found', async () => {
      const fakeId = 123;

      expect(
        await userService.updateTelegram(
          fakeId,
          userUpdateTelegramStub().telegram,
        ),
      ).toEqual(null);
    });

    it('should return message telegram_exists', async () => {
      expect(
        await userService.updateTelegram(
          userDbStub().id,
          userUpdateTelegramStub().telegram,
        ),
      ).toEqual('telegram_exists');
    });

    it('should return update user', async () => {
      const uniqueTelegram = 'unique_telegram';

      expect(
        await userService.updateTelegram(userDbStub().id, uniqueTelegram),
      ).toEqual(userDbStub());
    });
  });

  describe('updatePhone', () => {
    it('should be defined', async () => {
      expect(
        await userService.updatePhone(
          userDbStub().id,
          userUpdatePhoneStub().phone,
        ),
      ).toBeDefined();
    });

    it('should return null, user not found', async () => {
      const fakeId = 123;

      expect(
        await userService.updatePhone(fakeId, userUpdatePhoneStub().phone),
      ).toEqual(null);
    });

    it('should return message phone_exists', async () => {
      expect(
        await userService.updatePhone(
          userDbStub().id,
          userUpdatePhoneStub().phone,
        ),
      ).toEqual('phone_exists');
    });

    it('should return update user', async () => {
      const uniquePhone = '79221110555';

      expect(
        await userService.updatePhone(userDbStub().id, uniquePhone),
      ).toEqual(userDbStub());
    });
  });

  describe('updatePassword', () => {
    it('should be defined', async () => {
      expect(
        await userService.updatePassword(
          userDbStub().id,
          userUpdatePasswordStub().password,
        ),
      ).toBeDefined();
    });

    it('should return null, user not found', async () => {
      const fakeId = 123;

      expect(
        await userService.updatePassword(
          fakeId,
          userUpdatePasswordStub().password,
        ),
      ).toEqual(null);
    });

    it('should return update user', async () => {
      expect(
        await userService.updatePassword(
          userDbStub().id,
          userUpdatePasswordStub().password,
        ),
      ).toEqual(userDbStub());
    });
  });

  describe('resetPassword', () => {
    it('should be defined', async () => {
      expect(
        await userService.resetPassword(
          userDbStub().telegram,
          userUpdatePasswordStub().password,
        ),
      ).toBeDefined();
    });

    it('should return null, user not found', async () => {
      expect(
        await userService.resetPassword(
          'fakeTelegram',
          userUpdatePasswordStub().password,
        ),
      ).toEqual(null);
    });

    it('should return update user', async () => {
      expect(
        await userService.resetPassword(
          userDbStub().telegram,
          userUpdatePasswordStub().password,
        ),
      ).toEqual(userDbStub());
    });
  });

  describe('deleteUser', () => {
    it('should be defined', async () => {
      expect(await userService.deleteUser(userDbStub().id)).toBeDefined();
    });

    it('should return null, user not found', async () => {
      expect(await userService.deleteUser(-10)).toEqual(null);
    });

    it('should return deleted user', async () => {
      expect(await userService.deleteUser(userDbStub().id)).toEqual({
        ...userDbStub(),
        role: roleDbStub(),
      });
    });
  });
});
