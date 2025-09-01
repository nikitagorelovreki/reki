import { Knex } from 'knex';

// Конфигурация только для PostgreSQL
const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'reki',
    password: process.env.POSTGRES_PASSWORD || 'reki',
    database: process.env.POSTGRES_DB || 'reki',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
  },
};

export default config;
