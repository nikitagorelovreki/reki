# Test Map - Quick Reference

## 🏗️ Test Pyramid Structure

```
┌─────────────────────────────────────┐
│           INTEGRATION              │ ← Full workflows (45 test cases)
│        End-to-End Scenarios        │
├─────────────────────────────────────┤
│              API TESTS             │ ← Backend endpoints (79 test cases)
│         CRUD + Business Logic      │
├─────────────────────────────────────┤
│            UNIT TESTS              │ ← Frontend components (44 test cases)
│      Components + User Interface  │
└─────────────────────────────────────┘
```

## 📋 Test Files Overview

### Frontend Unit Tests

| File                  | Component       | Test Cases             | Coverage                            |
| --------------------- | --------------- | ---------------------- | ----------------------------------- |
| `FormsPage.test.tsx`  | Forms List Page | TC-FP-001 to TC-FP-024 | UI, Data Processing, Error Handling |
| `RadarChart.test.tsx` | Chart Component | TC-RC-001 to TC-RC-020 | Visualization, Chart.js Integration |

### Backend API Tests

| File              | API Module        | Test Cases                                      | Coverage                             |
| ----------------- | ----------------- | ----------------------------------------------- | ------------------------------------ |
| `clients.test.ts` | Client Management | TC-CL-001 to TC-CL-025                          | CRUD, Validation, Relationships      |
| `devices.test.ts` | Device Management | TC-DV-001 to TC-DV-028                          | Lifecycle, Status Changes, Inventory |
| `forms.test.ts`   | Forms & Entries   | TC-FT-001 to TC-FT-016 + TC-FE-001 to TC-FE-026 | Templates, Data Entry, Validation    |

### Integration Tests

| File                  | Workflow        | Test Cases               | Coverage                                |
| --------------------- | --------------- | ------------------------ | --------------------------------------- |
| `integration.test.ts` | Complete System | TC-INT-001 to TC-INT-045 | E2E, Analytics, Performance, Resilience |
| `seed.test.ts`        | Data Seeding    | TC-SD-001 to TC-SD-015   | Data Quality, Integrity, Process        |

## 🎯 Key Test Scenarios

### Critical Business Workflows

1. **Patient Registration → FIM Assessment → Progress Tracking** (TC-INT-001 to TC-INT-012)
2. **Device Lifecycle: Inventory → Assignment → Maintenance** (TC-INT-013 to TC-INT-022)
3. **Form Data Processing: Before/After Comparison** (TC-FP-017, TC-INT-028 to TC-INT-031)

### Data Integrity & Validation

1. **FIM Form Structure with Before/After Fields** (TC-SD-006, TC-FT-009)
2. **Referential Integrity Across Entities** (TC-INT-008 to TC-INT-011)
3. **Unique Constraints & Data Validation** (TC-CL-009, TC-DV-009)

### User Experience & Interface

1. **Form Entry Management with Filtering** (TC-FP-005 to TC-FP-008)
2. **Chart Visualization of Progress** (TC-RC-009 to TC-RC-012)
3. **Error Handling & User Feedback** (TC-FP-021 to TC-FP-024)

### System Reliability

1. **Error Recovery & Resilience** (TC-INT-032 to TC-INT-036)
2. **Concurrent Operations** (TC-INT-034, TC-INT-041 to TC-INT-045)
3. **Data Consistency** (TC-INT-037 to TC-INT-040)

## 🚀 Quick Test Commands

```bash
# Run all tests
npm test

# Run by category
npm run test:api          # Backend API tests
npm run test:integration  # E2E workflows
npm run test:seed         # Database seeding

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- FormsPage.test.tsx
npm test -- clients.test.ts
npm test -- integration.test.ts
```

## 📊 Test Coverage Goals

| Layer                 | Target Coverage | Focus Areas                           |
| --------------------- | --------------- | ------------------------------------- |
| **Unit Tests**        | 90%+            | Component logic, user interactions    |
| **API Tests**         | 100%            | Endpoints, validation, database state |
| **Integration Tests** | 100%            | Workflows, data consistency           |
| **Database Tests**    | 100%            | Data integrity, relationships         |

## 🔍 Test Case Categories

### High Priority (Critical Path)

- Patient registration and therapy tracking
- FIM assessment with Before/After data
- Device assignment and status management
- Form data validation and processing

### Medium Priority (Business Logic)

- Analytics and reporting
- Search and filtering functionality
- Pagination and data management
- Error handling and recovery

### Low Priority (Edge Cases)

- Performance under load
- Data migration scenarios
- Complex validation rules
- System recovery procedures

## 📝 Test Naming Convention

```
TC-[Category]-[Number]: [Description]

Examples:
TC-FP-001: Display list of form entries with patient names
TC-CL-007: Create new client with valid data
TC-INT-001: Register new patient with complete information
TC-SD-006: Validate FIM form structure (Before/After fields)
```

## 🎪 Test Environment Setup

### Required Setup

1. **Database**: `createdb reki_test`
2. **Environment**: `.env.test` with test configuration
3. **Dependencies**: `npm install` (includes test packages)

### Test Isolation

- Each test cleans up its data
- Separate test database
- Mocked external dependencies
- Isolated component testing

## 📈 Success Metrics

### Quality Gates

- ✅ All critical workflows pass
- ✅ 100% API endpoint coverage
- ✅ 90%+ component coverage
- ✅ Data integrity maintained
- ✅ Error scenarios handled

### Performance Benchmarks

- ⚡ API response time < 200ms
- ⚡ Chart rendering < 1s
- ⚡ Database operations < 100ms
- ⚡ Concurrent user support > 10
