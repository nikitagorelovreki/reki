// Control Panel Test Package Exports
export { TestDatabase } from './utils/test-database';
export { TestAPIMocks } from './utils/test-api-mocks';

// Test utilities
export const testUtils = {
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

  mockLogin: async (userData = {}) => {
    const user = testUtils.generateTestUser(userData);
    const token = `mock_token_${Date.now()}`;
    
    // Mock API responses for login flow
    global.apiMocks?.mockAuthLogin({ token, user });
    global.apiMocks?.mockAuthValidate({ valid: true, user });
    
    localStorage.setItem('auth_token', token);
    return { token, user };
  },

  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
};

// UI test constants
export const UI_TEST_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  API_DELAY: 100,
  USER_INTERACTION_DELAY: 50,
  MOCK_API_RESPONSES: {
    SUCCESS_DELAY: 100,
    ERROR_DELAY: 200
  }
};
