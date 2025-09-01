# Module Creation Guide

This guide explains how to create new modules in the Reki codebase, following the established clean architecture patterns.

## Overview

CUIS follows a modular architecture based on Clean Architecture and Domain-Driven Design (DDD) principles. Each business feature is implemented as a module that spans across multiple layers:

- **Domain** - Business models and interfaces
- **Persistence** - Data access layer
- **Use Cases** - Business logic
- **API** - REST endpoints and DTOs

## Module Structure

When creating a new module (e.g., "Patient"), you'll need to create files across multiple packages:

```
packages/
├── domain/src/
│   ├── models/patient.model.ts
│   ├── ports/patient-repository.port.ts
│   └── tokens.ts (add PATIENT_REPOSITORY)
├── persistence/src/
│   └── repositories/patient.repository.ts
├── use-cases/src/
│   └── services/patient.service.ts
├── api/src/
│   ├── patients/
│   │   ├── dto/patient.dto.ts
│   │   ├── patients.controller.ts
│   │   └── patients.module.ts
│   └── index.ts (export module)
```

## Choosing a Repository Pattern

The codebase currently uses two patterns for repository ports:

### Pattern 1: Interface with Dependency Injection Tokens
- **Used by**: Device, Client modules
- **Benefits**: Better testability, clearer dependencies
- **When to use**: For new modules, recommended approach

### Pattern 2: Abstract Class with Direct Injection  
- **Used by**: Form, FormEntry modules
- **Benefits**: Simpler setup, no token configuration needed
- **When to use**: When you need transaction support or want simpler configuration

**Recommendation**: Use **Pattern 1** for new modules unless you specifically need the transaction support pattern from Pattern 2.

## Step-by-Step Module Creation

### 1. Domain Layer

#### A. Create Domain Model (`packages/domain/src/models/{entity}.model.ts`)

```typescript
export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCHARGED = 'DISCHARGED',
}

export class Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  status: PatientStatus;
  phoneNumber?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Patient>) {
    Object.assign(this, data);
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.status = data.status || PatientStatus.ACTIVE;
  }

  // Business methods
  discharge(): void {
    this.status = PatientStatus.DISCHARGED;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === PatientStatus.ACTIVE;
  }
}
```

#### B. Create Repository Port (`packages/domain/src/ports/{entity}-repository.port.ts`)

**Note**: The codebase uses two patterns for repository ports. Choose the appropriate one:

**Pattern 1: Interface with Dependency Injection Tokens** (Device/Client pattern)
```typescript
import { Patient, PatientStatus } from '../models/patient.model';
import { PaginationOptions, PaginatedResult } from './device-repository.port';

export interface PatientRepositoryPort {
  // Basic CRUD operations
  create(patient: Patient): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Patient>>;
  update(id: string, patient: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<void>;
  
  // Specific queries
  findByEmail(email: string): Promise<Patient | null>;
  findByStatus(status: PatientStatus, options?: PaginationOptions): Promise<PaginatedResult<Patient>>;
  
  // Query builder access for complex cases
  getQueryBuilder(): any;
}
```

**Pattern 2: Abstract Class with Direct Injection** (Form/FormEntry pattern)
```typescript
import { Knex } from 'knex';
import { Patient, PatientStatus } from '../models/patient.model';
import { PaginationOptions, PaginatedResult } from './device-repository.port';

/**
 * Repository interface for patient management
 */
export abstract class IPatientRepository {
  abstract create(patient: Patient, trx?: Knex.Transaction): Promise<Patient>;
  abstract findById(id: string, trx?: Knex.Transaction): Promise<Patient | null>;
  abstract findAll(options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<Patient>>;
  abstract findByEmail(email: string, trx?: Knex.Transaction): Promise<Patient | null>;
  abstract findByStatus(status: PatientStatus, trx?: Knex.Transaction): Promise<PaginatedResult<Patient>>;
  abstract update(id: string, patient: Partial<Patient>, trx?: Knex.Transaction): Promise<Patient>;
  abstract delete(id: string, trx?: Knex.Transaction): Promise<boolean>;
}
```

#### C. Add Dependency Injection Token (`packages/domain/src/tokens.ts`)

**Only needed for Pattern 1 (Interface with DI Tokens)**

```typescript
// Add to existing tokens
export const PATIENT_REPOSITORY = 'PATIENT_REPOSITORY';
```

#### D. Update Domain Exports (`packages/domain/src/index.ts`)

```typescript
// Add to existing exports
export * from './models/patient.model';
export * from './ports/patient-repository.port';
```

### 2. Persistence Layer

#### Create Repository Implementation (`packages/persistence/src/repositories/{entity}.repository.ts`)

**Pattern 1: Interface Implementation** (Device/Client pattern)
```typescript
import { Injectable } from '@nestjs/common';
import { Patient, PatientStatus, PatientRepositoryPort, PaginationOptions, PaginatedResult } from '@reki/domain';
import { DatabaseService } from '../database/database.service';
import { objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class PatientRepository implements PatientRepositoryPort {
  private readonly tableName = 'patients';
  private readonly fieldMappings: Record<string, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    dateOfBirth: 'date_of_birth',
    phoneNumber: 'phone_number',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private readonly db: DatabaseService) {}

  async create(patient: Patient): Promise<Patient> {
    const dbData = objectCamelToSnake(patient, this.fieldMappings);
    const [result] = await this.db.knex(this.tableName)
      .insert(dbData)
      .returning('*');
    
    return this.mapToPatient(result);
  }

  async findById(id: string): Promise<Patient | null> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .first();
    
    return result ? this.mapToPatient(result) : null;
  }

  getQueryBuilder(): any {
    return this.db.knex(this.tableName);
  }

  // ... implement other methods

  private mapToPatient(dbRow: any): Patient {
    const patientData = objectSnakeToCamel(dbRow, this.fieldMappings);
    return new Patient(patientData);
  }
}
```

**Pattern 2: Abstract Class Implementation** (Form/FormEntry pattern)
```typescript
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Patient, PatientStatus, IPatientRepository, PaginationOptions, PaginatedResult } from '@reki/domain';
import { DatabaseService } from '../database/database.service';
import { objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class PatientRepository implements IPatientRepository {
  private readonly tableName = 'patients';
  private readonly fieldMappings: Record<string, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    dateOfBirth: 'date_of_birth',
    phoneNumber: 'phone_number',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private readonly db: DatabaseService) {}

  async create(patient: Patient, trx?: Knex.Transaction): Promise<Patient> {
    const dbData = objectCamelToSnake(patient, this.fieldMappings);
    const query = trx ? trx(this.tableName) : this.db.knex(this.tableName);
    const [result] = await query
      .insert(dbData)
      .returning('*');
    
    return this.mapToPatient(result);
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<Patient | null> {
    const query = trx ? trx(this.tableName) : this.db.knex(this.tableName);
    const result = await query.where({ id }).first();
    
    return result ? this.mapToPatient(result) : null;
  }

  // ... implement other methods

  private mapToPatient(dbRow: any): Patient {
    const patientData = objectSnakeToCamel(dbRow, this.fieldMappings);
    return new Patient(patientData);
  }
}
```

#### Update Persistence Module (`packages/persistence/src/persistence.module.ts`)

```typescript
// Add to imports
import { PatientRepository } from './repositories/patient.repository';

// Add to providers and exports arrays
PatientRepository,
```

### 3. Use Cases Layer

#### Create Service (`packages/use-cases/src/services/{entity}.service.ts`)

**Pattern 1: Using Dependency Injection Tokens** (Device/Client pattern)
```typescript
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { 
  Patient, 
  PatientStatus, 
  PatientRepositoryPort, 
  PaginationOptions, 
  PaginatedResult,
  PATIENT_REPOSITORY
} from '@reki/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepositoryPort
  ) {}

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const patient = new Patient({
      id: uuidv4(),
      status: PatientStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...patientData,
    });

    return this.patientRepository.create(patient);
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async getAllPatients(options: PaginationOptions = {}): Promise<PaginatedResult<Patient>> {
    return this.patientRepository.findAll(options);
  }

  async updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient> {
    const existingPatient = await this.getPatientById(id);
    
    const updatedPatient = new Patient({
      ...existingPatient,
      ...updateData,
      updatedAt: new Date(),
    });

    return this.patientRepository.update(id, updatedPatient);
  }

  async deletePatient(id: string): Promise<void> {
    await this.getPatientById(id); // Ensure patient exists
    await this.patientRepository.delete(id);
  }

  // Add other business logic methods as needed
}
```

**Pattern 2: Direct Abstract Class Injection** (Form/FormEntry pattern)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  Patient, 
  PatientStatus, 
  IPatientRepository,
  PaginationOptions, 
  PaginatedResult
} from '@reki/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const patient = new Patient({
      id: uuidv4(),
      status: PatientStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...patientData,
    });

    return this.patientRepository.create(patient);
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async getAllPatients(options: PaginationOptions = {}): Promise<PaginatedResult<Patient>> {
    return this.patientRepository.findAll(options);
  }

  async updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient> {
    const existingPatient = await this.getPatientById(id);
    
    const updatedPatient = new Patient({
      ...existingPatient,
      ...updateData,
      updatedAt: new Date(),
    });

    return this.patientRepository.update(id, updatedPatient);
  }

  async deletePatient(id: string): Promise<void> {
    await this.getPatientById(id); // Ensure patient exists
    await this.patientRepository.delete(id);
  }

  // Add other business logic methods as needed
}
```

#### Update Use Cases Module (`packages/use-cases/src/use-cases.module.ts`)

```typescript
// Add to imports
import { PatientService } from './services/patient.service';

// Add to providers and exports arrays
PatientService,
```

### 4. API Layer

#### A. Create DTOs (`packages/api/src/{entities}/dto/{entity}.dto.ts`)

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsEmail } from 'class-validator';

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCHARGED = 'DISCHARGED',
}

export class CreatePatientDto {
  @ApiProperty({
    description: 'Patient first name',
    example: 'John',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Patient last name', 
    example: 'Doe',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
  })
  @IsDateString()
  dateOfBirth!: string;

  @ApiPropertyOptional({
    description: 'Patient status',
    enum: PatientStatus,
    default: PatientStatus.ACTIVE,
  })
  @IsEnum(PatientStatus)
  @IsOptional()
  status?: PatientStatus;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdatePatientDto {
  @ApiPropertyOptional({
    description: 'Patient first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Patient last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Patient status',
    enum: PatientStatus,
  })
  @IsEnum(PatientStatus)
  @IsOptional()
  status?: PatientStatus;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class PatientResponseDto {
  @ApiProperty({ description: 'Patient ID' })
  id!: string;

  @ApiProperty({ description: 'Patient first name' })
  firstName!: string;

  @ApiProperty({ description: 'Patient last name' })
  lastName!: string;

  @ApiProperty({ description: 'Date of birth' })
  dateOfBirth!: Date;

  @ApiProperty({ description: 'Patient status', enum: PatientStatus })
  status!: PatientStatus;

  @ApiPropertyOptional({ description: 'Phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  email?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
```

#### B. Create Controller (`packages/api/src/{entities}/{entities}.controller.ts`)

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PatientService } from '@reki/use-cases';
import { CreatePatientDto, UpdatePatientDto, PatientResponseDto } from './dto/patient.dto';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully', type: PatientResponseDto })
  async createPatient(@Body() createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient found', type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatient(@Param('id', ParseUUIDPipe) id: string): Promise<PatientResponseDto> {
    return this.patientService.getPatientById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PatientStatus })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  async getPatients(@Query() query: any) {
    return this.patientService.getAllPatients(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully', type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async updatePatient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto
  ): Promise<PatientResponseDto> {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete patient' })
  @ApiResponse({ status: 204, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async deletePatient(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.patientService.deletePatient(id);
  }
}
```

#### C. Create API Module (`packages/api/src/{entities}/{entities}.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';

@Module({
  controllers: [PatientsController],
})
export class PatientsModule {}
```

#### D. Update API Index (`packages/api/src/index.ts`)

```typescript
// Add to existing exports
export * from './patients/patients.module';
```

### 5. Wire Everything Together

#### A. Update Main API Module (`packages/api/src/api.module.ts`)

```typescript
// Add to imports
import { PatientsModule } from './patients/patients.module';

// Add to imports array
PatientsModule,
```

#### B. Configure Dependency Injection

**For Pattern 1 (Interface with DI Tokens)**: 

1. Update `packages/api-server/src/providers.ts`:
```typescript
// Add to imports
import { PATIENT_REPOSITORY } from '@reki/domain';
import { PatientRepository } from '@reki/persistence';

// Add to providers array
{
  provide: PATIENT_REPOSITORY,
  useExisting: PatientRepository,
},
```

2. **Important**: Ensure providers are registered in a module. The providers may need to be imported in `packages/api-server/src/app.module.ts`:
```typescript
import { providers } from './providers';

@Module({
  // ... existing configuration
  providers: [...providers],
})
export class AppModule {}
```

**Note**: There appears to be an issue in the current codebase where `providers.ts` exists but isn't imported anywhere. This may need to be fixed for Pattern 1 to work properly.

**For Pattern 2 (Abstract Class)**: No additional configuration needed - direct injection works automatically.

### 6. Database Migration

Create database table for your entity:

```sql
-- Create migration file in your database migration system
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  phone_number VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes as needed
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_email ON patients(email);
```

## Architecture Notes

### Pattern Inconsistency in Current Codebase

The codebase currently uses two different patterns for repository dependency injection:

1. **Device/Client modules**: Use interfaces with dependency injection tokens
2. **Form/FormEntry modules**: Use abstract classes with direct injection

This inconsistency may cause confusion. For new modules, we recommend:
- **Use Pattern 1** (Interface with DI tokens) for better testability and consistency
- Consider refactoring existing Form/FormEntry modules to use Pattern 1 in the future

### Current Issue

The `packages/api-server/src/providers.ts` file exists but isn't imported in any module, which means Pattern 1 dependency injection may not be working correctly. This should be addressed by importing the providers in the main application module.

## Best Practices

### 1. Naming Conventions

- **Models**: PascalCase, singular (e.g., `Patient`, `Device`)
- **Files**: kebab-case (e.g., `patient.model.ts`, `patient-repository.port.ts`)
- **Services**: PascalCase with "Service" suffix (e.g., `PatientService`)
- **Controllers**: PascalCase with "Controller" suffix (e.g., `PatientsController`)
- **Modules**: PascalCase with "Module" suffix (e.g., `PatientsModule`)

### 2. Package Dependencies

Follow the dependency flow:
```
API → Use Cases → Domain ← Persistence
```

- **Domain** has no dependencies on other packages
- **Persistence** depends only on Domain
- **Use Cases** depends only on Domain
- **API** depends on Use Cases and Domain

### 3. Error Handling

- Use NestJS built-in exceptions in services
- Implement proper validation in DTOs
- Return meaningful error messages

### 4. Testing

Create tests for each layer:
- `{entity}.model.spec.ts` - Domain model tests
- `{entity}.repository.spec.ts` - Repository tests
- `{entity}.service.spec.ts` - Service tests
- `{entity}.controller.spec.ts` - Controller tests

### 5. Documentation

- Add JSDoc comments to public methods
- Use Swagger decorators for API documentation
- Update this guide when adding new patterns

## Example: Adding a New "Patient" Module

Here's a complete checklist for adding a new Patient module:

### Checklist

#### Core Steps (Required for all modules)
- [ ] **Domain Model**: Create `packages/domain/src/models/patient.model.ts`
- [ ] **Repository Port**: Create `packages/domain/src/ports/patient-repository.port.ts` OR `i-patient-repository.ts`
- [ ] **Domain Exports**: Update `packages/domain/src/index.ts`
- [ ] **Repository Implementation**: Create `packages/persistence/src/repositories/patient.repository.ts`
- [ ] **Persistence Module**: Update `packages/persistence/src/persistence.module.ts`
- [ ] **Service**: Create `packages/use-cases/src/services/patient.service.ts`
- [ ] **Use Cases Module**: Update `packages/use-cases/src/use-cases.module.ts`
- [ ] **DTOs**: Create `packages/api/src/patients/dto/patient.dto.ts`
- [ ] **Controller**: Create `packages/api/src/patients/patients.controller.ts`
- [ ] **API Module**: Create `packages/api/src/patients/patients.module.ts`
- [ ] **API Exports**: Update `packages/api/src/index.ts`
- [ ] **Wire Module**: Update main `api.module.ts`
- [ ] **Database Migration**: Create database table
- [ ] **Tests**: Create unit tests for all layers
- [ ] **API Documentation**: Ensure Swagger docs are complete

#### Additional Steps for Pattern 1 (Interface with DI Tokens)
- [ ] **Dependency Token**: Add `PATIENT_REPOSITORY` to `packages/domain/src/tokens.ts`
- [ ] **Configure DI**: Update `packages/api-server/src/providers.ts`

#### Pattern 2 (Abstract Class) - No additional steps needed

## Common Patterns

### 1. Repository Implementation Template

All repositories should:
- Implement their corresponding port interface
- Use `DatabaseService` for database access
- Include field mappings for camelCase ↔ snake_case conversion
- Implement pagination support
- Include a private `mapTo{Entity}` method

### 2. Service Implementation Template

All services should:
- Inject repository via dependency injection token
- Generate UUIDs for new entities
- Handle business logic and validation
- Throw meaningful exceptions
- Use domain model methods for business operations

### 3. Controller Implementation Template

All controllers should:
- Use appropriate HTTP methods and status codes
- Include Swagger documentation
- Validate input with DTOs
- Handle query parameters for pagination
- Follow RESTful conventions

### 4. DTO Patterns

- **CreateDto**: Required fields for entity creation
- **UpdateDto**: All fields optional for partial updates
- **ResponseDto**: Complete entity data for responses
- Use class-validator decorators for validation
- Include Swagger decorators for documentation

## Module Dependencies

When creating a new module, ensure proper dependency management:

1. **Domain package**: Add any new dependencies to `packages/domain/package.json`
2. **Cross-package imports**: Use the `@reki/{package}` namespace
3. **TypeScript configuration**: Each package has its own `tsconfig.json`

## Testing Your Module

After creating your module:

1. **Build all packages**: `npm run build`
2. **Run tests**: `npm run test`
3. **Start API server**: `npm run api:dev`
4. **Check Swagger docs**: Visit `http://localhost:3002/api/docs`
5. **Test endpoints**: Use API testing tools or the Swagger UI

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure you're using the correct `@reki/{package}` imports
2. **Dependency injection**: For Pattern 1, verify tokens are properly configured in `packages/api-server/src/providers.ts`
3. **Database errors**: Check table names and field mappings in repository
4. **Validation errors**: Ensure DTOs have proper decorators
5. **Pattern mismatch**: Ensure you're consistently using either Pattern 1 or Pattern 2 throughout your module

### Module Registration

Ensure your module is properly registered in:
- `packages/persistence/src/persistence.module.ts` (repository)
- `packages/use-cases/src/use-cases.module.ts` (service)
- `packages/api/src/api.module.ts` (controller module)
- `packages/api-server/src/providers.ts` (dependency injection, Pattern 1 only)

## Additional Resources

- [Clean Architecture Documentation](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)

## Questions?

If you have questions about module creation or need clarification on any patterns, refer to existing modules like `Device`, `Client`, `Form`, or `FormEntry` as reference implementations.