import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthService } from '../src/auth.service';
import { Token } from '../src/entities';
import {
  balanceRepositoryMock,
  jwtServiceMock,
  profileRepositoryMock,
  roleRepositoryMock,
  telegramBotServiceMock,
  tokenRepositoryMock,
  userRepositoryMock,
} from './mocks';
import {
  checkUserStub,
  createUserStub,
  tokensStub,
  uniqueUserStub,
  userDbStub,
} from './stubs';
import { Balance, Profile, Role, User } from '@app/user/entities';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getModelToken(Token),
          useValue: tokenRepositoryMock,
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
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return '1m';
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should be defined', async () => {
      expect(await authService.signUp(createUserStub())).toBeDefined();
    });

    it('should return login if he already exists', async () => {
      expect(
        await authService.signUp({
          ...createUserStub(),
          telegram: 'uniqueTelegram',
          phone: 'uniquePhone',
        }),
      ).toEqual('login_exists');
    });

    it('should return telegram if he already exists', async () => {
      expect(
        await authService.signUp({
          ...createUserStub(),
          login: 'uniqLogin',
          phone: 'uniquePhone',
        }),
      ).toEqual('telegram_exists');
    });

    it('should return phone if he already exists', async () => {
      expect(
        await authService.signUp({
          ...createUserStub(),
          login: 'uniqLogin',
          telegram: 'uniqueTelegram',
        }),
      ).toEqual('phone_exists');
    });

    it('should return tokens', async () => {
      expect(await authService.signUp(uniqueUserStub())).toEqual(tokensStub());
    });
  });

  describe('logIn', () => {
    jest
      .spyOn(argon2, 'verify')
      .mockImplementation((_: string, plain: string | Buffer) => {
        return plain === userDbStub().password
          ? Promise.resolve(true)
          : Promise.resolve(false);
      });

    it('should be defined', async () => {
      expect(await authService.logIn(checkUserStub())).toBeDefined();
    });

    it('should return null if login is not correct', async () => {
      expect(
        await authService.logIn({
          ...checkUserStub(),
          login: 'uniqueLogin',
        }),
      ).toEqual(null);
    });

    it('should return null if password is not correct', async () => {
      expect(
        await authService.logIn({
          ...checkUserStub(),
          password: 'uniquePassword',
        }),
      ).toEqual(null);
    });

    it('should return tokens', async () => {
      expect(await authService.logIn(checkUserStub())).toEqual(tokensStub());
    });
  });

  describe('refresh', () => {
    it('should be defined', async () => {
      expect(
        await authService.refresh(tokensStub().refreshToken.refresh_token),
      ).toBeDefined();
    });

    it('should return null if refresh_token is not correct', async () => {
      expect(await authService.refresh('isNotCorrect')).toEqual(null);
    });

    it('should return tokens', async () => {
      expect(
        await authService.refresh(tokensStub().refreshToken.refresh_token),
      ).toEqual(tokensStub());
    });
  });

  describe('logOut', () => {
    it('should be defined', async () => {
      expect(
        await authService.logOut(tokensStub().refreshToken.refresh_token),
      ).toBeDefined();
    });

    it('should return true', async () => {
      expect(
        await authService.logOut(tokensStub().refreshToken.refresh_token),
      ).toEqual(true);
    });
  });
});
