// Test setup for Auth Server tests
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
    generateTestUser: (overrides?: any) => any;
    generateTestRole: (overrides?: any) => any;
    wait: (ms: number) => Promise<void>;
    cleanupTestData: () => Promise<void>;
  };
}

// Initialize test database
global.testDb = new TestDatabase();
global.httpMocks = new TestHttpMocks();

global.testUtils = {
  generateTestUser: (overrides = {}) => ({
    email: `test.user.${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    ...overrides
  }),

  generateTestRole: (overrides = {}) => ({
    name: `test_role_${Date.now()}`,
    description: 'Test role description',
    permissions: ['read_own_profile', 'update_own_profile'],
    ...overrides
  }),

  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  cleanupTestData: async () => {
    await global.testDb.cleanup();
  }
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
