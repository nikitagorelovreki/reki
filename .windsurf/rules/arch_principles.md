---
trigger: always_on
description: Arch Principles
---

# Reki Control Panel - Windsurf Rules

You are an AI assistant helping with the Reki Control Panel project, a comprehensive medical device management and patient assessment system built with TypeScript and following Clean Architecture principles.

## Project Structure & Architecture

This is a TypeScript monorepo with the following packages:
- `packages/app-control-panel/` - React + Webpack + Ant Design + TypeScript frontend
- `packages/app-core-server/` - Main NestJS backend application server
- `packages/app-auth-server/` - Authentication server
- `packages/app-telegram-bot/` - Telegram bot integration
- `packages/core-domain/` - Core domain entities, value objects, and ports (DDD)
- `packages/core-service/` - Core application business logic and services
- `packages/core-persistence/` - Core data access layer and repository implementations
- `packages/auth-domain/` - Authentication domain entities and ports
- `packages/auth-service/` - Authentication business logic
- `packages/auth-persistence/` - Authentication data access layer
- `packages/api/` - API controllers and DTOs
- `packages/persistence-commons/` - Shared persistence utilities

## Technology Stack

**Frontend:** React 18 + TypeScript + Webpack + Ant Design + React Router + Axios + Day.js + Chart.js
**Backend:** NestJS + TypeScript + Class-validator + Swagger/OpenAPI + PostgreSQL + Knex.js + Clean Architecture + DDD
**Build:** Turbo + ESLint + Prettier + Jest

## Clean Architecture Layer Rules

### Dependency Flow: API → Service → Persistence → Domain

**Layer Restrictions:**
- **API:** ❌ No domain/persistence imports ✅ Only service imports
- **Service:** ❌ No API imports ✅ Import persistence + domain
- **Domain:** ❌ No other layer imports ✅ Only entities, ports, value objects
- **Persistence:** ❌ No API imports ✅ Only domain imports, implement ports

## Model Layer Rules

**API Layer:** DTOs with validation decorators, ISO strings for dates, local enums
**Service Layer:** Interfaces with string dates, business logic models
**Domain Layer:** Rich entities with Date objects, repository ports

❌ **Never:** Import domain models in API, reuse domain models as DTOs, import API DTOs in service

## Code Style Guidelines

**TypeScript Rules:**
- `interface` for extensible objects, `type` for unions/primitives
- PascalCase for interfaces/types/classes, camelCase for variables/functions
- UPPER_SNAKE_CASE for constants, kebab-case for files/directories
- Import order: External → Internal packages → Relative imports

**Frontend (React):**
- Component structure: State hooks → Effect hooks → Event handlers → Render
- Event handlers prefixed with `handle`, typed state with `useState<Type>`
- Import specific Ant Design components: `import { Button, Card } from 'antd';`

**Backend (NestJS):**
- Module imports: External → Internal, with controllers/providers/exports
- Service pattern: Map DTO → Domain → Repository → Map back to Service model
- Controllers: Use @ApiTags, @ApiOperation, @ApiResponse for Swagger docs

**Domain Layer:**
- Entities: Rich objects with business methods, Date objects, explicit types
- Repository Ports: Standard CRUD operations (findById, findAll, create, update, delete)
- Value Objects: Immutable objects representing domain concepts

**Error Handling:**
- Frontend: try/catch with console.error + message.error for user feedback
- Backend: Throw appropriate NestJS exceptions (NotFoundException, BadRequestException, etc.)

## Project Structure Overview

```
reki/
├── packages/
│   ├── core-domain/              # Core business domain (DDD)
│   ├── core-service/             # Core business logic services
│   ├── core-persistence/         # Core data access layer
│   ├── auth-domain/              # Authentication domain
│   ├── auth-service/             # Authentication business logic
│   ├── auth-persistence/         # Authentication data access
│   ├── persistence-commons/      # Shared persistence utilities
│   ├── api/                      # API layer (controllers & DTOs)
│   ├── app-core-server/          # Main NestJS application server
│   ├── app-auth-server/          # Authentication server
│   ├── app-control-panel/        # React frontend application
│   └── app-telegram-bot/         # Telegram bot integration
├── config/                       # Shared configuration
├── docs/                         # Documentation
├── scripts/                      # Build and deployment scripts
├── docker-compose.yml
├── package.json
└── turbo.json
```

## Package Dependencies & Architecture

### Dependency Flow (Clean Architecture)
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  app-control-panel  │  app-core-server  │  app-telegram-bot │
├─────────────────────────────────────────────────────────────┤
│                   API Layer                                │
├─────────────────────────────────────────────────────────────┤
│                        api/                                 │
├─────────────────────────────────────────────────────────────┤
│                 Service Layer                               │
├─────────────────────────────────────────────────────────────┤
│              core-service  │  auth-service                 │
├─────────────────────────────────────────────────────────────┤
│               Persistence Layer                             │
├─────────────────────────────────────────────────────────────┤
│         core-persistence  │  auth-persistence               │
├─────────────────────────────────────────────────────────────┤
│                 Domain Layer                                │
├─────────────────────────────────────────────────────────────┤
│              core-domain  │  auth-domain                   │
├─────────────────────────────────────────────────────────────┤
│              Infrastructure Layer                            │
├─────────────────────────────────────────────────────────────┤
│  persistence-commons  │  Database  │  External Services    │
└─────────────────────────────────────────────────────────────┘
```

### Layer Isolation Rules

1. **Domain Layer** (`core-domain`, `auth-domain`)
   - ❌ NO external dependencies except utilities
   - ✅ ONLY define entities, value objects, ports

2. **Persistence Layer** (`core-persistence`, `auth-persistence`)
   - ❌ NEVER import from API layer
   - ✅ ONLY import from domain layer, implement repository ports

3. **Service Layer** (`core-service`, `auth-service`)
   - ❌ NEVER import from API layer
   - ✅ MUST import from persistence layer (repositories) and domain layer

4. **API Layer** (`api`)
   - ❌ NEVER import from domain/persistence layers directly
   - ✅ ONLY import from service layers

5. **Application Layer** (`app-*`)
   - ✅ Import from API layer for controllers
   - ✅ Configure dependency injection

## Language Support

- Use English for code, comments, and documentation
- UI text should be in Russian
- API documentation should be in English
- Variable names should be in English for consistency

## Database and API Conventions

1. **Database Fields**
   - Use snake_case for database column names
   - Use camelCase in TypeScript code
   - Provide field mappings in models

2. **API Design**
   - RESTful endpoints with proper HTTP methods
   - Use `/api` prefix
   - Swagger documentation for all endpoints
   - Consistent error response format

## Common Patterns to Follow

1. **Repository Pattern**: Use for data access
2. **Service Layer**: Business logic in services
3. **DTO Pattern**: For API data transfer
4. **Entity Pattern**: Rich domain models
5. **Factory Pattern**: For complex object creation
6. **Mapper Pattern**: For converting between layers

## Code Quality Checklist

- [ ] All functions have proper TypeScript types
- [ ] Error handling is implemented
- [ ] Comments are clear and in English
- [ ] Tests are written for new functionality
- [ ] Swagger documentation is updated for API changes
- [ ] Database migrations are created for schema changes
- [ ] Performance implications are considered
- [ ] Layer isolation rules are followed
- [ ] No circular dependencies between layers

When writing code, always consider the clean architecture principles and maintain consistency with the existing codebase patterns.