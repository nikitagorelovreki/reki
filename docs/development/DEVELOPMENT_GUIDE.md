# 🛠️ Development Guide - Reki Medical Device Management

## 📋 Overview

This guide provides comprehensive instructions for developers working on the Reki Medical Device Management System. It covers development setup, coding standards, testing practices, and deployment procedures.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Docker (optional)

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd reki

# Install dependencies
npm install

# Setup environment
cp packages/api-server/.env.example packages/api-server/.env
cp packages/telegram-bot/.env.example packages/telegram-bot/.env

# Start database
docker-compose up -d postgres

# Run migrations
npm run db:migrate

# Seed database
npm run seed

# Start all services
npm run dev
```

## 🏗️ Project Structure

### Monorepo Organization

```
reki/
├── packages/
│   ├── domain/              # Core business logic
│   │   ├── src/
│   │   │   ├── entities/     # Business entities
│   │   │   ├── value-objects/ # Value objects
│   │   │   └── ports/        # Interface definitions
│   │   └── package.json
│   ├── use-cases/            # Application services
│   │   ├── src/
│   │   │   ├── services/     # Business logic services
│   │   │   └── interfaces/   # Service interfaces
│   │   └── package.json
│   ├── persistence/         # Data access layer
│   │   ├── src/
│   │   │   ├── repositories/ # Repository implementations
│   │   │   ├── migrations/   # Database migrations
│   │   │   └── models/       # Data models
│   │   └── package.json
│   ├── api/                  # API layer
│   │   ├── src/
│   │   │   ├── controllers/  # HTTP controllers
│   │   │   ├── dto/          # Data transfer objects
│   │   │   └── middleware/   # API middleware
│   │   └── package.json
│   ├── api-server/           # NestJS application
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── config/       # Application config
│   │   │   └── main.ts       # Application entry
│   │   └── package.json
│   ├── frontend/             # React application
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── services/     # API services
│   │   │   └── utils/        # Utilities
│   │   └── package.json
│   └── telegram-bot/         # Telegram bot
│       ├── src/
│       │   ├── services/     # Bot services
│       │   ├── handlers/     # Command handlers
│       │   └── types/        # Bot types
│       └── package.json
├── config/                   # Shared configuration
├── docs/                     # Documentation
└── scripts/                  # Build and deployment scripts
```

## 🔧 Development Environment

### Environment Variables

#### API Server (.env)

```bash
# Database
DATABASE_URL=postgresql://reki:reki@localhost:5432/reki
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reki
DB_USER=reki
DB_PASSWORD=reki

# Server
PORT=3002
NODE_ENV=development
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Telegram Bot (.env)

```bash
# Bot Configuration
TELEGRAM_BOT_TOKEN=8475713342:AAEzLCXbERj3Qgjrq4LeeI0FWZsJoAoTcJI
BOT_PORT=3001

# API Integration
API_BASE_URL=http://localhost:3002/api

# Environment
NODE_ENV=development
LOG_LEVEL=debug
```

#### Frontend (.env)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3002/api
VITE_APP_TITLE=Reki Medical Device Management
```

### Database Setup

#### Using Docker

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Wait for database to be ready
sleep 10

# Run migrations
npm run db:migrate

# Seed database
npm run seed
```

#### Using Local PostgreSQL

```bash
# Create database
createdb reki

# Run migrations
npm run db:migrate

# Seed database
npm run seed
```

## 📝 Coding Standards

### TypeScript Configuration

#### Base Configuration (config/tsconfig.base.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

### Code Style Rules

#### Naming Conventions

- **Files**: kebab-case (`device-service.ts`)
- **Classes/Interfaces**: PascalCase (`DeviceService`)
- **Variables/Functions**: camelCase (`getDeviceById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_DEVICE_COUNT`)
- **Database**: snake_case (`device_status`)

#### Import Organization

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

#### Error Handling

```typescript
// Always use try-catch for async operations
async function createDevice(deviceData: CreateDeviceDto): Promise<Device> {
  try {
    const device = await this.deviceRepository.create(deviceData);
    return device;
  } catch (error) {
    this.logger.error("Failed to create device", { error, deviceData });
    throw new InternalServerErrorException("Failed to create device");
  }
}
```

## 🧪 Testing Strategy

### Test Types

#### 1. Functional Tests

- Test complete workflows
- Use real database
- Test API endpoints
- Test business logic

#### 2. Integration Tests

- Test component interactions
- Test API integration
- Test database operations

#### 3. Unit Tests (Limited)

- Test utility functions
- Test pure functions
- Test validation logic

### Test Environment Setup

#### Test Database

```bash
# Create test database
createdb reki_test

# Set test environment
export NODE_ENV=test
export DATABASE_URL=postgresql://reki:reki@localhost:5432/reki_test
```

#### Test Configuration

```javascript
// config/jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/../packages"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testTimeout: 30000,
  moduleNameMapper: {
    "^@reki/domain(.*)$": "<rootDir>/../packages/domain/src$1",
    "^@reki/use-cases(.*)$": "<rootDir>/../packages/use-cases/src$1",
    "^@reki/persistence(.*)$": "<rootDir>/../packages/persistence/src$1",
    "^@reki/api(.*)$": "<rootDir>/../packages/api/src$1",
    "^@reki/frontend(.*)$": "<rootDir>/../packages/frontend/src$1",
  },
};
```

### Running Tests

#### All Tests

```bash
npm test
```

#### Specific Test Types

```bash
# API tests only
npm run test:api

# Frontend tests only
npm run test:frontend

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Data Management

#### Test Utilities

```typescript
// Global test utilities available in all tests
global.testUtils = {
  generateTestClient: () => ({
    firstName: "Тестовый",
    lastName: "Пациент",
    dateOfBirth: "1980-01-01",
    status: "active_therapy",
    diagnosis: "Test diagnosis",
  }),

  generateTestDevice: () => ({
    serial: `TEST-${Date.now()}`,
    model: "Тестовое устройство",
    status: "IN_STOCK",
    currentLocation: "Test Location",
  }),

  cleanupTestData: async (db) => {
    await db("form_entries").del();
    await db("form_templates").del();
    await db("devices").del();
    await db("clients").del();
  },
};
```

## 🔄 Development Workflow

### Feature Development

#### 1. Create Feature Branch

```bash
git checkout -b feature/device-tracking
```

#### 2. Follow Clean Architecture

1. **Domain Layer**: Define entities and value objects
2. **Use Cases**: Implement business logic
3. **Persistence**: Create repository implementations
4. **API Layer**: Add controllers and DTOs
5. **Frontend**: Update components and services

#### 3. Write Tests

```bash
# Write functional tests
npm run test:api

# Ensure all tests pass
npm test
```

#### 4. Update Documentation

- Update API documentation
- Update architecture diagrams
- Update user guides

#### 5. Create Pull Request

```bash
git add .
git commit -m "feat: add device tracking feature"
git push origin feature/device-tracking
```

### Database Changes

#### 1. Create Migration

```bash
# Create new migration
npm run db:migrate:create -- add_device_tracking_fields
```

#### 2. Update Domain Models

```typescript
// packages/domain/src/entities/device.entity.ts
export class Device {
  // Add new fields
  trackingEnabled: boolean;
  lastLocationUpdate: Date;
}
```

#### 3. Update Repository

```typescript
// packages/persistence/src/repositories/device.repository.ts
async updateTrackingInfo(deviceId: string, location: string): Promise<void> {
  await this.db('devices')
    .where({ id: deviceId })
    .update({
      current_location: location,
      last_location_update: new Date()
    });
}
```

#### 4. Test Migration

```bash
# Test migration
npm run db:migrate:test

# Rollback if needed
npm run db:migrate:rollback
```

## 🚀 Deployment

### Development Deployment

#### Start All Services

```bash
# Start all services in development mode
npm run dev

# Or start individually
npm run api:dev      # API server (port 3002)
npm run frontend:dev # Frontend (port 3000)
npm run telegram:dev # Telegram bot (port 3001)
```

#### Build for Production

```bash
# Build all packages
npm run build

# Start production services
npm run api:start
npm run frontend:start
npm run telegram:start
```

### Production Deployment

#### Environment Setup

```bash
# Set production environment
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@host:5432/reki_prod
export TELEGRAM_BOT_TOKEN=your_production_token
```

#### Database Migration

```bash
# Run migrations
npm run db:migrate

# Seed production data
npm run seed:prod
```

#### Service Deployment

```bash
# Build applications
npm run build

# Start services with PM2
pm2 start ecosystem.config.js
```

## 🔍 Debugging

### API Server Debugging

#### Enable Debug Logging

```bash
export LOG_LEVEL=debug
npm run api:dev
```

#### Database Debugging

```bash
# Connect to database
psql postgresql://reki:reki@localhost:5432/reki

# Check tables
\dt

# Check data
SELECT * FROM devices LIMIT 5;
```

#### API Testing

```bash
# Test API endpoints
curl http://localhost:3002/api/devices
curl http://localhost:3002/api/health
```

### Frontend Debugging

#### Enable Dev Tools

```bash
# Start with dev tools
npm run frontend:dev

# Open browser dev tools
# Check Network tab for API calls
# Check Console for errors
```

#### Component Debugging

```typescript
// Add debug logging
console.log("Component props:", props);
console.log("Component state:", state);
```

### Telegram Bot Debugging

#### Enable Bot Logging

```bash
export LOG_LEVEL=debug
npm run telegram:dev
```

#### Test Bot Commands

```bash
# Test bot in Telegram
/start
/register_device
/create_ticket
```

## 📊 Monitoring

### Application Monitoring

#### Health Checks

- **API**: `GET /api/health`
- **Database**: Connection status
- **Bot**: Bot status and API connectivity

#### Performance Monitoring

- API response times
- Database query performance
- Frontend bundle size
- Error rates

### Logging

#### Log Levels

- `error`: Application errors
- `warn`: Warning conditions
- `info`: General information
- `debug`: Debug information

#### Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "Device created successfully",
  "context": {
    "deviceId": "uuid",
    "serial": "DEV-001"
  }
}
```

## 🔒 Security

### Current Security Measures

- Input validation using class-validator
- SQL injection prevention
- CORS configuration
- Error handling without sensitive data

### Security Best Practices

- Validate all inputs
- Use parameterized queries
- Sanitize data before storage
- Log security events
- Regular security audits

## 📚 Resources

### Documentation

- [AI Agent Guide](docs/ai-agents/README.md)
- [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [API Documentation](docs/api/API_DOCUMENTATION.md)
- [Testing Guide](docs/testing/TESTING.md)

### External Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

This development guide ensures consistent practices across the team and maintains code quality throughout the project lifecycle.
