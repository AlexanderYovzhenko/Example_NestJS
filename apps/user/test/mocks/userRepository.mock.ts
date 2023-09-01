import { userDbStub, overUserStub } from '../stubs';

export const userRepositoryMock = {
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where?.hasOwnProperty('id')) {
      return data.where.id === userDbStub().id
        ? Promise.resolve(userDbStub())
        : Promise.resolve(null);
    }

    if (data.where?.hasOwnProperty('telegram')) {
      return data.where.telegram === userDbStub().telegram
        ? Promise.resolve(userDbStub())
        : Promise.resolve(null);
    }

    if (data.where?.hasOwnProperty('phone')) {
      return data.where.phone === userDbStub().phone
        ? Promise.resolve(userDbStub())
        : Promise.resolve(null);
    }

    if (data.include[0].where?.value.toLowerCase() === 'admin') {
      return Promise.resolve(null);
    }

    const login = data.where?.logic;

    if (login === 'curator_nickname') {
      return {
        login: overUserStub().over_user_id,
        ...userDbStub(),
        role: {
          value: 'curator',
        },
      };
    }

    return login === userDbStub().login
      ? Promise.resolve({ ...userDbStub(), role: { value: 'webmaster' } })
      : Promise.resolve(null);
  }),
  findAndCountAll: jest
    .fn()
    .mockResolvedValue(Promise.resolve({ count: 1, rows: [userDbStub()] })),
  create: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  update: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  destroy: jest.fn().mockResolvedValue(Promise.resolve(1)),
};
