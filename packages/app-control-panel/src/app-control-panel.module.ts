import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreServiceModule } from '@reki/core-service';
import { CorePersistenceModule } from '@reki/core-persistence';
import { ApiModule } from '@reki/api';

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
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppControlPanelModule {}
