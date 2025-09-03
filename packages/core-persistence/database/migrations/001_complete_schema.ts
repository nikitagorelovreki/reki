import { Knex } from 'knex';

// Определяем статусы и роли локально, чтобы избежать проблем с импортом
const ClientStatus = {
  INTAKE: 'intake',
  ACTIVE: 'active',
  DISCHARGED: 'discharged',
  ARCHIVED: 'archived',
} as const;

const DeviceStatus = {
  REGISTERED: 'registered',
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired',
} as const;

const SystemRoles = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

/**
 * Объединенная миграция для создания полной схемы базы данных
 */
export async function up(knex: Knex): Promise<void> {
  // Создаем расширение для генерации UUID
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

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

  // Создаем таблицу разрешений
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable().unique();
    table.string('description');
    table.string('resource').notNullable();
    table.string('action').notNullable();
    table.boolean('is_system').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // Создаем таблицу ролей
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable().unique();
    table.string('description');
    table.boolean('is_system').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // Создаем таблицу пользователей
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.string('full_name');
    table.string('role').notNullable();
    table.uuid('clinic_id');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('last_login');
    table.timestamp('last_login_at');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Индексы
    table.index('username');
    table.index('email');
    table.index('role');
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
    table.index('created_by');
  });

  // Создаем системные роли
  const adminRole = await knex('roles').insert({
    name: SystemRoles.ADMIN,
    description: 'Администратор системы',
    is_system: true,
  }).returning('id');

  const userRole = await knex('roles').insert({
    name: SystemRoles.USER,
    description: 'Обычный пользователь',
    is_system: true,
  }).returning('id');

  // Создаем системного администратора
  const adminUser = await knex('users').insert({
    username: 'admin',
    email: 'admin@reki.local',
    password_hash: 'temporary_hash',
    first_name: 'System',
    last_name: 'Administrator',
    full_name: 'System Administrator',
    role: 'admin',
    is_active: true,
  }).returning('id');

  // Назначаем роль администратора
  await knex('user_roles').insert({
    user_id: adminUser[0].id,
    role_id: adminRole[0].id,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('form_entries');
  await knex.schema.dropTableIfExists('form_templates');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('devices');
  await knex.schema.dropTableIfExists('clients');
  await knex.schema.dropTableIfExists('clinics');
}
