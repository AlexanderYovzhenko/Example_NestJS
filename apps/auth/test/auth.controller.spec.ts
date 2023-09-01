import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { AuthController } from '../src/auth.controller';
import { AuthService } from '../src/auth.service';
import { authServiceMock, contextMock, rabbitServiceMock } from './mocks';
import { checkUserStub, createUserStub, tokensStub } from './stubs';
import { RabbitService } from '@app/shared/services';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: authServiceMock,
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

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should be defined', async () => {
      return expect(
        await authController.signUp(contextMock as RmqContext, {
          user: createUserStub(),
        }),
      ).toBeDefined();
    });

    it('should return tokens', async () => {
      const result = await authController.signUp(contextMock as RmqContext, {
        user: createUserStub(),
      });

      expect(result).toEqual(tokensStub());
    });
  });

  describe('logIn', () => {
    it('should be defined', async () => {
      return expect(
        await authController.logIn(contextMock as RmqContext, {
          user: checkUserStub(),
        }),
      ).toBeDefined();
    });

    it('should return tokens', async () => {
      const result = await authController.logIn(contextMock as RmqContext, {
        user: checkUserStub(),
      });

      expect(result).toEqual(tokensStub());
    });
  });

  describe('refresh', () => {
    it('should be defined', async () => {
      return expect(
        await authController.refresh(
          contextMock as RmqContext,
          tokensStub().refreshToken,
        ),
      ).toBeDefined();
    });

    it('should return tokens', async () => {
      const result = await authController.refresh(
        contextMock as RmqContext,
        tokensStub().refreshToken,
      );

      expect(result).toEqual(tokensStub());
    });
  });

  describe('logOut', () => {
    it('should be defined', async () => {
      return expect(
        await authController.logOut(
          contextMock as RmqContext,
          tokensStub().refreshToken,
        ),
      ).toBeDefined();
    });

    it('should return true', async () => {
      const result = await authController.logOut(
        contextMock as RmqContext,
        tokensStub().refreshToken,
      );

      expect(result).toEqual(true);
    });
  });
});
