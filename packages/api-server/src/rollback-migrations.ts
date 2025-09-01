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

async function rollbackMigrations() {
  console.log('Rolling back last batch of migrations...');
  const db = knex.default(knexConfig);

  try {
    // Откатываем последнюю партию миграций
    const result = await db.migrate.rollback();
    
    if (result[1].length === 0) {
      console.log('No migrations to rollback.');
    } else {
      console.log(`Rolled back ${result[1].length} migrations:`);
      result[1].forEach((name: string) => console.log(`- ${name}`));
    }
    
    console.log('Rollback completed successfully!');
  } catch (error) {
    console.error('Error rolling back migrations:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

rollbackMigrations();
