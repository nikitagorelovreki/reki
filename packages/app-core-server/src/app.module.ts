import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { CorePersistenceModule } from '@reki/core-persistence';
import { CoreServiceModule } from '@reki/core-service';
import { ApiModule } from '@reki/api';

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

    // Scheduling
    ScheduleModule.forRoot(),

    // Core modules
    CorePersistenceModule,
    CoreServiceModule,
    ApiModule,
  ],
})
export class AppModule {}
