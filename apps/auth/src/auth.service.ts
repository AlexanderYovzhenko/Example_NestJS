import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import sequelize from 'sequelize';
import { nanoid } from 'nanoid/async';
import * as argon2 from 'argon2';
import { Token } from './entities';
import { Balance, Profile, Role, User } from '@app/user/entities';
import { NUMBER_OF_TOKENS_ISSUED } from '@app/shared/constants';
import { Roles } from '@app/shared/enums';
import {
  AccessToken,
  DecodedRefreshToken,
  RefreshToken,
  Tokens,
  User as UserInterface,
} from '@app/shared/interfaces';
import { convertToMillisecondsUtil } from '@app/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: Repository<User>,
    @InjectModel(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectModel(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectModel(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @InjectModel(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('TELEGRAM_BOT_SERVICE')
    private readonly telegramBotService: ClientProxy,
  ) {}

  async health(): Promise<boolean> {
    return true;
  }

  async signUp(user: UserInterface): Promise<Tokens | string> {
    try {
      const { password } = user;

      const validateUniqueParams = await this.validateUniqueUser(user);

      if (validateUniqueParams) {
        return validateUniqueParams;
      }

      const nodeEnv = await this.configService.get('NODE_ENV', 'development');

      if (nodeEnv === 'production') {
        const isConfirmedTelegram: boolean = await firstValueFrom(
          this.telegramBotService.send(
            {
              cmd: 'telegram_confirm_registration',
            },

            { username: user.telegram.toLowerCase() },
          ),
        );

        if (!isConfirmedTelegram) {
          return 'telegram_not_confirmed';
        }
      }

      const hashedPassword = await this.hashPassword(password);
      const newUser = await this.createUser(user, hashedPassword);

      const idRefreshToken = await this.generateUUID();
      const tokens = await this.generateTokens(newUser, idRefreshToken);

      const hashedNewRefreshToken = await this.hashRefreshToken(
        tokens.refreshToken.refresh_token,
      );
      await this.createRefreshToken(
        idRefreshToken,
        hashedNewRefreshToken,
        newUser.id,
      );

      return tokens;
    } catch (error) {
      return null;
    }
  }

  async logIn(user: Pick<User, 'login' | 'password'>): Promise<Tokens> {
    try {
      const { login, password } = user;
      const paranoid = true;

      const checkUser = await this.getUserByLogin(login, paranoid);

      if (!checkUser) {
        return null;
      }

      const isMatchPassword = await this.checkHashPassword(
        checkUser.password,
        password,
      );

      if (!isMatchPassword) {
        return null;
      }

      const idRefreshToken = await this.generateUUID();
      const tokens = await this.generateTokens(checkUser, idRefreshToken);

      const hashedNewRefreshToken = await this.hashRefreshToken(
        tokens.refreshToken.refresh_token,
      );

      await this.checkAndDeleteExcessRefreshToken(checkUser.id);
      await this.createRefreshToken(
        idRefreshToken,
        hashedNewRefreshToken,
        checkUser.id,
      );

      return tokens;
    } catch (error) {
      return null;
    }
  }

  async refresh(refresh_token: string): Promise<Tokens> {
    try {
      const validToken = await this.verifyRefreshToken(refresh_token);

      if (!validToken) {
        return null;
      }

      const checkToken = await this.getRefreshToken(validToken.token_id);

      if (!checkToken) {
        return null;
      }

      const user = await this.getUserById(checkToken.user_id);
      const tokens = await this.generateTokens(user, checkToken.id);

      const hashedNewRefreshToken = await this.hashRefreshToken(
        tokens.refreshToken.refresh_token,
      );

      await this.updateRefreshToken(hashedNewRefreshToken, checkToken.id);

      return tokens;
    } catch (error) {
      return null;
    }
  }

  async logOut(refresh_token: string): Promise<boolean> {
    try {
      const validToken = await this.verifyRefreshToken(refresh_token);

      if (!validToken) {
        return null;
      }

      const checkToken = await this.getRefreshToken(validToken.token_id);

      if (!checkToken) {
        return true;
      }

      const isLogout = await this.deleteRefreshToken(checkToken.id);

      return isLogout;
    } catch (error) {
      return null;
    }
  }

  // Private methods
  // User validate methods
  private async validateUniqueUser(user: UserInterface): Promise<string> {
    const { login, telegram, phone } = user;
    const paranoid = false;

    const checkLogin = await this.getUserByLogin(login, paranoid);

    if (checkLogin) {
      return 'login_exists';
    }

    const checkTelegram = await this.getUserByTelegram(telegram);

    if (checkTelegram) {
      return 'telegram_exists';
    }

    if (phone) {
      const checkPhone = await this.getUserByPhone(phone);

      if (checkPhone) {
        return 'phone_exists';
      }
    }

    return null;
  }

  // Tokens generate, verify, hash and parse methods
  private async generateTokens(user: User, token_id: string): Promise<Tokens> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, token_id);

    const tokens = {
      accessToken,
      refreshToken,
    };

    return tokens;
  }

  private async generateAccessToken(user: User): Promise<AccessToken> {
    const { id, login, role_id } = user;
    const role = await this.getRoleById(role_id);

    const payload = { id, login, role: role.value };

    const jwtSecretAccessKey = await this.configService.get(
      'JWT_SECRET_ACCESS_KEY',
    );

    const lifeTimeAccessToken = await this.configService.get(
      'ACCESS_TOKEN_LIFETIME',
    );

    const accessToken = {
      type: 'Bearer',
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtSecretAccessKey,
        expiresIn: lifeTimeAccessToken,
      }),
    };

    return accessToken;
  }

  private async generateRefreshToken(
    user: User,
    token_id: string,
  ): Promise<RefreshToken> {
    const { id } = user;
    const payload = { user_id: id, token_id };

    const jwtSecretRefreshKey = await this.configService.get(
      'JWT_SECRET_REFRESH_KEY',
    );

    const lifeTimeRefreshToken = await this.configService.get(
      'REFRESH_TOKEN_LIFETIME',
    );

    const refreshToken = {
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: jwtSecretRefreshKey,
        expiresIn: lifeTimeRefreshToken,
      }),
    };

    return refreshToken;
  }

  private async verifyRefreshToken(
    refresh_token: string,
  ): Promise<DecodedRefreshToken> {
    const jwtSecretRefreshKey = await this.configService.get(
      'JWT_SECRET_REFRESH_KEY',
    );

    const validToken: DecodedRefreshToken = this.jwtService.verify(
      refresh_token,
      {
        secret: jwtSecretRefreshKey,
      },
    );

    return validToken;
  }

  private async hashRefreshToken(token: string): Promise<string> {
    const hashedRefreshToken = await argon2.hash(token);

    return hashedRefreshToken;
  }

  // Refresh tokens - methods for check and delete excess refresh token
  private async checkAndDeleteExcessRefreshToken(
    user_id: number,
  ): Promise<void> {
    const numberOfRefreshTokensIssued =
      await this.checkNumberOfRefreshTokensIssued(user_id);

    if (numberOfRefreshTokensIssued >= NUMBER_OF_TOKENS_ISSUED) {
      await this.deleteOldRefreshToken(user_id);
    }

    return;
  }

  private async checkNumberOfRefreshTokensIssued(
    user_id: number,
  ): Promise<number> {
    const amountTokens = await this.tokenRepository.findAndCountAll({
      where: { user_id },
    });

    const { count } = amountTokens;

    return count;
  }

  private async deleteOldRefreshToken(user_id: number): Promise<boolean> {
    const oldCreateAtRefreshToken = await this.tokenRepository.min(
      'created_at',
      {
        where: { user_id },
      },
    );

    const result = await this.tokenRepository.destroy({
      where: { created_at: oldCreateAtRefreshToken },
      force: true,
    });

    return !!result;
  }

  // Password methods
  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);

    return hashedPassword;
  }

  private async checkHashPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }

  // Generation uuid (nanoid) methods
  private async generateUUID(): Promise<string> {
    return await nanoid();
  }

  // User to db methods
  private async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  private async getUserByLogin(
    login: string,
    paranoid: boolean,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('login')),
        login.toLowerCase(),
      ),
      paranoid,
    });

    return user;
  }

  private async getUserByTelegram(telegram: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { telegram: telegram.toLowerCase() },
      paranoid: false,
    });

    return user;
  }

  private async getUserByPhone(phone: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phone },
      paranoid: false,
    });

    return user;
  }

  private async createUser(
    user: UserInterface,
    password: string,
  ): Promise<User> {
    const WEBMASTER = Roles[0];
    const role = await this.findOrCreateRole(WEBMASTER);

    const newUser = await this.userRepository.create({
      ...user,
      telegram: user.telegram.toLowerCase(),
      password,
      role_id: role.id,
    });

    await this.createBalance(newUser.id);
    await this.createProfile(newUser.id);

    return newUser;
  }

  // Roles to db methods
  private async getRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });

    return role;
  }

  private async findOrCreateRole(role: string): Promise<Role> {
    const roleLowerCase = role.toLowerCase();

    const result = await this.roleRepository.findOrCreate({
      where: { value: roleLowerCase },
      defaults: {
        value: roleLowerCase,
      },
    });

    return result[0];
  }

  // Balance to db methods
  private async createBalance(user_id: number): Promise<Balance> {
    const newBalance = await this.balanceRepository.create({
      user_id,
    });

    return newBalance;
  }

  // Profile to db methods
  private async createProfile(user_id: number): Promise<Profile> {
    const newProfile = await this.profileRepository.create({
      user_id,
    });

    return newProfile;
  }

  // Refresh token to db methods
  private async getRefreshToken(id: string): Promise<Token> {
    const refreshToken = await this.tokenRepository.findOne({
      where: { id },
    });

    return refreshToken;
  }

  private async createRefreshToken(
    id: string,
    token: string,
    user_id: number,
  ): Promise<Token> {
    const lifeTimeRefreshToken = convertToMillisecondsUtil(
      await this.configService.get('REFRESH_TOKEN_LIFETIME'),
    );

    const savedToken = await this.tokenRepository.create({
      id,
      token,
      exp: (Date.now() + lifeTimeRefreshToken).toString().slice(0, -3),
      user_id,
    });

    return savedToken;
  }

  private async updateRefreshToken(
    token: string,
    id: string,
  ): Promise<[affectedCount: number]> {
    const lifeTimeRefreshToken = convertToMillisecondsUtil(
      await this.configService.get('REFRESH_TOKEN_LIFETIME'),
    );

    const updatedToken = await this.tokenRepository.update(
      {
        token,
        exp: (Date.now() + lifeTimeRefreshToken).toString().slice(0, -3),
      },
      { where: { id } },
    );

    return updatedToken;
  }

  private async deleteRefreshToken(id: string): Promise<boolean> {
    const result = await this.tokenRepository.destroy({
      where: { id },
      force: true,
    });

    return !!result;
  }
}
