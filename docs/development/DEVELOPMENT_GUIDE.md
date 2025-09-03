# 🛠️ Development Guide - Reki Control Panel

## 📋 Overview

This guide provides comprehensive instructions for developers working on the Reki Control Panel project, a comprehensive medical device management and patient assessment system built with TypeScript and following Clean Architecture principles.

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
cp packages/app-core-server/.env.example packages/app-core-server/.env
cp packages/app-auth-server/.env.example packages/app-auth-server/.env
cp packages/app-telegram-bot/.env.example packages/app-telegram-bot/.env

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
│   ├── core-domain/           # Core business logic and entities
│   │   ├── src/
│   │   │   ├── models/         # Business entities
│   │   │   ├── ports/          # Repository interfaces
│   │   │   └── tokens.ts       # Dependency injection tokens
│   │   └── package.json
│   ├── core-service/           # Application business logic
│   │   ├── src/
│   │   │   ├── services/       # Business logic services
│   │   │   ├── mappers/        # Data mappers
│   │   │   └── interfaces/     # Service interfaces
│   │   └── package.json
│   ├── core-persistence/       # Data access layer
│   │   ├── src/
│   │   │   ├── repositories/   # Repository implementations
│   │   │   ├── database/       # Database configuration
│   │   │   └── models/         # Data models
│   │   ├── database/
│   │   │   └── migrations/     # Database migrations
│   │   └── package.json
│   ├── auth-domain/            # Authentication domain
│   │   ├── src/
│   │   │   ├── models/         # Auth entities
│   │   │   └── ports/          # Auth repository interfaces
│   │   └── package.json
│   ├── auth-service/           # Authentication business logic
│   │   ├── src/
│   │   │   ├── services/       # Auth services
│   │   │   └── mappers/        # Auth mappers
│   │   └── package.json
│   ├── auth-persistence/       # Authentication data access
│   │   ├── src/
│   │   │   └── repositories/   # Auth repository implementations
│   │   └── package.json
│   ├── persistence-commons/   # Shared persistence utilities
│   │   ├── src/
│   │   │   └── utils/          # Common database utilities
│   │   └── package.json
│   ├── api/                    # API layer
│   │   ├── src/
│   │   │   ├── clients/        # API clients
│   │   │   ├── devices/        # Device endpoints
│   │   │   ├── forms/          # Form endpoints
│   │   │   ├── common/         # Common API utilities
│   │   │   ├── dto/            # Data transfer objects
│   │   │   └── mappers/        # API mappers
│   │   └── package.json
│   ├── app-core-server/        # Main NestJS application
│   │   ├── src/
│   │   │   ├── app.module.ts   # Main application module
│   │   │   ├── main.ts         # Application entry
│   │   │   └── providers.ts    # Global providers
│   │   └── package.json
│   ├── app-auth-server/        # Authentication server
│   │   ├── src/
│   │   │   ├── app-auth-server.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   ├── app-control-panel/      # React frontend application
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── pages/          # Page components
│   │   │   ├── api/            # API services
│   │   │   ├── types/          # TypeScript types
│   │   │   └── utils/          # Utilities
│   │   └── package.json
│   └── app-telegram-bot/       # Telegram bot
│       ├── src/
│       │   ├── services/       # Bot services
│       │   ├── handlers/       # Command handlers
│       │   └── types/          # Bot types
│       └── package.json
├── config/                     # Shared configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── jest.config.js          # Jest configuration
│   └── eslint-rules/           # Custom ESLint rules
├── docs/                       # Documentation
└── scripts/                    # Build and deployment scripts
```

## 🔧 Development Environment

### Environment Variables

#### Core Server (.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/reki

# Server
PORT=3002
NODE_ENV=development

# JWT (for future auth)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

#### Auth Server (.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/reki_auth

# Server
PORT=3003
NODE_ENV=development

# JWT
JWT_SECRET=your-auth-secret-key
JWT_EXPIRES_IN=24h
```

#### Telegram Bot (.env)
```bash
# Bot Configuration
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_BOT_USERNAME=your-bot-username

# API Configuration
API_BASE_URL=http://localhost:3002/api
```

### Development Scripts

```bash
# Start all services
npm run dev

# Start specific services
npm run core:dev      # Core server
npm run app:dev       # Frontend
npm run telegram:dev  # Telegram bot
npm run auth:dev      # Auth server

# Build specific packages
npm run core-domain:build
npm run core-service:build
npm run core-persistence:build
npm run auth-domain:build
npm run auth-service:build
npm run auth-persistence:build
npm run persistence-commons:build
npm run auth:build

# Testing
npm run test          # All tests
npm run test:coverage # With coverage
npm run lint          # Linting
npm run clean         # Clean builds
```

## 🏛️ Clean Architecture Implementation

### Layer Dependencies

```
API Layer (app-core-server, api)
    ↓ (injects)
Service Layer (core-service, auth-service)
    ↓ (injects)
Persistence Layer (core-persistence, auth-persistence)
    ↓ (implements)
Domain Layer (core-domain, auth-domain)
```

### Package Dependencies

- **API Layer**: Can only import from service layers
- **Service Layer**: Can import from persistence and domain layers
- **Persistence Layer**: Can only import from domain layer
- **Domain Layer**: No external dependencies

### Key Principles

1. **Dependency Inversion**: High-level modules don't depend on low-level modules
2. **Single Responsibility**: Each package has a single, well-defined purpose
3. **Interface Segregation**: Clients depend only on interfaces they use
4. **Open/Closed**: Open for extension, closed for modification

## 🛠️ Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes following Clean Architecture
# - Add domain entities in core-domain
# - Add repository interfaces in core-domain
# - Implement repositories in core-persistence
# - Add services in core-service
# - Add API endpoints in api
# - Add frontend components in app-control-panel

# Test changes
npm run test

# Lint code
npm run lint

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 2. Database Changes

```bash
# Create migration
cd packages/core-persistence
npm run migration:create -- --name migration_name

# Run migrations
npm run migration:run

# Rollback if needed
npm run migration:rollback
```

### 3. API Development

```bash
# Add DTOs in packages/api/src/dto/
# Add controllers in packages/api/src/
# Add mappers in packages/api/src/mappers/
# Update API documentation
```

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test component interactions
3. **API Tests**: Test HTTP endpoints with real database
4. **Frontend Tests**: Test React components

### Running Tests

```bash
# All tests
npm run test

# Specific test suites
npm run test:api
npm run test:integration
npm run test:unit

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📦 Package Management

### Adding New Packages

```bash
# Create new package
node scripts/create-package.js package-name

# Add dependencies
cd packages/package-name
npm install dependency-name

# Add to workspace
# Update root package.json workspaces
```

### Package Dependencies

- Use workspace dependencies (`@reki/package-name`)
- Avoid circular dependencies
- Follow Clean Architecture layer rules
- Use semantic versioning

## 🔍 Code Quality

### Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Architecture Validation

- No direct imports between layers
- Repository pattern implementation
- Service layer business logic
- Proper dependency injection

## 🚀 Deployment

### Development Deployment

```bash
# Build all packages
npm run build

# Start services
npm run start
```

### Production Deployment

```bash
# Build for production
npm run build:prod

# Run migrations
npm run db:migrate:prod

# Start production services
npm run start:prod
```

## 📚 Additional Resources

- [Architecture Documentation](architecture/SYSTEM_ARCHITECTURE.md)
- [API Documentation](api/API_DOCUMENTATION.md)
- [Testing Guide](testing/TESTING.md)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Last Updated**: December 2024  
**Version**: 2.0.0
