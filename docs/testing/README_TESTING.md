# 🧪 Testing Suite - Reki Control Panel

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test categories
npm run test:api          # Backend API tests
npm run test:integration  # E2E workflows
npm run test:seed         # Database seeding

# Run with coverage report
npm run test:coverage
```

## 📚 Documentation

- **[TEST_CASES.md](docs/TEST_CASES.md)** - Detailed test case descriptions (168 test cases)
- **[TEST_MAP.md](docs/TEST_MAP.md)** - Quick reference and test pyramid overview
- **[TESTING.md](docs/TESTING.md)** - Complete testing guide and setup instructions

## 🏗️ Test Structure

```
┌─────────────────────────────────────┐
│           INTEGRATION              │ ← 45 test cases
│        End-to-End Scenarios        │
├─────────────────────────────────────┤
│              API TESTS             │ ← 79 test cases
│         CRUD + Business Logic      │
├─────────────────────────────────────┤
│            UNIT TESTS              │ ← 44 test cases
│      Components + User Interface  │
└─────────────────────────────────────┘
```

## 🎯 Key Test Scenarios

### Critical Business Workflows

- **Patient Registration → FIM Assessment → Progress Tracking**
- **Device Lifecycle: Inventory → Assignment → Maintenance**
- **Form Data Processing: Before/After Comparison**

### Data Integrity & Validation

- **FIM Form Structure with Before/After Fields**
- **Referential Integrity Across Entities**
- **Unique Constraints & Data Validation**

## 📊 Coverage Goals

| Layer                 | Target | Focus                  |
| --------------------- | ------ | ---------------------- |
| **Unit Tests**        | 90%+   | Component logic, UI    |
| **API Tests**         | 100%   | Endpoints, validation  |
| **Integration Tests** | 100%   | Workflows, consistency |
| **Database Tests**    | 100%   | Data integrity         |

## 🚀 Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- FormsPage.test.tsx
npm test -- clients.test.ts
npm test -- integration.test.ts

# Run in watch mode
npm run test:watch
```

## 🎪 Environment Setup

1. **Database**: `createdb reki_test`
2. **Environment**: Create `.env.test` with test config
3. **Dependencies**: `npm install` (includes test packages)

## 📈 Success Metrics

- ✅ All critical workflows pass
- ✅ 100% API endpoint coverage
- ✅ 90%+ component coverage
- ✅ Data integrity maintained
- ✅ Error scenarios handled

---

**Total Test Cases: 168** | **Coverage Target: 95%+** | **Test Types: 4**
