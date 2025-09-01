# @cuis/persistence

Data persistence layer for the CUIS system using PostgreSQL and Knex.js.

## Overview

This package implements the repository pattern for data access, providing concrete implementations of domain-defined repository ports.

## Contents

- **Repositories**: Data access implementations
- **Database Service**: PostgreSQL connection management
- **Migrations**: Database schema management
- **Utilities**: Data mapping and conversion tools

## Key Features

- Repository pattern implementation
- Automatic camelCase ↔ snake_case conversion
- PostgreSQL connection pooling
- Knex.js query builder integration
- Database migration support

## Usage

```typescript
import { DeviceRepository, DatabaseService } from '@cuis/persistence';

// Repository usage (injected via DI)
const device = await deviceRepository.create(deviceEntity);
```

## Configuration

Set environment variables for database connection:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=cuis
POSTGRES_PASSWORD=cuis
POSTGRES_DB=cuis
```

## Documentation

For complete package documentation, see:
**[Package Reference Guide](../../docs/PACKAGE_REFERENCE.md#cuispersistence)**

For system documentation, see:
**[CUIS Documentation Hub](../../docs/README.md)**