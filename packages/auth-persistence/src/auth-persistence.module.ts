import { Module } from '@nestjs/common';
import { PersistenceCommonsModule } from '@reki/persistence-commons';
import { UserRepository } from './user.repository';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from './permission.repository';

// Tokens
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';
export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';

@Module({
  imports: [PersistenceCommonsModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
    },
  ],
  exports: [
    USER_REPOSITORY,
    ROLE_REPOSITORY,
    PERMISSION_REPOSITORY,
  ],
})
export class AuthPersistenceModule {}
