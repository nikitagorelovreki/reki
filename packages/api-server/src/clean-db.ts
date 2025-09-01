import * as knex from 'knex';

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
};

async function cleanDatabase() {
  console.log('Cleaning database...');
  const db = knex.default(knexConfig);

  try {
    // Очищаем таблицы в правильном порядке (с учетом внешних ключей)
    await db('form_entries').del();
    console.log('Cleared form_entries table');
    
    await db('form_templates').del();
    console.log('Cleared form_templates table');
    
    await db('devices').del();
    console.log('Cleared devices table');
    
    await db('clients').del();
    console.log('Cleared clients table');
    
    await db('users').del();
    console.log('Cleared users table');
    
    await db('clinics').del();
    console.log('Cleared clinics table');
    
    console.log('Database cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await db.destroy();
  }
}

cleanDatabase();
