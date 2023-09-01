import { categoryDbStub, publicationDbStub } from '../stubs';

export const publicationServiceMock = {
  addCategory: jest.fn().mockResolvedValue(Promise.resolve(categoryDbStub())),
  getCategories: jest
    .fn()
    .mockResolvedValue(Promise.resolve({ count: 5, rows: [categoryDbStub()] })),
  addPublication: jest
    .fn()
    .mockResolvedValue(Promise.resolve(publicationDbStub())),
  getPublication: jest
    .fn()
    .mockResolvedValue(Promise.resolve(publicationDbStub())),
  getPublications: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve({ count: 5, rows: [publicationDbStub()] }),
    ),
  searchPublications: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve({ count: 5, rows: [publicationDbStub()] }),
    ),
  updatePublication: jest
    .fn()
    .mockResolvedValue(Promise.resolve(publicationDbStub())),
  deletePublication: jest
    .fn()
    .mockResolvedValue(Promise.resolve(publicationDbStub())),
};
