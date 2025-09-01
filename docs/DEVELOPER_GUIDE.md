# CUIS Developer Guide

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [System Schemas](#system-schemas)
4. [Package Documentation](#package-documentation)
5. [Components](#components)
6. [Data Storage](#data-storage)
7. [Creating New Packages](#creating-new-packages)
8. [Development Guidelines](#development-guidelines)

## Overview

CUIS (Cosyma Unified Info-System) is a comprehensive modular system designed for managing medical devices, clients (patients), and service requests in healthcare environments. The system follows Domain-Driven Design (DDD) principles and Clean Architecture patterns to ensure maintainability, testability, and scalability.

### Key Features

- **Device Management**: Complete lifecycle management of medical devices
- **Client Management**: Patient information and status tracking
- **Assessment System**: Digital forms and examinations (LFK, FIM)
- **Form Integration**: Seamless integration with Flower Form system
- **API-First Design**: RESTful API with comprehensive documentation
- **Modern Frontend**: React-based user interface

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Backend Framework**: NestJS
- **Database**: PostgreSQL with Knex.js query builder
- **Frontend**: React with Vite
- **Monorepo Management**: Turborepo
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Containerization**: Docker & Docker Compose

## High-Level Architecture

CUIS follows a layered architecture based on Clean Architecture principles:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌─────────────────┐           ┌─────────────────────────┐  │
│  │   Frontend      │           │      API Layer         │  │
│  │   (React)       │ ◄────────► │    (NestJS/REST)       │  │
│  └─────────────────┘           └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Use Cases                             │ │
│  │   (Business Logic & Services)                           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          Domain Models & Business Rules                 │ │
│  │         (Entities, Value Objects, Ports)                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Persistence & External Services               │ │
│  │        (Repositories, Database, External APIs)          │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Flow

- **Domain Layer**: Contains pure business logic, no dependencies on external frameworks
- **Application Layer**: Orchestrates domain objects and implements use cases
- **Infrastructure Layer**: Implements interfaces defined in domain layer
- **Presentation Layer**: Handles user interface and API interactions

## System Schemas

### Core Domain Entities

```typescript
// Device Entity
export class Device {
  id: string;
  serial: string;
  qrCode?: string;
  model: string;
  status: DeviceStatus; // REGISTERED, AT_CLINIC, AT_PATIENT_HOME, etc.
  currentLocation?: string;
  assignedPatientId?: string;
  // ... additional fields
}

// Client/Patient Entity  
export class Client {
  id: string;
  fullName: string;
  status: ClientStatus; // INTAKE, DIAGNOSTICS, ACTIVE_THERAPY, etc.
  diagnosis?: string;
  contacts?: Record<string, any>;
  // ... additional fields
}

// Form Template Entity
export class FormModel {
  id: string;
  title: string;
  type: FormType; // ASSESSMENT, SURVEY, TEST, LFK, FIM
  status: FormStatus; // DRAFT, PUBLISHED, ARCHIVED
  schema: Record<string, any>; // JSON schema for form structure
  version: number;
  // ... additional fields
}

// Form Entry/Submission Entity
export class FormEntryModel {
  id: string;
  formId: string;
  patientId?: string;
  deviceId?: string;
  status: FormEntryStatus; // IN_PROGRESS, COMPLETED, CANCELLED
  data: Record<string, any>; // Form submission data as JSON
  score?: number;
  // ... additional fields
}
```

### Database Schema Overview

The system uses PostgreSQL with the following main tables:

- `devices` - Medical device registry
- `patients` - Client/patient information (mapped to Client entity)
- `form_templates` - Form definitions and schemas
- `form_entries` - Form submissions and data
- `form_submissions` - Legacy form submissions (Flower Form integration)

## Package Documentation

### @cuis/domain

**Purpose**: Contains pure business logic, domain entities, and port interfaces.

**Structure**:
```
packages/domain/src/
├── models/           # Domain entities and business objects
│   ├── client.model.ts      # Client/Patient entity
│   ├── device.model.ts      # Medical device entity
│   ├── form.model.ts        # Form template entity
│   ├── form-entry.model.ts  # Form submission entity
│   └── examination.model.ts # Examination form specifics
├── ports/            # Interface definitions for external dependencies
│   ├── client-repository.port.ts
│   ├── device-repository.port.ts
│   └── form-repository.port.ts
├── tokens.ts         # Dependency injection tokens
└── index.ts          # Package exports
```

**Key Responsibilities**:
- Define business entities and rules
- Provide interfaces (ports) for external dependencies
- Maintain data integrity through domain validation
- Implement business operations on entities

**Dependencies**: None (pure TypeScript)

### @cuis/persistence

**Purpose**: Implements data persistence using PostgreSQL and provides repository implementations.

**Structure**:
```
packages/persistence/src/
├── database/         # Database connection and configuration
│   ├── database.service.ts  # Knex.js database service
│   └── migrations/          # Database schema migrations
├── repositories/     # Repository implementations
│   ├── client.repository.ts      # Client data access
│   ├── device.repository.ts      # Device data access
│   ├── form.repository.ts        # Form template data access
│   ├── form-entry.repository.ts  # Form entry data access
│   └── form-submission.repository.ts # Legacy form submission access
├── utils/            # Utility functions
│   └── case-converter.ts     # camelCase ↔ snake_case conversion
└── persistence.module.ts     # NestJS module configuration
```

**Key Responsibilities**:
- Implement repository patterns defined in domain ports
- Handle database connections and transactions
- Manage data mapping between domain objects and database records
- Provide database migration scripts

**Dependencies**: 
- `@cuis/domain` for interfaces and entities
- `knex` for SQL query building
- `pg` for PostgreSQL connectivity

### @cuis/use-cases

**Purpose**: Contains application business logic and orchestrates domain entities.

**Structure**:
```
packages/use-cases/src/
├── services/         # Application services
│   ├── client.service.ts     # Client management business logic
│   ├── device.service.ts     # Device management business logic  
│   ├── form.service.ts       # Form template management
│   └── form-entry.service.ts # Form submission management
├── application.module.ts     # Legacy module
└── use-cases.module.ts       # NestJS module configuration
```

**Key Responsibilities**:
- Implement business use cases and workflows
- Coordinate between multiple domain entities
- Handle transaction boundaries
- Provide service interfaces for API layer

**Dependencies**:
- `@cuis/domain` for entities and ports
- Repository implementations (injected via DI)

### @cuis/api

**Purpose**: Provides RESTful API endpoints and handles HTTP requests/responses.

**Structure**:
```
packages/api/src/
├── devices/          # Device management endpoints
│   ├── devices.controller.ts # Device CRUD operations
│   └── dto/                  # Data Transfer Objects
├── forms/            # Form management endpoints
│   ├── forms.controller.ts           # Form template operations
│   ├── form-entries.controller.ts    # Form submission operations
│   ├── form-submissions.controller.ts # Legacy form integration
│   ├── dto/                          # DTOs for forms
│   └── seed/                         # Default form templates
├── common/           # Shared API utilities
│   ├── dto-converter.ts # DTO transformation utilities
│   └── pagination.dto.ts # Pagination DTOs
└── api.module.ts     # NestJS module configuration
```

**Key Responsibilities**:
- Handle HTTP requests and responses
- Validate input data using DTOs
- Transform data between API and domain formats
- Provide Swagger/OpenAPI documentation

**Dependencies**:
- `@cuis/use-cases` for business logic
- `@cuis/domain` for type definitions

### @cuis/frontend

**Purpose**: React-based user interface for the CUIS system.

**Structure**:
```
packages/frontend/src/
├── components/       # Reusable UI components
│   ├── Layout/              # Application layout components
│   ├── Forms/               # Form-related components
│   └── Common/              # Generic UI components
├── pages/            # Application pages/routes
│   ├── DevicesPage/         # Device management interface
│   ├── ClientsPage/         # Client management interface
│   └── FormsPage/           # Form and submission management
├── api/              # API client implementations
│   ├── devices.ts           # Device API client
│   ├── clients.ts           # Client API client
│   └── forms.ts             # Form API client
├── types/            # TypeScript type definitions
└── assets/           # Static assets (images, icons)
```

**Key Responsibilities**:
- Provide user interface for system functionality
- Handle user interactions and state management
- Communicate with backend API
- Display data in user-friendly formats

**Dependencies**:
- React and related UI libraries
- API client libraries for backend communication

## Components

### Backend Components

#### Domain Models
Core business entities that represent the system's fundamental concepts:

- **Device**: Represents medical devices with lifecycle management
- **Client**: Represents patients with status tracking
- **Form**: Template definitions for assessments and forms
- **FormEntry**: Individual form submissions with data and scoring

#### Repository Pattern
Each domain entity has a corresponding repository that handles data persistence:

- **DeviceRepository**: CRUD operations for devices
- **ClientRepository**: CRUD operations for clients  
- **FormRepository**: CRUD operations for form templates
- **FormEntryRepository**: CRUD operations for form submissions

#### Services (Use Cases)
Business logic services that orchestrate domain entities:

- **DeviceService**: Device management workflows
- **ClientService**: Client management workflows
- **FormService**: Form template management
- **FormEntryService**: Form submission workflows

#### API Controllers
REST endpoints that expose system functionality:

- **DevicesController**: Device management API
- **FormsController**: Form template API
- **FormEntriesController**: Form submission API
- **FormSubmissionsController**: Legacy form integration API

### Frontend Components

#### Layout Components
- **MainLayout**: Primary application layout with navigation
- **PageLayout**: Standard page wrapper with common elements

#### Feature Components
- **DeviceList**: Display and manage devices
- **ClientList**: Display and manage clients
- **FormList**: Display available forms
- **FlowerFormIntegration**: Embedded form interface

#### Common Components
- **LoadingSpinner**: Loading state indicator
- **ErrorBoundary**: Error handling wrapper
- **Pagination**: Data pagination controls

## Data Storage

### Database Structure

The system uses PostgreSQL with the following approach to data storage:

#### Core Tables

1. **devices**
   - Primary key: `id` (UUID)
   - Unique constraints: `serial`, `qr_code`
   - Indexes: `status`, `clinic_id`, `assigned_patient_id`
   - JSON fields: `external_ids`, `maintenance_notes`

2. **patients** (mapped to Client entity)
   - Primary key: `id` (UUID)
   - Indexes: `status`, `clinic_id`, `full_name`
   - JSON fields: `contacts`

3. **form_templates**
   - Primary key: `id` (UUID)
   - Unique constraints: `title` + `version`
   - JSON fields: `schema` (form structure definition)

4. **form_entries**
   - Primary key: `id` (UUID)
   - Foreign keys: `form_id`, `patient_id`, `device_id`
   - JSON fields: `data` (form submission data)
   - Indexes: `status`, `patient_id`, `form_id`

#### Data Storage Patterns

**JSON Schema Storage**:
- Form templates store their structure as JSON schemas
- Form submissions store data as flexible JSON objects
- Allows for schema evolution without database migrations

**Audit Fields**:
- All entities include `created_at`, `updated_at` timestamps
- User tracking with `created_by`, `updated_by` fields
- Enables full audit trail of changes

**Status Tracking**:
- Entities use enum-based status fields for state management
- Supports business workflow transitions
- Enables filtering and reporting by status

### Migration Strategy

Database migrations are managed using Knex.js:
- Location: `packages/persistence/database/migrations/`
- Naming: `001_initial_schema.ts`, `002_add_forms.ts`, etc.
- Run via: `knex migrate:latest`

## Creating New Packages

### Package Structure Template

When creating a new package, follow this structure:

```
packages/your-package/
├── src/
│   ├── index.ts              # Package exports
│   ├── your-package.module.ts # NestJS module (if applicable)
│   └── [implementation files]
├── package.json              # Package configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Package documentation
```

### Step-by-Step Guide

1. **Create Package Directory**
   ```bash
   npm run create:package your-package-name
   ```

2. **Configure package.json**
   ```json
   {
     "name": "@cuis/your-package",
     "version": "0.1.0",
     "description": "Package description",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "scripts": {
       "build": "tsc",
       "test": "jest",
       "lint": "eslint src/**/*.ts",
       "clean": "rimraf dist"
     },
     "dependencies": {
       "@cuis/domain": "^0.1.0"
     }
   }
   ```

3. **Add TypeScript Configuration**
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src/**/*"],
     "exclude": ["dist", "node_modules"]
   }
   ```

4. **Update Root Scripts** (if needed)
   Add package-specific scripts to root `package.json`

5. **Add to Turbo Configuration**
   Update `turbo.json` if package has build steps

### Package Dependencies

Follow these dependency guidelines:

- **Domain packages**: Should have minimal dependencies
- **Infrastructure packages**: Can depend on domain and external libraries
- **Application packages**: Can depend on domain and infrastructure
- **API packages**: Can depend on use-cases, domain, and web frameworks

## Development Guidelines

### Code Organization

1. **Follow Clean Architecture**: Keep dependencies pointing inward
2. **Use Dependency Injection**: Leverage NestJS DI container
3. **Implement Interfaces**: Use ports/adapters pattern
4. **Type Safety**: Leverage TypeScript for compile-time safety

### Testing Strategy

1. **Unit Tests**: Test domain logic and services
2. **Integration Tests**: Test repository implementations
3. **E2E Tests**: Test complete user workflows
4. **API Tests**: Test REST endpoints

### Code Style

1. **Naming Conventions**:
   - Classes: PascalCase
   - Methods/Variables: camelCase
   - Constants: UPPER_SNAKE_CASE
   - Files: kebab-case

2. **File Organization**:
   - Group related functionality in directories
   - Use index.ts files for clean exports
   - Keep files focused and cohesive

3. **Documentation**:
   - Document public APIs with JSDoc
   - Include examples in complex functions
   - Maintain README files for each package

### Database Guidelines

1. **Migrations**: Always use migrations for schema changes
2. **Indexing**: Add indexes for frequently queried fields
3. **JSON Storage**: Use JSON fields for flexible, non-relational data
4. **Naming**: Use snake_case for database fields, camelCase in code

## Next Steps

For specific implementation details, refer to:
- [UML Schema Documentation](./UML_SCHEMA.md)
- [API Documentation](http://localhost:3002/api/docs) (when server is running)
- [Frontend Component Guide](./FRONTEND_COMPONENTS.md)
- [Database Schema Reference](./DATABASE_SCHEMA.md)