/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/packages/.*/node_modules/',
    '<rootDir>/packages/.*/dist/',
    '<rootDir>/packages/.*/build/',
  ],
  moduleNameMapping: {
    '^@reki/(.*)$': '<rootDir>/packages/$1/src',
  },
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/index.ts',
    '!packages/**/__tests__/**',
    '!packages/**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,

  // Different configurations for different test types
  projects: [
    {
      displayName: 'backend-functional',
      testMatch: ['<rootDir>/packages/*/tests/functional/**/*.test.ts'],
      setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js',
        '<rootDir>/jest.backend.setup.js',
      ],
      testEnvironment: 'node',
    },
    {
      displayName: 'api-integration',
      testMatch: ['<rootDir>/packages/*/tests/api/**/*.test.ts'],
      setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js',
        '<rootDir>/jest.api.setup.js',
      ],
      testEnvironment: 'node',
    },
    {
      displayName: 'ui-functional',
      testMatch: [
        '<rootDir>/packages/app-control-panel/tests/ui/**/*.test.tsx',
      ],
      setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js',
        '<rootDir>/jest.ui.setup.js',
      ],
      testEnvironment: 'jsdom',
    },
  ],
};
