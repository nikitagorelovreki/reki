# @cuis/domain

Core business domain models and interfaces for the CUIS system.

## Overview

This package contains pure business logic, domain entities, and port interfaces. It has no external dependencies and represents the heart of the application's business rules.

## Contents

- **Models**: Domain entities (Device, Client, Form, FormEntry)
- **Ports**: Interface definitions for external dependencies
- **Business Logic**: Entity methods and domain rules

## Key Features

- Zero external dependencies
- Rich domain models with business logic
- Repository pattern interfaces
- Type-safe entity operations

## Usage

```typescript
import { Device, DeviceStatus } from '@cuis/domain';

const device = new Device({
  serial: 'DEV001',
  model: 'RehabDevice Pro'
});

device.assignToPatient('patient-123');
```

## Documentation

For complete package documentation, see:
**[Package Reference Guide](../../docs/PACKAGE_REFERENCE.md#cuisdomain)**

For system documentation, see:
**[CUIS Documentation Hub](../../docs/README.md)**