import knexConfig from '../../core-persistence/src/database/knex-config';

async function runMigrations(): Promise<void> {
  console.log('Running database migrations...');
  // Динамически импортируем Knex
  const { default: knex } = await import('knex');
  const db = knex(knexConfig);

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
