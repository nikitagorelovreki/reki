# Test Cases Documentation - Reki Control Panel

## Test Pyramid Overview

```
    E2E Tests (Integration)
   ┌─────────────────────┐
   │ Integration Tests    │ ← Full system workflows
   │                     │
   ├─────────────────────┤
   │ API Tests           │ ← Backend functionality
   │                     │
   ├─────────────────────┤
   │ Unit Tests          │ ← Frontend components
   │                     │
   └─────────────────────┘
```

## 1. Unit Tests (Frontend Components)

### 1.1 FormsPage Component Tests

**File:** `packages/frontend/__tests__/FormsPage.test.tsx`

#### Display and Rendering

- **TC-FP-001**: Display list of form entries with patient names and form titles
- **TC-FP-002**: Show empty state when no form entries exist
- **TC-FP-003**: Display pagination controls when multiple entries exist
- **TC-FP-004**: Show correct entry count and page information

#### Filtering and Search

- **TC-FP-005**: Filter entries by status (completed, in_progress, draft)
- **TC-FP-006**: Search entries by patient name or form title
- **TC-FP-007**: Apply multiple filters simultaneously
- **TC-FP-008**: Clear filters and reset to default state

#### Pagination

- **TC-FP-009**: Navigate between pages with correct data loading
- **TC-FP-010**: Change page size and verify data refresh
- **TC-FP-011**: Display correct page numbers and navigation controls
- **TC-FP-012**: Handle edge cases (first page, last page, empty pages)

#### User Actions

- **TC-FP-013**: Open chart modal when clicking chart button
- **TC-FP-014**: Delete entry with confirmation dialog
- **TC-FP-015**: Cancel deletion operation
- **TC-FP-016**: Refresh data after successful operations

#### Data Processing

- **TC-FP-017**: Generate chart data from FIM form entries with Before/After scores
- **TC-FP-018**: Handle form entries without numeric data (checkbox-based)
- **TC-FP-019**: Process different form types (LFK, FIM, custom)
- **TC-FP-020**: Map form schema fields to chart data correctly

#### Error Handling

- **TC-FP-021**: Display error message when API calls fail
- **TC-FP-022**: Show loading states during data fetching
- **TC-FP-023**: Handle network timeouts gracefully
- **TC-FP-024**: Retry failed operations with user feedback

### 1.2 RadarChart Component Tests

**File:** `packages/frontend/__tests__/RadarChart.test.tsx`

#### Chart Rendering

- **TC-RC-001**: Display chart with provided data and title
- **TC-RC-002**: Show empty state when no data is provided
- **TC-RC-003**: Handle null or undefined data gracefully
- **TC-RC-004**: Apply custom height and styling

#### Data Format Handling

- **TC-RC-005**: Process Chart.js format data (labels + datasets)
- **TC-RC-006**: Handle array of objects format (name/value pairs)
- **TC-RC-007**: Convert between different data formats
- **TC-RC-008**: Validate data structure before rendering

#### Chart Configuration

- **TC-RC-009**: Apply medical system styling (colors, fonts, spacing)
- **TC-RC-010**: Configure radial scale (0-7 range, step size)
- **TC-RC-011**: Set up legend with proper positioning and styling
- **TC-RC-012**: Configure tooltips with Russian labels

#### Chart.js Integration

- **TC-RC-013**: Register required Chart.js components (RadialLinearScale, etc.)
- **TC-RC-014**: Apply responsive design settings
- **TC-RC-015**: Configure point and line styling
- **TC-RC-016**: Set up axis labels with truncation for long text

#### Error States

- **TC-RC-017**: Handle empty datasets gracefully
- **TC-RC-018**: Display error message for invalid data
- **TC-RC-019**: Fallback to empty state on chart errors
- **TC-RC-020**: Maintain component stability during data changes

## 2. API Tests (Backend Functionality)

### 2.1 Clients API Tests

**File:** `packages/api-server/__tests__/clients.test.ts`

#### GET /api/clients

- **TC-CL-001**: Return empty list when no clients exist
- **TC-CL-002**: Return paginated list with correct metadata
- **TC-CL-003**: Filter clients by status (active_therapy, intake, discharged)
- **TC-CL-004**: Search clients by name, email, or phone
- **TC-CL-005**: Sort clients by creation date, name, or status
- **TC-CL-006**: Handle invalid pagination parameters

#### POST /api/clients

- **TC-CL-007**: Create new client with valid data
- **TC-CL-008**: Validate required fields (firstName, lastName, email)
- **TC-CL-009**: Check email uniqueness constraint
- **TC-CL-010**: Handle invalid date formats
- **TC-CL-011**: Validate phone number format
- **TC-CL-012**: Generate fullName from firstName, lastName, middleName

#### GET /api/clients/:id

- **TC-CL-013**: Return client by ID with all fields
- **TC-CL-014**: Return 404 for non-existent client ID
- **TC-CL-015**: Handle invalid UUID format
- **TC-CL-016**: Include related data (form entries, devices)

#### PUT /api/clients/:id

- **TC-CL-017**: Update client information successfully
- **TC-CL-018**: Validate updated data in database
- **TC-CL-019**: Return 404 for non-existent client
- **TC-CL-020**: Handle partial updates (only some fields)
- **TC-CL-021**: Maintain data integrity during updates

#### DELETE /api/clients/:id

- **TC-CL-022**: Delete client successfully
- **TC-CL-023**: Verify client is removed from database
- **TC-CL-024**: Return 404 for non-existent client
- **TC-CL-025**: Handle cascade deletion of related records

### 2.2 Devices API Tests

**File:** `packages/api-server/__tests__/devices.test.ts`

#### GET /api/devices

- **TC-DV-001**: Return empty list when no devices exist
- **TC-DV-002**: Return paginated list with device information
- **TC-DV-003**: Filter devices by status (IN_STOCK, AT_CLINIC, MAINTENANCE)
- **TC-DV-004**: Search devices by serial number or model
- **TC-DV-005**: Sort devices by last seen date or status
- **TC-DV-006**: Include maintenance notes and history

#### POST /api/devices

- **TC-DV-007**: Create new device with valid data
- **TC-DV-008**: Validate required fields (serial, model)
- **TC-DV-009**: Check serial number uniqueness
- **TC-DV-010**: Set default status to IN_STOCK
- **TC-DV-011**: Handle maintenance notes as JSON
- **TC-DV-012**: Validate serial number format

#### GET /api/devices/:id

- **TC-DV-013**: Return device by ID with full details
- **TC-DV-014**: Return 404 for non-existent device
- **TC-DV-015**: Include usage history and assignments
- **TC-DV-016**: Handle maintenance notes parsing

#### PUT /api/devices/:id

- **TC-DV-017**: Update device information
- **TC-DV-018**: Update maintenance notes
- **TC-DV-019**: Validate changes in database
- **TC-DV-020**: Handle status transitions

#### PATCH /api/devices/:id/status

- **TC-DV-021**: Update device status successfully
- **TC-DV-022**: Validate status transitions (IN_STOCK → AT_CLINIC)
- **TC-DV-023**: Reject invalid status values
- **TC-DV-024**: Update lastSeenAt timestamp
- **TC-DV-025**: Log status change history

#### DELETE /api/devices/:id

- **TC-DV-026**: Delete device successfully
- **TC-DV-027**: Verify device removal from database
- **TC-DV-028**: Handle devices assigned to clients

### 2.3 Forms API Tests

**File:** `packages/api-server/__tests__/forms.test.ts`

#### Form Templates

##### GET /api/forms

- **TC-FT-001**: Return empty list when no forms exist
- **TC-FT-002**: Return paginated list of form templates
- **TC-FT-003**: Filter forms by type (lfk, fim, custom)
- **TC-FT-004**: Filter forms by status (active, draft, archived)
- **TC-FT-005**: Search forms by title or description
- **TC-FT-006**: Include schema information in response

##### POST /api/forms

- **TC-FT-007**: Create new form template with valid schema
- **TC-FT-008**: Validate required fields (title, type, schema)
- **TC-FT-009**: Validate schema structure (sections, fields)
- **TC-FT-010**: Set version to 1 for new forms
- **TC-FT-011**: Handle complex field types (rating, checkbox-group)
- **TC-FT-012**: Validate field names and labels

##### GET /api/forms/:id

- **TC-FT-013**: Return form template by ID
- **TC-FT-014**: Return 404 for non-existent form
- **TC-FT-015**: Include full schema in response
- **TC-FT-016**: Handle schema versioning

#### Form Entries

##### GET /api/form-entries

- **TC-FE-001**: Return empty list when no entries exist
- **TC-FE-002**: Return paginated list with related data
- **TC-FE-003**: Filter entries by status (completed, in_progress, draft)
- **TC-FE-004**: Filter entries by patient ID
- **TC-FE-005**: Filter entries by form template ID
- **TC-FE-006**: Include patient and form information
- **TC-FE-007**: Sort entries by completion date

##### POST /api/form-entries

- **TC-FE-008**: Create new form entry with valid data
- **TC-FE-009**: Validate required fields (formId, patientId, data)
- **TC-FE-010**: Check form template and patient existence
- **TC-FE-011**: Validate data against form schema
- **TC-FE-012**: Handle different data types (numbers, strings, arrays)
- **TC-FE-013**: Set completion timestamp for completed entries
- **TC-FE-014**: Calculate and store entry score

##### GET /api/form-entries/:id

- **TC-FE-015**: Return form entry by ID with full details
- **TC-FE-016**: Include related patient and form data
- **TC-FE-017**: Return 404 for non-existent entry
- **TC-FE-018**: Parse and validate stored data

##### PUT /api/form-entries/:id

- **TC-FE-019**: Update form entry data
- **TC-FE-020**: Validate updated data against schema
- **TC-FE-021**: Update completion status and timestamp
- **TC-FE-022**: Recalculate entry score
- **TC-FE-023**: Maintain data integrity

##### DELETE /api/form-entries/:id

- **TC-FE-024**: Delete form entry successfully
- **TC-FE-025**: Verify entry removal from database
- **TC-FE-026**: Handle related data cleanup

## 3. Integration Tests (End-to-End Workflows)

### 3.1 Patient Registration and FIM Assessment

**File:** `packages/api-server/__tests__/integration.test.ts`

#### Complete Patient Workflow

- **TC-INT-001**: Register new patient with complete information
- **TC-INT-002**: Create FIM form template with Before/After fields
- **TC-INT-003**: Fill FIM assessment with admission scores
- **TC-INT-004**: Update FIM assessment with discharge scores
- **TC-INT-005**: Generate progress report from Before/After data
- **TC-INT-006**: Link patient to assigned devices
- **TC-INT-007**: Track patient through therapy stages

#### Data Validation and Relationships

- **TC-INT-008**: Verify patient-form-entry relationships
- **TC-INT-009**: Validate FIM data structure (Before/After scores)
- **TC-INT-010**: Check data consistency across related entities
- **TC-INT-011**: Ensure referential integrity in database
- **TC-INT-012**: Handle concurrent updates to patient data

### 3.2 Device Management Workflow

**File:** `packages/api-server/__tests__/integration.test.ts`

#### Device Lifecycle Management

- **TC-INT-013**: Register new device in inventory
- **TC-INT-014**: Assign device to patient for therapy
- **TC-INT-015**: Track device usage and maintenance
- **TC-INT-016**: Update device status based on usage
- **TC-INT-017**: Generate device utilization reports
- **TC-INT-018**: Handle device maintenance scheduling

#### Device-Patient Relationships

- **TC-INT-019**: Link devices to patient therapy sessions
- **TC-INT-020**: Track device assignment history
- **TC-INT-021**: Handle device transfers between patients
- **TC-INT-022**: Maintain device-patient relationship integrity

### 3.3 Analytics and Reporting

**File:** `packages/api-server/__tests__/integration.test.ts`

#### System Statistics

- **TC-INT-023**: Generate patient statistics by status
- **TC-INT-024**: Calculate device utilization metrics
- **TC-INT-025**: Track form completion rates
- **TC-INT-026**: Generate therapy progress reports
- **TC-INT-027**: Calculate average therapy duration

#### Data Aggregation

- **TC-INT-028**: Aggregate FIM scores across patients
- **TC-INT-029**: Calculate improvement rates (Before vs After)
- **TC-INT-030**: Generate trend analysis reports
- **TC-INT-031**: Handle large dataset processing

### 3.4 Error Handling and Edge Cases

**File:** `packages/api-server/__tests__/integration.test.ts`

#### System Resilience

- **TC-INT-032**: Handle database connection failures
- **TC-INT-033**: Recover from partial transaction failures
- **TC-INT-034**: Handle concurrent user operations
- **TC-INT-035**: Validate data consistency after errors
- **TC-INT-036**: Test system recovery procedures

#### Data Integrity

- **TC-INT-037**: Prevent orphaned records
- **TC-INT-038**: Maintain audit trails
- **TC-INT-039**: Handle data migration scenarios
- **TC-INT-040**: Validate backup and restore procedures

### 3.5 Performance and Scalability

**File:** `packages/api-server/__tests__/integration.test.ts`

#### Load Testing

- **TC-INT-041**: Handle multiple concurrent patients
- **TC-INT-042**: Process large form datasets
- **TC-INT-043**: Manage device inventory at scale
- **TC-INT-044**: Generate reports for large datasets
- **TC-INT-045**: Test pagination with large result sets

## 4. Database Seeding Tests

### 4.1 Seed Data Validation

**File:** `packages/api-server/__tests__/seed.test.ts`

#### Data Creation

- **TC-SD-001**: Create clients with valid data structure
- **TC-SD-002**: Create devices with unique serial numbers
- **TC-SD-003**: Create form templates with valid schemas
- **TC-SD-004**: Create form entries with realistic data
- **TC-SD-005**: Establish proper relationships between entities

#### Data Quality

- **TC-SD-006**: Validate FIM form structure (Before/After fields)
- **TC-SD-007**: Ensure data uniqueness constraints
- **TC-SD-008**: Verify data format consistency
- **TC-SD-009**: Check referential integrity
- **TC-SD-010**: Validate data ranges and constraints

#### Seeding Process

- **TC-SD-011**: Test idempotent seeding (multiple runs)
- **TC-SD-012**: Verify data cleanup before seeding
- **TC-SD-013**: Handle seeding errors gracefully
- **TC-SD-014**: Maintain data consistency across runs
- **TC-SD-015**: Test seeding with different configurations

## Test Execution Matrix

### Frontend Unit Tests

| Test Case              | Component  | Priority | Coverage           |
| ---------------------- | ---------- | -------- | ------------------ |
| TC-FP-001 to TC-FP-024 | FormsPage  | High     | User Interface     |
| TC-RC-001 to TC-RC-020 | RadarChart | High     | Data Visualization |

### Backend API Tests

| Test Case              | Endpoint          | Priority | Coverage          |
| ---------------------- | ----------------- | -------- | ----------------- |
| TC-CL-001 to TC-CL-025 | /api/clients      | High     | CRUD Operations   |
| TC-DV-001 to TC-DV-028 | /api/devices      | High     | Device Management |
| TC-FT-001 to TC-FT-016 | /api/forms        | High     | Form Templates    |
| TC-FE-001 to TC-FE-026 | /api/form-entries | High     | Form Data         |

### Integration Tests

| Test Case                | Workflow          | Priority | Coverage           |
| ------------------------ | ----------------- | -------- | ------------------ |
| TC-INT-001 to TC-INT-012 | Patient Workflow  | Critical | End-to-End         |
| TC-INT-013 to TC-INT-022 | Device Workflow   | High     | System Integration |
| TC-INT-023 to TC-INT-031 | Analytics         | Medium   | Business Logic     |
| TC-INT-032 to TC-INT-045 | System Resilience | High     | Reliability        |

### Database Tests

| Test Case              | Function     | Priority | Coverage       |
| ---------------------- | ------------ | -------- | -------------- |
| TC-SD-001 to TC-SD-015 | Data Seeding | Medium   | Data Integrity |

## Test Environment Requirements

### Database

- PostgreSQL test database (`reki_test`)
- Clean state before each test
- Proper isolation between tests

### API Server

- Running on test port (3002)
- Test configuration
- Mock external dependencies

### Frontend

- Test React environment
- Mock API calls
- Isolated component testing

## Success Criteria

### Unit Tests

- 90%+ code coverage for components
- All user interactions tested
- Error states handled
- Edge cases covered

### API Tests

- 100% endpoint coverage
- All HTTP status codes tested
- Validation logic verified
- Database state validated

### Integration Tests

- Complete workflow coverage
- Data consistency verified
- Performance benchmarks met
- Error recovery tested

### Database Tests

- Data integrity maintained
- Seeding process reliable
- Relationships preserved
- Constraints enforced
