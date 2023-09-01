import { categoryDbStub } from '../stubs';

export const categoryRepositoryMock = {
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where.value === categoryDbStub().value) {
      return data.where.value === categoryDbStub().value
        ? Promise.resolve(categoryDbStub())
        : Promise.resolve(null);
    }

    return data.where.id === categoryDbStub().id
      ? Promise.resolve(categoryDbStub())
      : Promise.resolve(null);
  }),
  findAndCountAll: jest
    .fn()
    .mockResolvedValue(Promise.resolve({ count: 5, rows: [categoryDbStub()] })),
  create: jest.fn().mockResolvedValue(Promise.resolve(categoryDbStub())),
};
