# @reki/persistence

Data persistence layer for the Reki system using PostgreSQL and Knex.js.

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
import { DeviceRepository, DatabaseService } from '@reki/persistence';

// Repository usage (injected via DI)
const device = await deviceRepository.create(deviceEntity);
```

## Configuration

Set environment variables for database connection:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=reki
POSTGRES_PASSWORD=reki
POSTGRES_DB=reki
```

## Documentation

For complete package documentation, see:
**[Package Reference Guide](../../docs/PACKAGE_REFERENCE.md#rekipersistence)**

For system documentation, see:
**[Reki Documentation Hub](../../docs/README.md)**
