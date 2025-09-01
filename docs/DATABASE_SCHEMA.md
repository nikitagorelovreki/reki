# Database Schema Reference

## Overview

CUIS uses PostgreSQL as the primary database with Knex.js as the query builder. The database follows a normalized relational structure with JSON fields for flexible data storage where appropriate.

## Connection Configuration

Database connection is configured through environment variables:

```typescript
{
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'cuis',
    password: process.env.POSTGRES_PASSWORD || 'cuis',
    database: process.env.POSTGRES_DB || 'cuis',
  },
  pool: {
    min: 2,
    max: 10,
  }
}
```

## Table Structures

### devices

Primary table for managing medical devices throughout their lifecycle.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique device identifier |
| `serial` | VARCHAR(255) | UNIQUE, NOT NULL | Device serial number |
| `qr_code` | VARCHAR(255) | UNIQUE | QR code for device identification |
| `external_ids` | JSONB | | External system identifiers |
| `model` | VARCHAR(255) | NOT NULL | Device model name |
| `hardware_revision` | VARCHAR(100) | | Hardware revision number |
| `firmware_version` | VARCHAR(100) | | Current firmware version |
| `status` | device_status | NOT NULL, DEFAULT 'REGISTERED' | Current device status |
| `current_location` | VARCHAR(255) | | Physical location of device |
| `clinic_id` | UUID | FOREIGN KEY | Associated clinic |
| `owner_id` | UUID | FOREIGN KEY | Device owner |
| `assigned_patient_id` | UUID | FOREIGN KEY → patients(id) | Currently assigned patient |
| `responsible_user_id` | UUID | FOREIGN KEY | Responsible staff member |
| `warranty_until` | DATE | | Warranty expiration date |
| `purchase_order` | VARCHAR(255) | | Purchase order reference |
| `last_seen_at` | TIMESTAMP | | Last device activity |
| `last_sync_at` | TIMESTAMP | | Last data synchronization |
| `telemetry_endpoint` | VARCHAR(255) | | Device telemetry endpoint |
| `maintenance_notes` | JSONB | | Maintenance history and notes |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_devices_status` ON (`status`)
- `idx_devices_clinic_id` ON (`clinic_id`)
- `idx_devices_assigned_patient_id` ON (`assigned_patient_id`)
- `idx_devices_serial` ON (`serial`)

**Enums:**
```sql
CREATE TYPE device_status AS ENUM (
  'REGISTERED',
  'AT_CLINIC', 
  'AT_PATIENT_HOME',
  'MAINTENANCE',
  'DECOMMISSIONED'
);
```

### patients

Core table for client/patient information management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique patient identifier |
| `full_name` | VARCHAR(255) | NOT NULL | Complete patient name |
| `first_name` | VARCHAR(100) | | Patient first name |
| `last_name` | VARCHAR(100) | | Patient last name |
| `middle_name` | VARCHAR(100) | | Patient middle name |
| `date_of_birth` | DATE | | Patient birth date |
| `primary_diagnosis` | TEXT | | Primary medical diagnosis |
| `contacts` | JSONB | | Contact information (phone, email, address) |
| `status` | client_status | NOT NULL, DEFAULT 'intake' | Current patient status |
| `clinic_id` | UUID | FOREIGN KEY | Associated clinic |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_patients_status` ON (`status`)
- `idx_patients_clinic_id` ON (`clinic_id`)
- `idx_patients_full_name` ON (`full_name`)

**Enums:**
```sql
CREATE TYPE client_status AS ENUM (
  'intake',
  'diagnostics',
  'active_therapy',
  'paused',
  'discharged',
  'followup',
  'archived'
);
```

### form_templates

Stores form definitions and JSON schemas for dynamic form generation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique form template identifier |
| `title` | VARCHAR(255) | NOT NULL | Form title/name |
| `description` | TEXT | | Form description |
| `type` | form_type | NOT NULL | Form category |
| `status` | form_status | NOT NULL, DEFAULT 'draft' | Form publication status |
| `version` | INTEGER | NOT NULL, DEFAULT 1 | Form version number |
| `schema` | JSONB | NOT NULL | JSON schema defining form structure |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |
| `created_by` | UUID | FOREIGN KEY | User who created the form |
| `updated_by` | UUID | FOREIGN KEY | User who last updated the form |

**Indexes:**
- `idx_form_templates_type` ON (`type`)
- `idx_form_templates_status` ON (`status`)
- `idx_form_templates_title_version` ON (`title`, `version`) UNIQUE

**Enums:**
```sql
CREATE TYPE form_type AS ENUM (
  'assessment',
  'survey', 
  'test',
  'lfk',
  'fim'
);

CREATE TYPE form_status AS ENUM (
  'draft',
  'published',
  'archived'
);
```

### form_entries

Stores individual form submissions with flexible JSON data storage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique form entry identifier |
| `form_id` | UUID | FOREIGN KEY → form_templates(id) | Associated form template |
| `patient_id` | UUID | FOREIGN KEY → patients(id) | Associated patient |
| `device_id` | UUID | FOREIGN KEY → devices(id) | Associated device (if applicable) |
| `clinic_id` | UUID | FOREIGN KEY | Associated clinic |
| `status` | form_entry_status | NOT NULL, DEFAULT 'in_progress' | Submission status |
| `data` | JSONB | NOT NULL, DEFAULT '{}' | Form submission data |
| `score` | NUMERIC(5,2) | | Calculated form score (if applicable) |
| `completed_at` | TIMESTAMP | | Form completion timestamp |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |
| `created_by` | UUID | FOREIGN KEY | User who created the entry |
| `updated_by` | UUID | FOREIGN KEY | User who last updated the entry |

**Indexes:**
- `idx_form_entries_form_id` ON (`form_id`)
- `idx_form_entries_patient_id` ON (`patient_id`)
- `idx_form_entries_status` ON (`status`)
- `idx_form_entries_device_id` ON (`device_id`)

**Enums:**
```sql
CREATE TYPE form_entry_status AS ENUM (
  'in_progress',
  'completed',
  'cancelled'
);
```

### form_submissions (Legacy)

Legacy table for Flower Form integration support.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique submission identifier |
| `form_id` | UUID | FOREIGN KEY → form_templates(id) | Associated form template |
| `client_id` | UUID | FOREIGN KEY → patients(id) | Associated client |
| `therapist_id` | UUID | FOREIGN KEY | Associated therapist |
| `therapist_name` | VARCHAR(255) | | Therapist name (for legacy support) |
| `submission_date` | DATE | NOT NULL | Date of form submission |
| `data` | JSONB | NOT NULL | Form submission data |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

## Data Patterns

### JSON Schema Storage

Form templates use JSON Schema to define their structure:

```json
{
  "type": "object",
  "properties": {
    "patient_assessment": {
      "type": "object",
      "properties": {
        "mobility_score": {
          "type": "number",
          "minimum": 1,
          "maximum": 10
        },
        "notes": {
          "type": "string",
          "maxLength": 1000
        }
      }
    }
  },
  "required": ["patient_assessment"]
}
```

### Flexible Data Storage

Form entries store actual submission data as JSON:

```json
{
  "patient_assessment": {
    "mobility_score": 7,
    "notes": "Patient shows improvement in balance",
    "timestamp": "2024-01-15T14:30:00Z"
  },
  "therapist_observations": {
    "coordination": "good",
    "strength": "moderate",
    "pain_level": 3
  }
}
```

### Audit Trail

All tables include audit fields for tracking changes:

- `created_at`: When record was first created
- `updated_at`: When record was last modified
- `created_by`: User who created the record
- `updated_by`: User who last modified the record

## Migration Management

### Running Migrations

```bash
# Install dependencies
npm install

# Run all pending migrations
cd packages/persistence
npx knex migrate:latest

# Check migration status
npx knex migrate:currentVersion
```

### Creating New Migrations

```bash
# Create a new migration file
npx knex migrate:make migration_name

# Migration file template
exports.up = function(knex) {
  return knex.schema.createTable('table_name', table => {
    table.uuid('id').primary();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('table_name');
};
```

## Query Patterns

### Common Query Examples

**Device Queries:**
```typescript
// Find devices by status
const activeDevices = await this.db.knex('devices')
  .where('status', 'AT_CLINIC')
  .orWhere('status', 'AT_PATIENT_HOME');

// Find devices assigned to patient
const patientDevices = await this.db.knex('devices')
  .where('assigned_patient_id', patientId);
```

**Form Queries:**
```typescript
// Get form entries for patient
const patientForms = await this.db.knex('form_entries')
  .where('patient_id', patientId)
  .where('status', 'completed')
  .orderBy('completed_at', 'desc');

// Search form data using JSON operations
const formResults = await this.db.knex('form_entries')
  .whereRaw('data->>? = ?', ['patient_assessment.mobility_score', '7']);
```

## Performance Considerations

### Indexing Strategy

1. **Primary Keys**: All tables use UUID primary keys
2. **Foreign Keys**: Indexed for join performance
3. **Status Fields**: Indexed for filtering operations
4. **JSON Fields**: Use GIN indexes for complex JSON queries

### JSON Query Optimization

```sql
-- Create GIN index for JSON data queries
CREATE INDEX idx_form_entries_data_gin ON form_entries USING GIN (data);

-- Efficient JSON queries
SELECT * FROM form_entries 
WHERE data @> '{"patient_assessment": {"mobility_score": 7}}';
```

### Connection Pooling

- Minimum pool size: 2 connections
- Maximum pool size: 10 connections
- Automatic connection lifecycle management via NestJS

## Backup and Recovery

### Backup Strategy

```bash
# Create database backup
pg_dump -h localhost -U cuis -d cuis > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -h localhost -U cuis -d cuis < backup_file.sql
```

### Data Migration

When adding new fields or changing structures:
1. Create migration scripts in `packages/persistence/database/migrations/`
2. Test migrations on development data
3. Apply migrations in staging environment
4. Deploy to production with rollback plan

This database documentation provides a complete reference for understanding the data storage architecture and working with the database in the CUIS system.