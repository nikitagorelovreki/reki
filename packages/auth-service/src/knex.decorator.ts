import { Inject } from '@nestjs/common';

export const KNEX_TOKEN = 'KNEX_TOKEN';

export const InjectKnex = () => Inject(KNEX_TOKEN);
