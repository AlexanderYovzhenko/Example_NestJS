import { refreshTokenDbStub, userDbStub } from '../stubs';

export const userRepositoryMock = {
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where.hasOwnProperty('id')) {
      return data.where.id === refreshTokenDbStub().user_id
        ? Promise.resolve(userDbStub())
        : Promise.resolve(null);
    }

    if (data.where.hasOwnProperty('telegram')) {
      return data.where.telegram === userDbStub().telegram
        ? Promise.resolve(userDbStub())
        : Promise.resolve(null);
    }

    if (data.where.hasOwnProperty('phone')) {
      return data.where.phone === userDbStub().phone
        ? Promise.resolve(userDbStub())
        : Promise.resolve(null);
    }

    const login = data.where.logic;

    return login === userDbStub().login
      ? Promise.resolve(userDbStub())
      : Promise.resolve(null);
  }),
  create: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
};
