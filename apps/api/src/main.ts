import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ApiModule } from './api.module';
import { config } from './config/docs/config';
import { AllExceptionsFilter } from './config/exception-filter/all-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.getHttpAdapter().getInstance().disable('x-powered-by', 'X-Powered-By');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const configService = app.get(ConfigService);

  const PORT = await configService.get('PORT');
  const HOST = await configService.get('HOST');
  const SERVER_URL = await configService.get('SERVER_URL');

  await app.listen(PORT, '0.0.0.0', () => {
    console.info(`Server is running on host ${HOST} and on port ${PORT}`);
    console.info(`Docs - ${SERVER_URL}/api/docs`);
  });
}

bootstrap();
