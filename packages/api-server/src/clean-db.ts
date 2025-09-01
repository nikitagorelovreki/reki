import knexConfig from '../../persistence/src/database/knex-config';

async function cleanDatabase(): Promise<void> {
  console.log('Cleaning database...');
  // Динамически импортируем Knex
  const { default: knex } = await import('knex');
  const db = knex(knexConfig);

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
