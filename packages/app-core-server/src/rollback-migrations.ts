import knexConfig from '../../core-persistence/src/database/knex-config';

async function rollbackMigrations(): Promise<void> {
  console.log('Rolling back last batch of migrations...');
  // Динамически импортируем Knex
  const { default: knex } = await import('knex');
  const db = knex(knexConfig);

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
