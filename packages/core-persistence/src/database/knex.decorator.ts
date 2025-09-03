import { Inject } from '@nestjs/common';

export const KNEX_TOKEN = 'KNEX_TOKEN';

export const InjectKnex = () => Inject(KNEX_TOKEN);

// Токены для auth репозиториев
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';
export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';

// Токены для core репозиториев
export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';
export const DEVICE_REPOSITORY = 'DEVICE_REPOSITORY';
export const FORM_REPOSITORY = 'FORM_REPOSITORY';
export const FORM_ENTRY_REPOSITORY = 'FORM_ENTRY_REPOSITORY';
