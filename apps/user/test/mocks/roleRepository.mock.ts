import { roleDbStub } from '../stubs';

export const roleRepositoryMock = {
  findOne: jest.fn().mockImplementation((data) => {
    return data.where.id === roleDbStub().id
      ? Promise.resolve(roleDbStub())
      : Promise.resolve(null);
  }),
  findOrCreate: jest
    .fn()
    .mockImplementation(() => Promise.resolve([roleDbStub(), true])),
};
