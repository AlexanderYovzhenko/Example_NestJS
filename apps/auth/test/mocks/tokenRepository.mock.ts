import { refreshTokenDbStub } from '../stubs';

export const tokenRepositoryMock = {
  findOne: jest.fn().mockImplementation((token_id) => {
    return token_id.where.id === refreshTokenDbStub().id
      ? Promise.resolve(refreshTokenDbStub())
      : Promise.resolve(null);
  }),
  findAndCountAll: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve({ count: 1, token: refreshTokenDbStub() }),
    ),
  create: jest.fn().mockResolvedValue(Promise.resolve(refreshTokenDbStub())),
  update: jest.fn().mockResolvedValue(Promise.resolve(refreshTokenDbStub())),
  destroy: jest.fn().mockImplementation((token_id) => {
    return token_id.where.id === refreshTokenDbStub().id
      ? Promise.resolve(1)
      : Promise.resolve(0);
  }),
  min: jest
    .fn()
    .mockResolvedValue(Promise.resolve(refreshTokenDbStub().createAt)),
};
