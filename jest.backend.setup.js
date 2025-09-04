// Backend functional tests setup
const knex = require('knex');

// Mock HTTP requests for backend tests
global.mockHttp = {
  // Mock external API calls
  mockExternalAPI: jest.fn(),
  
  // Mock notification services
  mockEmailService: jest.fn(),
  mockSMSService: jest.fn(),
  
  // Mock file upload services
  mockFileStorage: jest.fn(),
  
  // Reset all mocks
  resetMocks: () => {
    global.mockHttp.mockExternalAPI.mockReset();
    global.mockHttp.mockEmailService.mockReset();
    global.mockHttp.mockSMSService.mockReset();
    global.mockHttp.mockFileStorage.mockReset();
  }
};

// Test database connection
let testDb;

global.getTestDb = () => {
  if (!testDb) {
    testDb = knex(global.testUtils.getTestDbConfig());
  }
  return testDb;
};

// Setup and teardown hooks
beforeAll(async () => {
  // Initialize test database connection
  const db = global.getTestDb();
  
  // Run migrations
  await db.migrate.latest();
  
  // Clear existing test data
  await global.testUtils.cleanupTestData(db);
});

beforeEach(async () => {
  // Reset HTTP mocks
  global.mockHttp.resetMocks();
  
  // Clean test data before each test
  const db = global.getTestDb();
  await global.testUtils.cleanupTestData(db);
});

afterAll(async () => {
  // Close database connection
  if (testDb) {
    await testDb.destroy();
  }
});
