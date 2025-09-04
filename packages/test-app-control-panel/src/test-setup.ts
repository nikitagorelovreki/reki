// Test setup for Control Panel tests
import dotenv from 'dotenv';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TestDatabase } from './utils/test-database';
import { TestAPIMocks } from './utils/test-api-mocks';

// Load test environment
dotenv.config({ path: '.env.test' });

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Global test configuration
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Global test utilities
declare global {
  var testDb: TestDatabase;
  var apiMocks: TestAPIMocks;
  var testUtils: {
    generateTestClient: (overrides?: any) => any;
    generateTestDevice: (overrides?: any) => any;
    generateTestUser: (overrides?: any) => any;
    generateTestForm: (overrides?: any) => any;
    wait: (ms: number) => Promise<void>;
    cleanupTestData: () => Promise<void>;
    mockLogin: (userData?: any) => Promise<string>;
  };
}

// Initialize test utilities
global.testDb = new TestDatabase();
global.apiMocks = new TestAPIMocks();

global.testUtils = {
  generateTestClient: (overrides = {}) => ({
    id: `client-${Date.now()}`,
    firstName: 'Тестовый',
    lastName: 'Пациент',
    email: `test.patient.${Date.now()}@example.com`,
    phone: '+7900123456',
    dateOfBirth: '1990-01-01',
    status: 'active_therapy',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  generateTestDevice: (overrides = {}) => ({
    id: `device-${Date.now()}`,
    model: 'Тестовое устройство',
    serialNumber: `TEST-${Date.now()}`,
    status: 'IN_STOCK',
    manufactureDate: '2023-01-01',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  generateTestUser: (overrides = {}) => ({
    id: `user-${Date.now()}`,
    email: `test.user.${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    permissions: ['read_own_profile'],
    ...overrides
  }),

  generateTestForm: (overrides = {}) => ({
    id: `form-${Date.now()}`,
    name: 'Test Form',
    description: 'Test form description',
    fields: [
      { name: 'test_field', type: 'text', label: 'Test Field', required: true }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  cleanupTestData: async () => {
    await global.testDb.cleanup();
  },

  mockLogin: async (userData = {}) => {
    const user = global.testUtils.generateTestUser(userData);
    const token = `mock_token_${Date.now()}`;
    
    global.apiMocks.mockAuthLogin({ token, user });
    global.apiMocks.mockAuthValidate({ valid: true, user });
    
    localStorage.setItem('auth_token', token);
    return token;
  }
};

// Setup hooks
beforeAll(async () => {
  await global.testDb.connect();
  await global.testDb.migrate();
});

beforeEach(async () => {
  await global.testUtils.cleanupTestData();
  global.apiMocks.reset();
  localStorageMock.clear.mockReset();
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
});

afterAll(async () => {
  await global.testDb.disconnect();
});

// Set Jest timeout
jest.setTimeout(30000);
