import { tokensStub } from '../stubs';

export const authServiceMock = {
  signUp: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  logIn: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  refresh: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  logOut: jest.fn().mockResolvedValue(Promise.resolve(true)),
  updatePassword: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
};
