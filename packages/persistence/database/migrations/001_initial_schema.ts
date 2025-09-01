import { Knex } from 'knex';
import { ClientStatus, DeviceStatus, FormStatus, FormType, FormEntryStatus } from '@cuis/domain';

/**
 * Миграция для создания начальной схемы базы данных
 */
export async function up(knex: Knex): Promise<void> {
  // Создаем расширение для генерации UUID
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Создаем таблицу клиентов
  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('full_name').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.string('middle_name');
    table.date('dob');
    table.text('diagnosis');
    table.jsonb('contacts').defaultTo('{}');
    table.enum('status', Object.values(ClientStatus)).notNullable().defaultTo(ClientStatus.INTAKE);
    table.uuid('clinic_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('full_name');
    table.index('last_name');
    table.index('status');
    table.index('clinic_id');
  });

  // Создаем таблицу устройств
  await knex.schema.createTable('devices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('serial').notNullable().unique();
    table.string('qr_code');
    table.jsonb('external_ids').defaultTo('{}');
    table.string('model').notNullable();
    table.string('hardware_revision');
    table.string('firmware_version');
    table.enum('status', Object.values(DeviceStatus)).notNullable().defaultTo(DeviceStatus.REGISTERED);
    table.string('current_location');
    table.uuid('clinic_id');
    table.uuid('owner_id');
    table.uuid('assigned_patient_id');
    table.uuid('responsible_user_id');
    table.date('warranty_until');
    table.string('purchase_order');
    table.timestamp('last_seen_at');
    table.timestamp('last_sync_at');
    table.string('telemetry_endpoint');
    table.jsonb('maintenance_notes').defaultTo('{}');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('serial');
    table.index('model');
    table.index('status');
    table.index('clinic_id');
    table.index('assigned_patient_id');
  });

  // Создаем таблицу клиник
  await knex.schema.createTable('clinics', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('code').unique();
    table.jsonb('address').defaultTo('{}');
    table.jsonb('contacts').defaultTo('{}');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('name');
    table.index('code');
    table.index('is_active');
  });

  // Создаем таблицу пользователей
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').notNullable().unique();
    table.string('email').unique();
    table.string('password_hash').notNullable();
    table.string('full_name');
    table.string('role').notNullable();
    table.uuid('clinic_id');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('username');
    table.index('email');
    table.index('role');
    table.index('clinic_id');
    table.index('is_active');
  });

  // Создаем таблицу шаблонов форм
  await knex.schema.createTable('form_templates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.text('description');
    table.string('type').notNullable().defaultTo('assessment');
    table.string('status').notNullable().defaultTo('draft');
    table.integer('version').notNullable().defaultTo(1);
    table.jsonb('schema').notNullable().defaultTo('{}');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.uuid('updated_by');

    // Индексы
    table.index('title');
    table.index('status');
    table.index('type');
    table.index(['title', 'version']);
  });

  // Создаем таблицу заполнений форм
  await knex.schema.createTable('form_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('form_id').notNullable().references('id').inTable('form_templates').onDelete('CASCADE');
    table.uuid('patient_id').references('id').inTable('clients');
    table.uuid('device_id').references('id').inTable('devices');
    table.uuid('clinic_id').references('id').inTable('clinics');
    table.string('status').notNullable().defaultTo('in_progress');
    table.jsonb('data').notNullable().defaultTo('{}');
    table.float('score');
    table.timestamp('completed_at');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.uuid('updated_by');

    // Индексы
    table.index('form_id');
    table.index('patient_id');
    table.index('device_id');
    table.index('clinic_id');
    table.index('status');
    table.index('completed_at');
  });

  // Создаем связи между таблицами
  await knex.schema.alterTable('clients', (table) => {
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('SET NULL');
  });

  await knex.schema.alterTable('devices', (table) => {
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('SET NULL');
    table.foreign('assigned_patient_id').references('id').inTable('clients').onDelete('SET NULL');
    table.foreign('responsible_user_id').references('id').inTable('users').onDelete('SET NULL');
  });

  await knex.schema.alterTable('users', (table) => {
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('SET NULL');
  });
}

/**
 * Откат миграции
 */
export async function down(knex: Knex): Promise<void> {
  // Удаляем таблицы в обратном порядке
  await knex.schema.dropTableIfExists('form_entries');
  await knex.schema.dropTableIfExists('form_templates');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('devices');
  await knex.schema.dropTableIfExists('clients');
  await knex.schema.dropTableIfExists('clinics');
}
