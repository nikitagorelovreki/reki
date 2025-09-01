import * as knex from 'knex';
import * as path from 'path';

// Конфигурация подключения к БД
const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'cuis',
    password: process.env.POSTGRES_PASSWORD || 'cuis',
    database: process.env.POSTGRES_DB || 'cuis',
  },
  migrations: {
    directory: path.join(__dirname, '../../persistence/database/migrations'),
    tableName: 'knex_migrations',
    extension: 'ts',
  },
};

async function runMigrations() {
  console.log('Running database migrations...');
  const db = knex.default(knexConfig);

  try {
    // Запускаем миграции
    const result = await db.migrate.latest();
    
    if (result[1].length === 0) {
      console.log('No new migrations to run. Database is up to date.');
    } else {
      console.log(`Ran ${result[1].length} migrations:`);
      result[1].forEach((name: string) => console.log(`- ${name}`));
    }
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();
