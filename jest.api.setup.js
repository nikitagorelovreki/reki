// API integration tests setup
const request = require('supertest');

// Global test server instances
global.testServers = {
  coreApp: null,
  authApp: null
};

// Helper to create test server instances
global.createTestApp = async (appType) => {
  if (appType === 'core') {
    const { createApp } = require('./packages/app-core-server/src/main');
    return await createApp();
  } else if (appType === 'auth') {
    const { createApp } = require('./packages/app-auth-server/src/main');
    return await createApp();
  }
  throw new Error(`Unknown app type: ${appType}`);
};

// Request helpers
global.apiRequest = {
  core: (app) => request(app),
  auth: (app) => request(app),
  
  // Helper for authenticated requests
  withAuth: (req, token) => req.set('Authorization', `Bearer ${token}`),
  
  // Helper for JSON requests
  json: (req, data) => req.send(data).set('Content-Type', 'application/json')
};

beforeAll(async () => {
  // Setup test database
  const db = global.getTestDb();
  await db.migrate.latest();
});

beforeEach(async () => {
  // Clean test data
  const db = global.getTestDb();
  await global.testUtils.cleanupTestData(db);
});

afterAll(async () => {
  // Close server instances
  if (global.testServers.coreApp) {
    await global.testServers.coreApp.close();
  }
  if (global.testServers.authApp) {
    await global.testServers.authApp.close();
  }
});
