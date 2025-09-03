import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthServiceModule } from '@reki/auth-service';
import { AuthApiModule } from '@reki/auth-api';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
      },
    ]),

    // Auth modules
    AuthServiceModule,
    AuthApiModule,
  ],
})
export class AppModule {}
