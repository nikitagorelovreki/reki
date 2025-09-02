export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../packages'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
  ],
  collectCoverageFrom: [
    '../packages/**/*.ts',
    '!../packages/**/*.d.ts',
    '!../packages/**/__tests__/**',
    '!../packages/**/node_modules/**',
    '!../packages/**/dist/**',
    '!../packages/**/build/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  moduleNameMapper: {
    '^@reki/domain(.*)$': '<rootDir>/../packages/domain/src$1',
    '^@reki/persistence(.*)$': '<rootDir>/../packages/persistence/src$1',
    '^@reki/use-cases(.*)$': '<rootDir>/../packages/use-cases/src$1',
    '^@reki/api(.*)$': '<rootDir>/../packages/api/src$1',
    '^@reki/frontend(.*)$': '<rootDir>/../packages/frontend/src$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'config/tsconfig.test.json',
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(dotenv)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
