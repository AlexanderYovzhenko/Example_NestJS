import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Example NestJS')
  .setDescription('API for example - NestJS')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build();
