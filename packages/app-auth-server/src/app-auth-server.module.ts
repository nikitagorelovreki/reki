import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthDomainModule } from '@reki/auth-domain';
import { AuthServiceModule } from '@reki/auth-service';
import { AuthPersistenceModule } from '@reki/auth-persistence';
import { AuthController, UserController } from '@reki/api';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
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
    AuthDomainModule,
    AuthServiceModule,
    AuthPersistenceModule,
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AppAuthServerModule {}
