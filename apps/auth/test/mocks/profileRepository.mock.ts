import { profileStub } from '../stubs';

export const profileRepositoryMock = {
  create: jest.fn().mockResolvedValue(Promise.resolve(profileStub())),
};
