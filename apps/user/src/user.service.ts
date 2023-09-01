import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import sequelize, { Op } from 'sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as argon2 from 'argon2';
import { Balance, Profile, Role, User } from './entities';
import { Roles, roles } from '@app/shared/enums';
import {
  QueryLimitOffsetRole,
  QuerySearchRole,
  UserBan,
  User as UserInterface,
  OverUser,
  UserWithRole,
} from '@app/shared/interfaces';
import {
  USERS_DEFAULT_LIMIT,
  USERS_DEFAULT_OFFSET,
} from '@app/shared/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: Repository<User>,
    @InjectModel(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectModel(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @InjectModel(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject('TELEGRAM_BOT_SERVICE')
    private readonly telegramBotService: ClientProxy,
  ) {}

  async health(): Promise<boolean> {
    return true;
  }

  async addRoles(): Promise<boolean> {
    for (const role of roles) {
      await this.findOrCreateRole(role);
    }

    return true;
  }

  async addAdmin(user: UserInterface): Promise<UserInterface | string> {
    const { password } = user;
    const admin = Roles[4];

    const isAdmin = await this.getUserAdmin(admin);

    if (isAdmin) {
      return 'admin_exists';
    }

    const validateUniqueParams = await this.validateUniqueUser(user);

    if (validateUniqueParams) {
      return validateUniqueParams;
    }

    const role = await this.findOrCreateRole(admin);
    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.createUser(user, hashedPassword, role.id);

    return newUser;
  }

  async addUser(user: UserWithRole): Promise<UserInterface | string> {
    const { password, role } = user;

    const validateUniqueParams = await this.validateUniqueUser(user);

    if (validateUniqueParams) {
      return validateUniqueParams;
    }

    const checkRole = await this.findOrCreateRole(role);
    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.createUser(user, hashedPassword, checkRole.id);
    const checkUser = await this.getUserById(newUser.id);

    return checkUser;
  }

  async getMe(id: number): Promise<UserInterface> {
    const user = await this.getUserById(id);

    return user;
  }

  async getUsers(
    id: number,
    queryParams: QueryLimitOffsetRole,
  ): Promise<{
    rows: UserInterface[];
    count: number;
  }> {
    const checkUser = await this.getUserById(id);

    const users = await this.getUsersDependingOnManager(
      checkUser.profile.id,
      checkUser.role.value,
      queryParams,
    );

    return users;
  }

  async searchUsers(
    id: number,
    queryParams: QuerySearchRole,
  ): Promise<{
    rows: UserInterface[];
    count: number;
  }> {
    const checkUser = await this.getUserById(id);

    const users = await this.searchUsersDependingOnManager(
      checkUser.profile.id,
      checkUser.role.value,
      queryParams,
    );

    return users;
  }

  async updateBan(userBan: UserBan): Promise<UserInterface> {
    const { user_id, is_ban } = userBan;

    const checkUser = await this.getUserById(user_id);

    if (!checkUser) {
      return null;
    }

    await this.updateUserBan(checkUser.id, is_ban);

    const updateUser = await this.getUserById(checkUser.id);

    return updateUser;
  }

  async updateOverUser(
    updateOverUser: OverUser,
  ): Promise<UserInterface | string> {
    const { user_id, over_user_id } = updateOverUser;

    const checkUser = await this.getUserById(user_id);
    const checkOverUser = await this.getUserById(over_user_id);

    if (!checkUser || !checkOverUser) {
      return null;
    }

    const checkUserAndOverUserRole = await this.validationUserAndOverUserRole(
      checkUser.role.value,
      checkOverUser.role.value,
    );

    if (checkUserAndOverUserRole) {
      return checkUserAndOverUserRole;
    }

    await this.updateProfileByOverUser(checkUser.id, checkOverUser.profile.id);

    const updateUser = await this.getUserById(checkUser.id);

    return updateUser;
  }

  async updateTelegram(
    user_id: number,
    telegram: string,
  ): Promise<UserInterface | string> {
    const checkUser = await this.getUserById(user_id);

    if (!checkUser) {
      return null;
    }

    const checkPhone = await this.getUserByTelegram(telegram);

    if (checkPhone) {
      return 'telegram_exists';
    }

    const isConfirmedTelegram: boolean = await firstValueFrom(
      this.telegramBotService.send(
        {
          cmd: 'telegram_confirm_registration',
        },

        { username: telegram.toLowerCase() },
      ),
    );

    if (!isConfirmedTelegram) {
      return 'telegram_not_confirmed';
    }

    await this.updateUserTelegramById(user_id, telegram);

    const updateUser = await this.getUserById(user_id);

    return updateUser;
  }

  async updatePhone(
    user_id: number,
    phone: string,
  ): Promise<UserInterface | string> {
    const checkUser = await this.getUserById(user_id);

    if (!checkUser) {
      return null;
    }

    const checkPhone = await this.getUserByPhone(phone);

    if (checkPhone) {
      return 'phone_exists';
    }

    await this.updateUserPhoneById(user_id, phone);

    const updateUser = await this.getUserById(user_id);

    return updateUser;
  }

  async updatePassword(
    user_id: number,
    password: string,
  ): Promise<UserInterface> {
    const checkUser = await this.getUserById(user_id);

    if (!checkUser) {
      return null;
    }

    const hashedPassword = await this.hashPassword(password);
    await this.updateUserPasswordById(user_id, hashedPassword);

    const updateUser = await this.getUserById(user_id);

    return updateUser;
  }

  async resetPassword(
    telegram: string,
    password: string,
  ): Promise<UserInterface> {
    const paranoid = true;
    const checkUser = await this.getUserByTelegram(telegram, paranoid);

    if (!checkUser) {
      return null;
    }

    const hashedPassword = await this.hashPassword(password);
    await this.updateUserPasswordById(checkUser.id, hashedPassword);

    const updateUser = await this.getUserById(checkUser.id);

    return updateUser;
  }

  async deleteUser(id: number): Promise<UserInterface | string> {
    const checkUser = await this.getUserById(id);

    if (!checkUser) {
      return null;
    }

    if (checkUser.role.value.toLowerCase() === 'admin') {
      return 'delete_admin_forbidden';
    }

    const newOverUser = checkUser.profile.over_user;

    await this.updateProfilesDeletedOverUser(checkUser.profile.id, newOverUser);
    await this.deleteUserById(checkUser.id);

    return checkUser;
  }

  // Private methods
  // User validate methods
  private async validateUniqueUser(user: UserInterface): Promise<string> {
    const { login, telegram, phone } = user;

    const checkLogin = await this.getUserByLogin(login);

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

  // User and over user (manager) role validate methods
  private async validationUserAndOverUserRole(
    user_role: string,
    over_user_role: string,
  ): Promise<string> {
    if (user_role !== 'webmaster' && user_role !== 'curator') {
      return 'user_not_correct';
    }

    if (over_user_role !== 'curator' && over_user_role !== 'teamlead') {
      return 'over_user_not_correct';
    }

    if (user_role === over_user_role) {
      return 'user_and_over_user_identical';
    }

    return null;
  }

  // Password methods
  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);

    return hashedPassword;
  }

  // User to db methods
  private async getUserAdmin(admin: string): Promise<User> {
    const adminLowerCase = admin.toLowerCase();

    const user = await this.userRepository.findOne({
      include: [
        {
          model: Role,
          where: { value: adminLowerCase },
        },
      ],
    });

    return user;
  }

  private async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      paranoid: true,
      attributes: [
        'id',
        'login',
        'telegram',
        'phone',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
        },
        {
          model: Balance,
          attributes: ['id', 'main_balance', 'hold_balance'],
        },
        {
          model: Profile,
          attributes: ['id', 'is_ban', 'over_user'],
          include: [
            {
              model: Profile,
              as: 'overUserProfile', // Alias for over_user (manager) profile
              attributes: ['id', 'is_ban', 'over_user'],
              include: [
                {
                  model: User,
                  attributes: [
                    'id',
                    'login',
                    'telegram',
                    'phone',
                    'created_at',
                    'updated_at',
                  ],
                  include: [
                    {
                      model: Role,
                    },
                  ],
                },
                {
                  model: Profile,
                  as: 'overUserProfile', // Alias for over_user (manager) profile
                  attributes: ['id', 'is_ban', 'over_user'],
                  include: [
                    {
                      model: User,
                      attributes: [
                        'id',
                        'login',
                        'telegram',
                        'phone',
                        'created_at',
                        'updated_at',
                      ],
                      include: [
                        {
                          model: Role,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return user;
  }

  private async getUserByLogin(login: string, paranoid = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('login')),
        login.toLowerCase(),
      ),
      paranoid,
      attributes: [
        'id',
        'login',
        'telegram',
        'phone',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
        },
        {
          model: Balance,
          attributes: ['id', 'main_balance', 'hold_balance'],
        },
        {
          model: Profile,
          attributes: ['id', 'is_ban', 'over_user'],
        },
      ],
    });

    return user;
  }

  private async getUserByTelegram(
    telegram: string,
    paranoid = false,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { telegram: telegram.toLowerCase() },
      paranoid,
    });

    return user;
  }

  private async getUserByPhone(phone: string, paranoid = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phone },
      paranoid,
    });

    return user;
  }

  private async getUsersDependingOnManager(
    idProfileOfHimself: number,
    roleOfHimself: string,
    queryParams: QueryLimitOffsetRole,
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    const limit = queryParams.limit || USERS_DEFAULT_LIMIT;
    const offset = queryParams.offset || USERS_DEFAULT_OFFSET;
    const roleOfEmployees = queryParams.role
      ? queryParams.role.toLowerCase()
      : '';

    if (roleOfHimself === 'admin' || roleOfHimself === 'director') {
      const users = await this.userRepository.findAndCountAll({
        paranoid: true,
        limit,
        offset,
        order: [['created_at', 'ASC']],
        attributes: [
          'id',
          'login',
          'telegram',
          'phone',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: Role,
            where: {
              value: {
                [Op.and]: {
                  [Op.substring]: roleOfEmployees,
                  [Op.notIn]:
                    roleOfHimself === 'admin'
                      ? ['admin']
                      : ['admin', 'director'],
                },
              },
            },
          },
          {
            model: Balance,
            attributes: ['id', 'main_balance', 'hold_balance'],
          },
          {
            model: Profile,
            attributes: ['id', 'is_ban', 'over_user'],
          },
        ],
      });

      return users;
    }

    if (roleOfHimself === 'teamlead') {
      const profilesOfEmployees: Profile[] =
        await this.profileRepository.findAll({
          paranoid: true,
          where: { over_user: idProfileOfHimself },
          attributes: ['id'],
        });

      const idProfilesOfEmployees = profilesOfEmployees.map(
        (profile: Profile) => profile.id,
      );

      const users = await this.userRepository.findAndCountAll({
        paranoid: true,
        limit,
        offset,
        order: [['created_at', 'ASC']],
        attributes: [
          'id',
          'login',
          'telegram',
          'phone',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: Role,
            where: { value: { [Op.substring]: roleOfEmployees } },
          },
          {
            model: Balance,
            attributes: ['id', 'main_balance', 'hold_balance'],
          },
          {
            model: Profile,
            where: {
              over_user: [idProfileOfHimself, ...idProfilesOfEmployees],
            },
            attributes: ['id', 'is_ban', 'over_user'],
          },
        ],
      });

      return users;
    }

    const users = await this.userRepository.findAndCountAll({
      paranoid: true,
      limit,
      offset,
      order: [['created_at', 'ASC']],
      attributes: [
        'id',
        'login',
        'telegram',
        'phone',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
        },
        {
          model: Balance,
          attributes: ['id', 'main_balance', 'hold_balance'],
        },
        {
          model: Profile,
          where: { over_user: idProfileOfHimself },
          attributes: ['id', 'is_ban', 'over_user'],
        },
      ],
    });

    return users;
  }

  private async searchUsersDependingOnManager(
    idProfileOfHimself: number,
    roleOfHimself: string,
    queryParams: QuerySearchRole,
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    const limit = USERS_DEFAULT_LIMIT;
    const roleOfEmployees = queryParams.role
      ? queryParams.role.toLowerCase()
      : '';
    const search = queryParams.search.toLowerCase();

    if (roleOfHimself === 'admin' || roleOfHimself === 'director') {
      const users = await this.userRepository.findAndCountAll({
        paranoid: true,
        limit,
        order: [['created_at', 'ASC']],
        attributes: [
          'id',
          'login',
          'telegram',
          'phone',
          'created_at',
          'updated_at',
        ],
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.cast(sequelize.col('User.id'), 'varchar'),
              { [Op.substring]: search },
            ),
            {
              login: {
                [Op.substring]: search,
              },
            },
            {
              telegram: {
                [Op.substring]: search,
              },
            },
          ],
        },
        include: [
          {
            model: Role,
            where: {
              value: {
                [Op.and]: {
                  [Op.substring]: roleOfEmployees,
                  [Op.notIn]:
                    roleOfHimself === 'admin'
                      ? ['admin']
                      : ['admin', 'director'],
                },
              },
            },
          },
          {
            model: Balance,
            attributes: ['id', 'main_balance', 'hold_balance'],
          },
          {
            model: Profile,
            attributes: ['id', 'is_ban', 'over_user'],
          },
        ],
      });

      return users;
    }

    if (roleOfHimself === 'teamlead') {
      const profilesOfEmployees: Profile[] =
        await this.profileRepository.findAll({
          paranoid: true,
          where: { over_user: idProfileOfHimself },
          attributes: ['id'],
        });

      const idProfilesOfEmployees = profilesOfEmployees.map(
        (profile: Profile) => profile.id,
      );

      const users = await this.userRepository.findAndCountAll({
        paranoid: true,
        limit,
        order: [['created_at', 'ASC']],
        attributes: [
          'id',
          'login',
          'telegram',
          'phone',
          'created_at',
          'updated_at',
        ],
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.cast(sequelize.col('User.id'), 'varchar'),
              { [Op.substring]: search },
            ),
            {
              login: {
                [Op.substring]: search,
              },
            },
            {
              telegram: {
                [Op.substring]: search,
              },
            },
          ],
        },
        include: [
          {
            model: Role,
            where: { value: { [Op.substring]: roleOfEmployees } },
          },
          {
            model: Balance,
            attributes: ['id', 'main_balance', 'hold_balance'],
          },
          {
            model: Profile,
            where: {
              over_user: [idProfileOfHimself, ...idProfilesOfEmployees],
            },
            attributes: ['id', 'is_ban', 'over_user'],
          },
        ],
      });

      return users;
    }

    const users = await this.userRepository.findAndCountAll({
      paranoid: true,
      limit,
      order: [['created_at', 'ASC']],
      attributes: [
        'id',
        'login',
        'telegram',
        'phone',
        'created_at',
        'updated_at',
      ],
      where: {
        [Op.or]: [
          sequelize.where(sequelize.cast(sequelize.col('User.id'), 'varchar'), {
            [Op.substring]: search,
          }),
          {
            login: {
              [Op.substring]: search,
            },
          },
          {
            telegram: {
              [Op.substring]: search,
            },
          },
        ],
      },
      include: [
        {
          model: Role,
        },
        {
          model: Balance,
          attributes: ['id', 'main_balance', 'hold_balance'],
        },
        {
          model: Profile,
          where: { over_user: idProfileOfHimself },
          attributes: ['id', 'is_ban', 'over_user'],
        },
      ],
    });

    return users;
  }

  private async createUser(
    user: UserInterface,
    password: string,
    role_id: number,
  ): Promise<User> {
    const newUser = await this.userRepository.create({
      ...user,
      password,
      role_id,
    });

    await this.createBalance(newUser.id);
    await this.createProfile(newUser.id);

    return newUser;
  }

  private async updateUserTelegramById(
    id: number,
    telegram: string,
  ): Promise<void> {
    await this.userRepository.update(
      {
        telegram: telegram.toLowerCase(),
      },
      {
        where: { id },
      },
    );
  }

  private async updateUserPhoneById(id: number, phone: string): Promise<void> {
    await this.userRepository.update(
      {
        phone,
      },
      {
        where: { id },
      },
    );
  }

  private async updateUserPasswordById(
    id: number,
    password: string,
  ): Promise<void> {
    await this.userRepository.update(
      {
        password,
      },
      {
        where: { id },
      },
    );
  }

  private async deleteUserById(id: number): Promise<boolean> {
    const result = await this.userRepository.destroy({
      where: { id },
    });

    return !!result;
  }

  // Role to db methods
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

  private async updateUserBan(user_id: number, is_ban: boolean): Promise<void> {
    await this.profileRepository.update({ is_ban }, { where: { user_id } });
  }

  private async updateProfileByOverUser(
    user_id: number,
    over_user: number,
  ): Promise<void> {
    await this.profileRepository.update({ over_user }, { where: { user_id } });
  }

  private async updateProfilesDeletedOverUser(
    over_user: number,
    new_over_user: number,
  ): Promise<void> {
    await this.profileRepository.update(
      { over_user: new_over_user },
      {
        where: { over_user },
      },
    );
  }
}
