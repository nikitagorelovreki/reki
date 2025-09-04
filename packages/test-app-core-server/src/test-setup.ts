// Test setup for Core Server tests
import dotenv from 'dotenv';
import { TestDatabase } from './utils/test-database';
import { TestHttpMocks } from './utils/test-http-mocks';

// Load test environment
dotenv.config({ path: '.env.test' });

// Global test configuration
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Global test utilities
declare global {
  var testDb: TestDatabase;
  var httpMocks: TestHttpMocks;
  var testUtils: {
    generateTestClient: (overrides?: any) => any;
    generateTestDevice: (overrides?: any) => any;
    generateTestForm: (overrides?: any) => any;
    wait: (ms: number) => Promise<void>;
    cleanupTestData: () => Promise<void>;
  };
}

// Initialize test database
global.testDb = new TestDatabase();
global.httpMocks = new TestHttpMocks();

global.testUtils = {
  generateTestClient: (overrides = {}) => ({
    full_name: 'Тестовый Пациент',
    firstName: 'Тестовый',
    lastName: 'Пациент',
    contacts: {
      email: `test.patient.${Date.now()}@example.com`,
      phone: '+7900123456',
    },
    dateOfBirth: '1990-01-01',
    status: 'intake',
    ...overrides,
  }),

  generateTestDevice: (overrides = {}) => ({
    model: 'Тестовое устройство',
    serial: `TEST-${Date.now()}`,
    status: 'IN_STOCK',
    manufactureDate: '2023-01-01',
    ...overrides,
  }),

  generateTestForm: (overrides = {}) => ({
    name: 'Test Form',
    description: 'Test form description',
    fields: [
      { name: 'test_field', type: 'text', label: 'Test Field', required: true },
    ],
    ...overrides,
  }),

  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  cleanupTestData: async () => {
    await global.testDb.cleanup();
  },
};

// Setup hooks
beforeAll(async () => {
  await global.testDb.connect();
  await global.testDb.migrate();
});

beforeEach(async () => {
  await global.testUtils.cleanupTestData();
  global.httpMocks.reset();
});

afterAll(async () => {
  await global.testDb.disconnect();
});

// Set Jest timeout
jest.setTimeout(30000);
