import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messages =
      exception?.['response']?.['message'] ?? exception?.['message'];
    const error = exception?.['response']?.['error'] ?? exception?.['name'];

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toLocaleString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      messages: Array.isArray(messages) ? messages : [messages],
      error: error,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
