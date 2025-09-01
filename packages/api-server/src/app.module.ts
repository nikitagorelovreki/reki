import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { PersistenceModule } from '@reki/persistence';
import { UseCasesModule } from '@reki/use-cases';
import { ApiModule } from '@reki/api';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
      limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
    }]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Core modules
    PersistenceModule,
    UseCasesModule,
    ApiModule,
  ],
})
export class AppModule {}
