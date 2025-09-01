# @cuis/api

REST API controllers and Data Transfer Objects for the CUIS system.

## Overview

This package provides HTTP endpoints and request/response handling for the CUIS system. It implements the presentation layer for REST API access.

## Contents

- **Controllers**: REST API endpoint implementations
- **DTOs**: Data Transfer Objects for requests/responses
- **Validation**: Input validation using class-validator
- **Documentation**: Swagger/OpenAPI integration

## Key Features

- RESTful API endpoints
- Automatic Swagger documentation
- Request/response validation
- DTO pattern for clean interfaces
- Bearer token authentication support

## API Endpoints

- `/devices` - Device management
- `/clients` - Client/patient management
- `/forms` - Form template management
- `/form-entries` - Form submission management
- `/form-submissions` - Legacy form integration

## Usage

```typescript
import { DevicesController } from '@cuis/api';

// Controller usage (NestJS DI)
@Controller('devices')
export class DevicesController {
  constructor(private deviceService: DeviceService) {}
  
  @Get()
  async findAll() {
    return this.deviceService.getAllDevices();
  }
}
```

## Dependencies

- `@cuis/domain` - Domain models and types
- `@cuis/use-cases` - Business logic services
- `class-validator` - DTO validation
- `class-transformer` - Object transformation
- NestJS (peer dependency) - Web framework

## Documentation

For complete package documentation, see:
**[Package Reference Guide](../../docs/PACKAGE_REFERENCE.md#cuisapi)**

For API endpoint documentation, see:
**http://localhost:3002/api/docs** (when server is running)

For system documentation, see:
**[CUIS Documentation Hub](../../docs/README.md)**