// Auth Server Test Package Exports
export { TestDatabase } from './utils/test-database';
export { TestHttpMocks } from './utils/test-http-mocks';

// Test utilities
export const testUtils = {
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

  generateTestPermission: (overrides = {}) => ({
    name: `test_permission_${Date.now()}`,
    description: 'Test permission description',
    resource: 'test_resource',
    action: 'read',
    ...overrides
  })
};

// Auth test constants
export const AUTH_TEST_CONFIG = {
  DATABASE_NAME: 'reki_test',
  JWT_SECRET: 'test_jwt_secret_key',
  TOKEN_EXPIRY: '1h',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};
