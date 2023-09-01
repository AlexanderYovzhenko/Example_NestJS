import { profileStub } from '../stubs';

export const profileRepositoryMock = {
  findAll: jest.fn().mockResolvedValue(Promise.resolve([profileStub()])),
  create: jest.fn().mockResolvedValue(Promise.resolve(profileStub())),
  update: jest.fn().mockResolvedValue(Promise.resolve([profileStub(), true])),
};
