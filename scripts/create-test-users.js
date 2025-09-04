#!/usr/bin/env node

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

async function createTestUsers() {
  console.log('🔧 Creating test users for authentication...');
  
  // Динамически импортируем Knex
  const { default: knex } = await import('knex');
  
  // Подключаемся к базе данных
  const db = knex({
    client: 'postgresql',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'reki',
      password: 'reki',
      database: 'reki'
    }
  });

  try {
    // Проверяем существующих пользователей
    const existingUsers = await db('users').select('username');
    console.log(`📋 Found ${existingUsers.length} existing users`);

    const testUsers = [
      {
        username: 'admin',
        password: 'password',
        email: 'admin@reki.com',
        role: 'admin',
        roles: ['ADMIN', 'USER'],
        permissions: ['ALL_PERMISSIONS', 'READ_PROFILE', 'EDIT_PROFILE', 'MANAGE_USERS']
      },
      {
        username: 'user',
        password: 'password',
        email: 'user@reki.com',
        role: 'user',
        roles: ['USER'],
        permissions: ['READ_PROFILE', 'EDIT_PROFILE']
      },
      {
        username: 'testuser',
        password: 'TestPassword123!',
        email: 'test@example.com',
        role: 'user',
        roles: ['USER'],
        permissions: ['READ_PROFILE']
      }
    ];

    for (const userData of testUsers) {
      // Проверяем, существует ли пользователь
      const existingUser = await db('users').where('username', userData.username).first();
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.username} already exists, skipping...`);
        continue;
      }

      // Хешируем пароль
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);
      
      const userId = uuidv4();

      // Создаем пользователя в таблице users
      await db('users').insert({
        id: userId,
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role,
        roles: JSON.stringify(userData.roles),
        permissions: JSON.stringify(userData.permissions),
        first_name: userData.username.charAt(0).toUpperCase() + userData.username.slice(1),
        last_name: 'User',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Создаем запись в user_credentials если таблица существует
      try {
        await db('user_credentials').insert({
          user_id: userId,
          password_hash: passwordHash,
          created_at: new Date(),
          updated_at: new Date()
        });
      } catch (error) {
        console.log(`ℹ️  user_credentials table not found, skipping...`);
      }

      console.log(`✅ Created user: ${userData.username} (${userData.email})`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Available credentials:');
    console.log('  • admin / password');
    console.log('  • user / password');  
    console.log('  • testuser / TestPassword123!');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Запускаем только если файл вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUsers().catch(console.error);
}

export { createTestUsers };
