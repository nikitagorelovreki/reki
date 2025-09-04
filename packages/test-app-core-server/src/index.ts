// Core Server Test Package Exports
export { TestDatabase } from './utils/test-database';
export { TestHttpMocks } from './utils/test-http-mocks';

// Test utilities
export const testUtils = {
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
    isActive: true,
    ...overrides
  })
};

// Re-export test constants
export const TEST_CONFIG = {
  DATABASE_NAME: 'reki_test',
  API_TIMEOUT: 30000,
  CLEANUP_TIMEOUT: 5000
};
