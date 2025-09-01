# Creating New Packages

## Overview

This guide provides step-by-step instructions for creating new packages in the CUIS monorepo. The system includes an automated script that handles package scaffolding and configuration.

## Quick Start

```bash
# Create a new package
npm run create:package your-package-name

# Example: Create a notifications package
npm run create:package notifications
```

## Package Creation Script

The `scripts/create-package.js` script automates the package creation process and ensures consistency across all packages.

### What the Script Creates

1. **Package Directory**: `packages/your-package-name/`
2. **Source Structure**: Standard `src/` directory with TypeScript files
3. **Configuration Files**: `package.json`, `tsconfig.json`
4. **Build Setup**: Integration with Turborepo build system
5. **Export Structure**: Proper `index.ts` exports

## Manual Package Creation

If you need to create a package manually or understand the structure:

### Step 1: Create Directory Structure

```bash
mkdir -p packages/your-package-name/src
cd packages/your-package-name
```

### Step 2: Create package.json

```json
{
  "name": "@cuis/your-package-name",
  "version": "0.1.0",
  "description": "Brief description of your package",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "clean": "rimraf dist"
  },
  "files": [
    "dist"
  ],
  "publishConfig": {
    "access": "restricted"
  },
  "dependencies": {
    "@cuis/domain": "^0.1.0"
  },
  "peerDependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0"
  },
  "devDependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "typescript": "^5.1.3",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "@types/jest": "^29.5.2",
    "eslint": "^8.42.0",
    "@typescript-eslint/eslint-plugin": "^5.59.11",
    "@typescript-eslint/parser": "^5.59.11",
    "rimraf": "^5.0.1"
  }
}
```

### Step 3: Create TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### Step 4: Create Main Export File

**File**: `src/index.ts`

```typescript
// Export main module
export * from './your-package.module';

// Export services
export * from './services';

// Export types and interfaces
export * from './types';
```

### Step 5: Create NestJS Module (if applicable)

**File**: `src/your-package.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { YourService } from './services/your.service';

@Module({
  providers: [YourService],
  exports: [YourService],
})
export class YourPackageModule {}
```

## Package Types and Examples

### Domain Extension Package

For extending domain models with new entities:

```typescript
// src/models/new-entity.model.ts
export class NewEntity {
  id: string;
  name: string;
  status: NewEntityStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<NewEntity>) {
    Object.assign(this, data);
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  updateStatus(status: NewEntityStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }
}

// src/ports/new-entity-repository.port.ts
export interface NewEntityRepositoryPort {
  create(entity: NewEntity): Promise<NewEntity>;
  findById(id: string): Promise<NewEntity | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<NewEntity>>;
  update(id: string, data: Partial<NewEntity>): Promise<NewEntity>;
  delete(id: string): Promise<void>;
}
```

### Infrastructure Package

For external service integrations:

```typescript
// src/services/external-service.ts
@Injectable()
export class ExternalService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async sendNotification(message: string): Promise<void> {
    const endpoint = this.configService.get('EXTERNAL_API_URL');
    await this.httpService.post(endpoint, { message }).toPromise();
  }
}

// src/external-integration.module.ts
@Module({
  imports: [HttpModule],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalIntegrationModule {}
```

### Utility Package

For shared utilities and helpers:

```typescript
// src/utils/validation.utils.ts
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone);
  }
}

// src/formatters/date.formatter.ts
export class DateFormatter {
  static toRussianFormat(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU').format(date);
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }
}
```

## Integration with Existing Packages

### Adding to Use Cases

If your package provides services that need to be used by the use-cases layer:

```typescript
// In packages/use-cases/src/use-cases.module.ts
import { YourPackageModule } from '@cuis/your-package';

@Module({
  imports: [YourPackageModule],
  providers: [
    // existing services
  ],
  exports: [
    // existing exports
  ],
})
export class UseCasesModule {}
```

### Adding to API

If your package needs API endpoints:

```typescript
// Create controller in packages/api/src/your-endpoints/
@ApiTags('your-endpoints')
@Controller('your-endpoints')
export class YourController {
  constructor(private readonly yourService: YourService) {}
  
  @Get()
  @ApiOperation({ summary: 'Get your data' })
  async findAll() {
    return await this.yourService.findAll();
  }
}

// Add to packages/api/src/api.module.ts
import { YourController } from './your-endpoints/your.controller';

@Module({
  controllers: [
    // existing controllers
    YourController,
  ],
})
export class ApiModule {}
```

### Adding to Frontend

If your package requires frontend components:

```typescript
// Create components in packages/frontend/src/components/YourFeature/
// Create API client in packages/frontend/src/api/your-feature.ts
// Add routes to packages/frontend/src/App.tsx
```

## Best Practices

### Package Naming

- Use descriptive, kebab-case names
- Prefix with organization scope: `@cuis/package-name`
- Avoid generic names like "utils" or "helpers"

### Dependency Management

- **Domain packages**: Should have minimal dependencies
- **Infrastructure packages**: Can depend on external libraries
- **Keep peer dependencies**: Use peerDependencies for framework libraries

### Documentation

- Include comprehensive README.md in each package
- Document public APIs with JSDoc comments
- Provide usage examples
- List breaking changes in changelogs

### Testing

- Write unit tests for core functionality
- Include integration tests for external dependencies
- Maintain high test coverage (>80%)

### Versioning

- Follow semantic versioning (semver)
- Update version in package.json
- Document breaking changes
- Coordinate version updates across dependent packages

## Common Patterns

### Service Implementation Pattern

```typescript
@Injectable()
export class YourService implements YourServicePort {
  constructor(
    private readonly repository: YourRepositoryPort,
    private readonly logger: Logger
  ) {}

  async performBusinessOperation(data: OperationData): Promise<Result> {
    this.logger.log('Starting business operation');
    
    try {
      // Validate input
      this.validateInput(data);
      
      // Create domain entity
      const entity = new YourEntity(data);
      
      // Apply business rules
      entity.applyBusinessRule();
      
      // Persist
      const result = await this.repository.save(entity);
      
      this.logger.log('Business operation completed successfully');
      return result;
    } catch (error) {
      this.logger.error('Business operation failed', error);
      throw error;
    }
  }
}
```

### Repository Implementation Pattern

```typescript
@Injectable()
export class YourRepository implements YourRepositoryPort {
  private readonly tableName = 'your_table';
  
  constructor(private readonly db: DatabaseService) {}

  async create(entity: YourEntity): Promise<YourEntity> {
    const dbData = this.mapToDatabase(entity);
    const [result] = await this.db.knex(this.tableName)
      .insert(dbData)
      .returning('*');
    return this.mapToDomain(result);
  }

  private mapToDatabase(entity: YourEntity): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  private mapToDomain(row: any): YourEntity {
    return new YourEntity({
      id: row.id,
      name: row.name,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
```

This guide provides everything needed to create and integrate new packages into the CUIS monorepo architecture while maintaining consistency and best practices.