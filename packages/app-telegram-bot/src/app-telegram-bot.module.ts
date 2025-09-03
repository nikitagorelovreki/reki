import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreServiceModule } from '@reki/core-service';
import { CorePersistenceModule } from '@reki/core-persistence';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core modules
    CoreServiceModule,
    CorePersistenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppTelegramBotModule {}
