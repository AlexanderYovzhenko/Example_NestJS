import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtOptions = (): JwtModuleAsyncOptions => ({
  global: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async () => ({}),
});
