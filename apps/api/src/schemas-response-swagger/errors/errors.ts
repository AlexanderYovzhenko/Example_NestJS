import { HttpStatus } from '@nestjs/common';
import {
  ACCESS_DENIED,
  SERVER_ERROR,
  UNAUTHORIZED,
  USER_WRONG_LOGIN_PASSWORD,
} from '@app/shared/constants';

const schemaError = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    timestamp: { type: 'string' },
    path: { type: 'string' },
    messages: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    error: { type: 'string' },
  },
};

const schemaError400 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.BAD_REQUEST,
    timestamp: '6/30/2023, 7:29:33 AM',
    path: '/auth/signup',
    messages: ['плохой запрос'],
    error: 'Bad Request',
  },
};

const schemaError401 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.UNAUTHORIZED,
    timestamp: '7/5/2023, 7:00:13 AM',
    path: '/auth/refresh',
    messages: [UNAUTHORIZED],
    error: 'UnauthorizedException',
  },
};

const schemaError403 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.FORBIDDEN,
    timestamp: '7/5/2023, 7:09:24 AM',
    path: '/auth/login',
    messages: [ACCESS_DENIED],
    error: 'Forbidden',
  },
};

const schemaErrorWrongLoginPassword403 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.FORBIDDEN,
    timestamp: '7/5/2023, 7:09:24 AM',
    path: '/auth/login',
    messages: [USER_WRONG_LOGIN_PASSWORD],
    error: 'ForbiddenException',
  },
};

const schemaError404 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.NOT_FOUND,
    timestamp: '7/5/2023, 7:13:35 AM',
    path: '/auth/refresh',
    messages: ['не найдено'],
    error: 'Not Found',
  },
};

const schemaError409 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.CONFLICT,
    timestamp: '7/5/2023, 8:28:31 AM',
    path: '/auth/signup',
    messages: ['конфликт'],
    error: 'Conflict',
  },
};

const schemaError500 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    timestamp: '7/5/2023, 8:34:09 AM',
    path: '/auth/signup',
    messages: [SERVER_ERROR],
    error: 'TypeError',
  },
};

const schemaError503 = {
  ...schemaError,
  example: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    timestamp: '7/5/2023, 8:34:09 AM',
    path: '/status',
    messages: [SERVER_ERROR],
    error: 'TypeError',
  },
};

export {
  schemaError,
  schemaError400,
  schemaError401,
  schemaError403,
  schemaErrorWrongLoginPassword403,
  schemaError404,
  schemaError409,
  schemaError500,
  schemaError503,
};
