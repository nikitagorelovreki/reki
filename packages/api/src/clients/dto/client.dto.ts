import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ClientStatus {
  INTAKE = 'intake',
  DIAGNOSTICS = 'diagnostics',
  ACTIVE_THERAPY = 'active_therapy',
  PAUSED = 'paused',
  DISCHARGED = 'discharged',
  FOLLOWUP = 'followup',
  ARCHIVED = 'archived',
}

export class CreateClientDto {
  @ApiProperty({
    description: 'Client full name',
    example: 'John Doe Smith',
  })
  @IsString()
  fullName!: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Smith',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Middle name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({
    description: 'Client diagnosis',
    example: 'Rehabilitation therapy post stroke',
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({
    description: 'Contact information',
    example: {
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
    },
  })
  @IsObject()
  @IsOptional()
  contacts?: Record<string, string | number>;

  @ApiPropertyOptional({
    description: 'Client status',
    enum: ClientStatus,
    default: ClientStatus.INTAKE,
  })
  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;

  @ApiPropertyOptional({
    description: 'Clinic ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  clinicId?: string;
}

export class UpdateClientDto extends CreateClientDto {
  // Все поля наследуются от CreateClientDto и становятся опциональными
}

export class ClientResponseDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Client full name',
    example: 'John Doe Smith',
  })
  fullName!: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Smith',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Middle name',
    example: 'Doe',
  })
  middleName?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-01T00:00:00Z',
  })
  dob?: Date;

  @ApiPropertyOptional({
    description: 'Client diagnosis',
    example: 'Rehabilitation therapy post stroke',
  })
  diagnosis?: string;

  @ApiPropertyOptional({
    description: 'Contact information',
    example: {
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
    },
  })
  contacts?: Record<string, string | number>;

  @ApiProperty({
    description: 'Client status',
    enum: ClientStatus,
  })
  status!: ClientStatus;

  @ApiPropertyOptional({
    description: 'Clinic ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  clinicId?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-06-15T10:30:00Z',
  })
  updatedAt!: Date;
}
