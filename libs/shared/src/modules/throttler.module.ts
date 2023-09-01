import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { THROTTLE_TTL, THROTTLE_LIMIT } from '../constants';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: THROTTLE_TTL,
        limit: THROTTLE_LIMIT,
      }),
    }),
  ],
})
export class ThrottlerSettingsModule {}
