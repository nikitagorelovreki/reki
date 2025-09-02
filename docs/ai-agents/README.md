# 🤖 AI Agent Guide - Reki Medical Device Management System

## 📋 Overview

This document provides comprehensive guidance for AI agents working with the Reki Medical Device Management System. This is a TypeScript monorepo built with Clean Architecture principles, featuring a NestJS backend, React frontend, and Telegram bot integration. AI agents should use this guide as the primary reference for understanding the system architecture, coding standards, and development workflows.

## 🏗️ System Architecture

### Monorepo Structure

```
reki/
├── packages/
│   ├── api-server/          # NestJS backend server
│   ├── frontend/            # React + Vite + Ant Design
│   ├── domain/              # Domain entities and business logic
│   ├── use-cases/           # Application services
│   ├── persistence/         # Data access layer
│   ├── api/                 # API controllers and DTOs
│   └── telegram-bot/        # Telegram bot for field operations
├── config/                  # Shared configuration files
├── docs/                    # Documentation
└── scripts/                 # Build and deployment scripts
```

### Technology Stack

- **Backend**: NestJS, TypeScript, PostgreSQL
- **Frontend**: React 18, TypeScript, Ant Design, Vite
- **Bot**: Telegraf, TypeScript, HTTP API integration
- **Build**: Turbo, Jest, ESLint, Prettier
- **Database**: PostgreSQL with Knex.js
- **Testing**: Jest, Supertest, React Testing Library

## 🎯 Core Business Domain

### Medical Device Management

- **Devices**: Medical equipment tracking and management
- **Clients**: Patient information and medical records
- **Forms**: Assessment forms (LFK, FIM) for patient evaluation
- **Form Entries**: Completed assessments with data visualization
- **Support Tickets**: Issue tracking and resolution

### Key Entities

- `Device`: Medical equipment with status tracking
- `Client`: Patient information and medical history
- `FormTemplate`: Assessment form definitions
- `FormEntry`: Completed assessment data
- `TelegramTicket`: Support requests via Telegram

## 🔧 Development Rules for AI Agents

### 1. Clean Architecture Principles

- **Domain-Driven Design**: Focus on business domain and entities first
- **Dependency Rule**: Dependencies always point inward (domain ← use-cases ← adapters ← infrastructure)
- **Separation of Concerns**: Keep layers distinct and focused on single responsibility
- **Package Structure**: Respect the established monorepo organization

### 2. Coding Standards

- **TypeScript**: Use strict typing with proper interfaces and types
- **Naming Conventions**:
  - **Files**: kebab-case (e.g., `device-service.ts`)
  - **Classes/Interfaces**: PascalCase (e.g., `DeviceService`)
  - **Variables/Functions**: camelCase (e.g., `getDeviceById`)
  - **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_DEVICE_COUNT`)
  - **Database**: snake_case (e.g., `device_status`)

### 3. Import Organization

```typescript
// 1. External libraries
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

// 2. Internal packages (workspace dependencies)
import { Device, DeviceStatus } from "@reki/domain";
import { DeviceService } from "@reki/use-cases";

// 3. Relative imports
import { DeviceCard } from "./DeviceCard";
import type { DeviceProps } from "../types";
```

### 4. Error Handling

- **Try-Catch Pattern**: Always use try-catch blocks for async operations
- **HTTP Exceptions**: Use NestJS exception filters in controllers
- **Logging**: Include context with errors using structured logging
- **User Messages**: Provide clear, non-technical error messages for users
- **Error Types**: Distinguish between validation errors, not found, and server errors

### 5. Testing Strategy

- **Functional Testing**: Test complete workflows rather than isolated units
- **Database Integration**: Use real database for testing with proper cleanup
- **API Coverage**: Test all API endpoints with various scenarios
- **Test Data**: Use generators and factories for consistent test data
- **Test Environment**: Use separate test database and configuration

## 📡 API Integration

### Base URL

- **Development**: `http://localhost:3002/api`
- **Production**: Configure via environment variables

### Key Endpoints

- `GET /api/devices` - List devices
- `POST /api/devices` - Create device
- `GET /api/clients` - List clients
- `POST /api/forms` - Create form entry
- `GET /api/forms/type/:type` - Get forms by type

### Authentication

- Currently no authentication required
- Future: JWT token authentication

## 🤖 Telegram Bot Integration

### Bot Token

- **Token**: `8475713342:AAEzLCXbERj3Qgjrq4LeeI0FWZsJoAoTcJI`
- **Port**: 3001 (separate from API server)

### Available Commands

- `/start` - Initialize bot
- `/register_device` - Register new medical device
- `/create_ticket` - Create support ticket
- `/device_status` - Check device status
- `/list_devices` - List recent devices

### Integration Pattern

- Bot communicates with API server via HTTP
- Uses domain models for data consistency
- Stores data through API endpoints

## 🗄️ Database Schema

### Core Tables

- `devices` - Medical device information
- `clients` - Patient/client data
- `form_templates` - Assessment form definitions
- `form_entries` - Completed assessments
- `telegram_tickets` - Support tickets from bot

### Key Relationships

- Devices can be assigned to clients
- Form entries reference form templates
- Form entries contain assessment data
- Telegram tickets can reference devices

## 🧪 Testing Strategy

### Test Types

1. **Functional Tests**: Test complete workflows
2. **API Tests**: Test HTTP endpoints
3. **Integration Tests**: Test component interactions
4. **Database Tests**: Test data persistence

### Test Environment

- **Database**: `reki_test` (separate from development)
- **Environment**: `.env.test` configuration
- **Data**: Clean database between tests

### Running Tests

```bash
npm test                    # Run all tests
npm run test:coverage      # Run with coverage
npm run test:api           # Run API tests only
```

## 🚀 Deployment

### Development Setup

```bash
# Install dependencies
npm install

# Start all services
npm run dev

# Or start individually
npm run api:dev           # API server (port 3002)
npm run frontend:dev      # Frontend (port 3000)
npm run telegram:dev      # Telegram bot (port 3001)
```

### Production Build

```bash
npm run build             # Build all packages
npm run api:start         # Start API server
npm run frontend:start    # Start frontend
npm run telegram:start    # Start Telegram bot
```

## 📚 Documentation Structure

### AI Agent Documentation

- `docs/ai-agents/` - AI-specific guidance
- `docs/architecture/` - System architecture
- `docs/api/` - API documentation
- `docs/development/` - Development guides
- `docs/deployment/` - Deployment guides
- `docs/testing/` - Testing documentation
- `docs/user-guides/` - End-user documentation

## 🔍 Common Tasks for AI Agents

### 1. Adding New Features

1. **Analyze Requirements**:
   - Understand business requirements thoroughly
   - Identify affected domain entities and use cases
   - Plan changes across all architectural layers

2. **Domain Layer Changes**:
   - Add or modify domain entities in `packages/domain/src/entities/`
   - Define value objects in `packages/domain/src/value-objects/`
   - Update repository interfaces in `packages/domain/src/ports/`

3. **Use Case Implementation**:
   - Create application services in `packages/use-cases/src/services/`
   - Implement business logic following Clean Architecture
   - Handle validation and error cases properly

4. **API Layer Changes**:
   - Add DTOs in `packages/api/src/dto/`
   - Create controllers in `packages/api/src/controllers/`
   - Implement validation using class-validator decorators
   - Document with Swagger annotations

5. **Frontend Implementation**:
   - Create or update components in `packages/frontend/src/components/`
   - Add API client methods in `packages/frontend/src/api/`
   - Implement proper TypeScript interfaces
   - Ensure responsive design with Ant Design components

6. **Testing & Documentation**:
   - Write functional tests for API endpoints
   - Test frontend components
   - Update relevant documentation
   - Create usage examples

### 2. Database Schema Changes

1. **Create Migration Files**:
   - Use `npm run db:migrate:create -- migration_name`
   - Follow existing migration patterns in `packages/persistence/database/migrations/`
   - Include both up and down migrations for rollback support

2. **Update Domain Models**:
   - Add properties to domain entities
   - Update TypeScript interfaces and types
   - Ensure proper validation rules

3. **Update Repositories**:
   - Modify repository implementations in `packages/persistence/src/repositories/`
   - Update queries to reflect schema changes
   - Add new methods for accessing new data

4. **Update DTOs & API**:
   - Update DTOs to include new fields
   - Modify API endpoints to handle new data
   - Update validation rules

5. **Testing**:
   - Test migrations with `npm run db:migrate:test`
   - Verify data integrity after migration
   - Test repository methods with new schema

### 3. API Endpoint Changes

1. **Controller Implementation**:
   - Follow RESTful principles
   - Use proper HTTP methods (GET, POST, PATCH, DELETE)
   - Implement pagination for list endpoints
   - Handle query parameters consistently

2. **DTO Design**:
   - Create separate DTOs for requests and responses
   - Use class-validator decorators for validation
   - Include proper TypeScript types
   - Follow naming conventions (e.g., `CreateDeviceDto`, `DeviceResponseDto`)

3. **Service Integration**:
   - Connect controllers to application services
   - Handle errors appropriately
   - Implement proper logging

4. **Documentation**:
   - Add Swagger annotations for all endpoints
   - Include example requests and responses
   - Document error responses

5. **Testing**:
   - Test all endpoints with various scenarios
   - Verify error handling
   - Test pagination and filtering

### 4. Frontend Component Development

1. **Component Design**:
   - Follow Ant Design patterns and guidelines
   - Create reusable components
   - Implement proper prop typing
   - Use React hooks for state management

2. **API Integration**:
   - Create API client methods
   - Handle loading states
   - Implement proper error handling
   - Use async/await pattern

3. **State Management**:
   - Use React Context for global state when needed
   - Organize local component state
   - Handle form state properly

4. **UI/UX Considerations**:
   - Ensure responsive design
   - Follow accessibility guidelines
   - Implement proper loading states
   - Add user-friendly error messages

5. **Testing**:
   - Test component rendering
   - Test user interactions
   - Test API integration

## ⚠️ Important Notes for AI Agents

### 1. Data Consistency

- **Always use domain models for data validation**
- **Maintain referential integrity**
- **Use transactions for complex operations**

### 2. Performance

- **Use pagination for large datasets**
- **Implement proper indexing**
- **Cache frequently accessed data**

### 3. Security

- **Validate all inputs**
- **Sanitize data before storage**
- **Use parameterized queries**

### 4. Error Handling

- **Provide meaningful error messages**
- **Log errors with context**
- **Handle edge cases gracefully**

## 🎯 Success Criteria

### For AI Agents Working on This Project

1. **Code follows Clean Architecture principles**
2. **All changes are properly tested**
3. **Documentation is updated**
4. **No breaking changes to existing APIs**
5. **Performance is maintained or improved**
6. **Security best practices are followed**

## 📞 Support and Resources

### Key Files for Understanding

- `package.json` - Project dependencies and scripts
- `turbo.json` - Monorepo configuration
- `config/` - Shared configuration files
- `docs/` - Comprehensive documentation

### Environment Variables

- `DATABASE_URL` - Database connection string
- `TELEGRAM_BOT_TOKEN` - Bot authentication
- `API_BASE_URL` - API server URL
- `NODE_ENV` - Environment (development/production)

---

**Remember**: This is a medical device management system. Accuracy, reliability, and data integrity are critical. Always prioritize patient safety and data security in any changes or additions.
