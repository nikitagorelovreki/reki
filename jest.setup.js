// Global test setup
require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Global test utilities
global.testUtils = {
  // Generate test data
  generateTestClient: (overrides = {}) => ({
    firstName: 'Тестовый',
    lastName: 'Пациент', 
    email: `test.patient.${Date.now()}@example.com`,
    phone: '+7900123456',
    dateOfBirth: '1990-01-01',
    status: 'active_therapy',
    ...overrides
  }),

  generateTestDevice: (overrides = {}) => ({
    model: 'Тестовое устройство',
    serialNumber: `TEST-${Date.now()}`,
    status: 'IN_STOCK',
    manufactureDate: '2023-01-01',
    ...overrides
  }),

  generateTestForm: (overrides = {}) => ({
    name: 'Test Form',
    description: 'Test form description',
    fields: [
      { name: 'test_field', type: 'text', label: 'Test Field', required: true }
    ],
    ...overrides
  }),

  generateTestUser: (overrides = {}) => ({
    email: `test.user.${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    ...overrides
  }),

  // Utility functions
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  cleanupTestData: async (db) => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Cleanup can only run in test environment');
    }
    
    // Clean up in correct order (respecting foreign keys)
    await db('form_submissions').del();
    await db('form_templates').del();
    await db('clients').del();
    await db('devices').del();
    await db('users').del();
  },

  // Database connection for tests
  getTestDbConfig: () => ({
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres', 
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'reki_test'
    },
    migrations: {
      directory: './migrations'
    }
  })
};

// Jest timeout
jest.setTimeout(30000);
