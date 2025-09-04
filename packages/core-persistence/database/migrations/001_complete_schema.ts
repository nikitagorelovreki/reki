import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Включаем расширение для UUID
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Создаем таблицу клиник
  await knex.schema.createTable('clinics', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('address');
    table.string('phone');
    table.string('email');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('name');
  });

  // Создаем таблицу клиентов
  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('middle_name');
    table.date('birth_date');
    table.string('phone');
    table.string('email');
    table.text('address');
    table.text('medical_history');
    table.uuid('clinic_id').references('id').inTable('clinics').onDelete('SET NULL');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('first_name');
    table.index('last_name');
    table.index('clinic_id');
  });

  // Создаем таблицу устройств
  await knex.schema.createTable('devices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('model');
    table.string('serial_number').unique();
    table.enum('status', [
      'REGISTERED',
      'IN_STOCK',
      'AT_CLINIC',
      'AT_PATIENT_HOME',
      'UNDER_SERVICE',
      'RMA',
      'DECOMMISSIONED'
    ]).notNullable().defaultTo('REGISTERED');
    table.uuid('clinic_id').references('id').inTable('clinics').onDelete('SET NULL');
    table.uuid('patient_id').references('id').inTable('clients').onDelete('SET NULL');
    table.timestamp('last_sync');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('name');
    table.index('serial_number');
    table.index('status');
    table.index('clinic_id');
    table.index('patient_id');
  });

  // Создаем таблицу разрешений
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable().unique();
    table.string('description');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('name');
  });

  // Создаем таблицу ролей
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable().unique();
    table.string('description');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('name');
  });

  // Создаем таблицу пользователей
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('first_name');
    table.string('last_name');
    table.boolean('is_active').defaultTo(true);
    table.uuid('clinic_id').references('id').inTable('clinics').onDelete('SET NULL');
    table.timestamp('last_login');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('username');
    table.index('email');
    table.index('is_active');
    table.index('clinic_id');
  });

  // Создаем связующую таблицу роли-разрешения
  await knex.schema.createTable('role_permissions', (table) => {
    table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.uuid('permission_id').references('id').inTable('permissions').onDelete('CASCADE');
    table.primary(['role_id', 'permission_id']);
  });

  // Создаем связующую таблицу пользователи-роли
  await knex.schema.createTable('user_roles', (table) => {
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.primary(['user_id', 'role_id']);
  });

  // Создаем таблицу учетных данных пользователей (для тестов)
  await knex.schema.createTable('user_credentials', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('password_hash').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // Создаем таблицу шаблонов форм
  await knex.schema.createTable('form_templates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.string('type').notNullable();
    table.text('description');
    table.jsonb('schema').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.uuid('clinic_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('title');
    table.index('type');
    table.index('is_active');
    table.index('clinic_id');
  });

  // Создаем таблицу записей форм
  await knex.schema.createTable('form_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('client_id').references('id').inTable('clients').onDelete('CASCADE');
    table.uuid('form_template_id').references('id').inTable('form_templates').onDelete('CASCADE');
    table.jsonb('data').notNullable();
    table.jsonb('template_schema').nullable(); // Схема шаблона на момент сабмишена
    table.enum('status', ['draft', 'completed', 'cancelled']).notNullable().defaultTo('draft');
    table.uuid('created_by');
    table.uuid('completed_by');
    table.timestamp('completed_at');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('client_id');
    table.index('form_template_id');
    table.index('status');
    table.index('created_at');
  });

  // Создаем таблицу для отложенной аналитики
  await knex.schema.createTable('pending_analytics', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('entity_id').notNullable();
    table.string('entity_type').notNullable();
    table.jsonb('data').notNullable();
    table.integer('retry_count').defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('next_retry').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('entity_id');
    table.index('entity_type');
    table.index('next_retry');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Удаляем таблицы в обратном порядке
  await knex.schema.dropTableIfExists('pending_analytics');
  await knex.schema.dropTableIfExists('form_entries');
  await knex.schema.dropTableIfExists('form_templates');
  await knex.schema.dropTableIfExists('user_credentials');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('devices');
  await knex.schema.dropTableIfExists('clients');
  await knex.schema.dropTableIfExists('clinics');

  // Удаляем расширение
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
