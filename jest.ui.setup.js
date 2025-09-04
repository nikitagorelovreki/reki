// UI functional tests setup
require('@testing-library/jest-dom');
const { configure } = require('@testing-library/react');

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

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

// Mock API endpoints for UI tests
global.mockAPI = {
  // Core API mocks
  clients: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  devices: {
    getAll: jest.fn(),
    getById: jest.fn(), 
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  forms: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    submitForm: jest.fn()
  },
  
  // Auth API mocks
  auth: {
    login: jest.fn(),
    logout: jest.fn(),
    validate: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn()
  },
  
  // Reset all mocks
  resetMocks: () => {
    Object.keys(global.mockAPI).forEach(key => {
      if (typeof global.mockAPI[key] === 'object' && global.mockAPI[key] !== null) {
        Object.keys(global.mockAPI[key]).forEach(method => {
          if (typeof global.mockAPI[key][method] === 'function') {
            global.mockAPI[key][method].mockReset();
          }
        });
      }
    });
  }
};

// Mock Ant Design message component
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    },
    notification: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    }
  };
});

// Reset mocks before each test
beforeEach(() => {
  global.mockAPI.resetMocks();
  localStorageMock.clear.mockReset();
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
});
