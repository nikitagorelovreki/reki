import knex from 'knex';
import { up } from './database/migrations/001_complete_schema';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'reki',
    password: 'reki',
    database: 'reki',
  },
});

async function runMigration() {
  try {
    console.log('Starting migration...');
    await up(db);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await db.destroy();
  }
}

runMigration();
