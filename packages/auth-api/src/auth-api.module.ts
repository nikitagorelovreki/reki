import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@reki/auth-service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthServiceModule, AuthModule],
  exports: [AuthModule],
})
export class AuthApiModule {}
