import { userDbStub } from '../stubs';

export const userServiceMock = {
  addRoles: jest.fn().mockResolvedValue(Promise.resolve(true)),
  addAdmin: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  getMe: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  getUsers: jest
    .fn()
    .mockResolvedValue(Promise.resolve({ count: 5, rows: [userDbStub()] })),
  searchUsers: jest
    .fn()
    .mockResolvedValue(Promise.resolve({ count: 5, rows: [userDbStub()] })),
  addUser: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  updateBan: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  updateOverUser: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  updateTelegram: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  updatePhone: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  updatePassword: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  resetPassword: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
  deleteUser: jest.fn().mockResolvedValue(Promise.resolve(userDbStub())),
};
