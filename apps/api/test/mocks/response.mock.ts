import { Response } from 'express';

export const responseMock: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
};
