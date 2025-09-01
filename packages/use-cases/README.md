# @reki/use-cases

Application business logic and use case implementations for the Reki system.

## Overview

This package contains application services that orchestrate domain entities and implement business workflows. It serves as the application layer in Clean Architecture.

## Contents

- **Services**: Business logic implementations
- **Use Cases**: Application workflow orchestration
- **Business Rules**: Cross-entity business logic

## Key Features

- Business workflow orchestration
- Domain entity coordination
- Transaction boundary management
- Clean interfaces for API layer

## Services

- **DeviceService**: Device management workflows
- **ClientService**: Client/patient management
- **FormService**: Form template management
- **FormEntryService**: Form submission workflows

## Usage

```typescript
import { ClientService } from '@reki/use-cases';

// Service usage (injected via DI)
const client = await clientService.createClient({
  fullName: 'John Doe',
  status: ClientStatus.INTAKE,
});
```

## Dependencies

- `@reki/domain` - Core domain models and interfaces
- `uuid` - UUID generation
- NestJS (peer dependency) - Dependency injection

## Documentation

For complete package documentation, see:
**[Package Reference Guide](../../docs/PACKAGE_REFERENCE.md#rekiuse-cases)**

For system documentation, see:
**[Reki Documentation Hub](../../docs/README.md)**
