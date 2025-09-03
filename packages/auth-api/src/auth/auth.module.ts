import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@reki/auth-service';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

@Module({
  imports: [AuthServiceModule],
  controllers: [AuthController, UserController],
  exports: [],
})
export class AuthModule {}
