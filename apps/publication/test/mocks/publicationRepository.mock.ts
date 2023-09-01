import { publicationDbStub } from '../stubs';

export const publicationRepositoryMock = {
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where?.hasOwnProperty('id')) {
      return data.where.id === publicationDbStub().id
        ? Promise.resolve(publicationDbStub())
        : Promise.resolve(null);
    }
  }),
  findAndCountAll: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve({ count: 5, rows: [publicationDbStub()] }),
    ),
  create: jest.fn().mockResolvedValue(Promise.resolve(publicationDbStub())),
  update: jest.fn().mockResolvedValue(Promise.resolve(publicationDbStub())),
  destroy: jest.fn().mockResolvedValue(Promise.resolve(publicationDbStub())),
};
