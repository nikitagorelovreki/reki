import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthPersistenceModule } from '@reki/auth-persistence';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    AuthPersistenceModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    RoleService,
    PermissionService,
  ],
  exports: [
    AuthService,
    UserService,
    RoleService,
    PermissionService,
  ],
})
export class AuthServiceModule {}
