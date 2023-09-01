import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from '../src/controllers';
import { authServiceMock } from './mocks';
import {
  checkUserStub,
  createUserStub,
  refreshTokenStub,
  tokensStub,
  uniqueUserStub,
} from './stubs';
import {
  UNAUTHORIZED,
  USER_LOGIN_EXISTS,
  USER_PHONE_EXISTS,
  USER_TELEGRAM_EXISTS,
  USER_WRONG_LOGIN_PASSWORD,
} from '@app/shared/constants';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useValue: authServiceMock,
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

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should be defined', () => {
      expect(authController.signUp(uniqueUserStub())).toBeDefined();
    });

    it('should be return 409 error and message if login already exists', async () => {
      try {
        await authController.signUp({
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
        await authController.signUp({
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
        await authController.signUp({
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

    it('should return tokens', async () => {
      const tokens = await authController.signUp(uniqueUserStub());
      expect(tokens).toEqual({
        ...tokensStub().accessToken,
        ...tokensStub().refreshToken,
      });
    });
  });

  describe('logIn', () => {
    it('should be defined', () => {
      expect(authController.logIn(checkUserStub())).toBeDefined();
    });

    it('should be return 401 error if login is fake', async () => {
      try {
        await authController.logIn({ ...checkUserStub(), login: 'fakeUser' });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual(USER_WRONG_LOGIN_PASSWORD);
      }
    });

    it('should be return 401 error if password is fake', async () => {
      try {
        await authController.logIn({
          ...checkUserStub(),
          password: 'fakePassword',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual(USER_WRONG_LOGIN_PASSWORD);
      }
    });

    it('should return tokens', async () => {
      const tokens = await authController.logIn(checkUserStub());
      expect(tokens).toEqual({
        ...tokensStub().accessToken,
        ...tokensStub().refreshToken,
      });
    });
  });

  describe('refresh', () => {
    it('should be defined', () => {
      expect(authController.refresh(refreshTokenStub())).toBeDefined();
    });

    it('should be return 401 error if refresh_token is null', async () => {
      try {
        await authController.refresh({ refresh_token: '' });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
        expect(error.message).toEqual(UNAUTHORIZED);
      }
    });

    it('should be return 401 error if refresh_token is fake', async () => {
      try {
        await authController.refresh({ refresh_token: 'fakeToken' });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
        expect(error.message).toEqual(UNAUTHORIZED);
      }
    });

    it('should return tokens', async () => {
      const tokens = await authController.refresh(refreshTokenStub());
      expect(tokens).toEqual({
        ...tokensStub().accessToken,
        ...tokensStub().refreshToken,
      });
    });
  });

  describe('logOut', () => {
    it('should be defined', () => {
      expect(authController.logOut(refreshTokenStub())).toBeDefined();
    });

    it('should be return 401 error if refresh_token is unidentified', async () => {
      try {
        await authController.logOut({ refresh_token: '' });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
        expect(error.message).toEqual(UNAUTHORIZED);
      }
    });

    it('should return response isLogout true', async () => {
      const result = await authController.logOut(refreshTokenStub());
      expect(result).toEqual({ isLogout: true });
    });
  });
});
