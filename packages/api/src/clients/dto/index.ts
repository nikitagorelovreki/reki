import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

// Определяем enum локально, чтобы не зависеть от домена
export enum ClientStatus {
  INTAKE = 'intake',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCHARGED = 'discharged',
}

export class CreateClientDto {
  @ApiProperty({ description: 'Client first name' })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: 'Client last name' })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({ description: 'Client middle name' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ description: 'Client date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Client email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Client diagnosis' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'Client status', enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ description: 'Clinic ID' })
  @IsOptional()
  @IsUUID()
  clinicId?: string;
}

export class UpdateClientDto {
  @ApiPropertyOptional({ description: 'Client first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Client last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Client middle name' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ description: 'Client date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Client email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Client diagnosis' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'Client status', enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ description: 'Clinic ID' })
  @IsOptional()
  @IsUUID()
  clinicId?: string;
}

export class ClientResponseDto {
  @ApiProperty({ description: 'Client ID' })
  id!: string;

  @ApiProperty({ description: 'Client first name' })
  firstName!: string;

  @ApiProperty({ description: 'Client last name' })
  lastName!: string;

  @ApiPropertyOptional({ description: 'Client middle name' })
  middleName?: string;

  @ApiPropertyOptional({ description: 'Client date of birth' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Client email' })
  email?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Client diagnosis' })
  diagnosis?: string;

  @ApiProperty({ description: 'Client status', enum: ClientStatus })
  status!: ClientStatus;

  @ApiPropertyOptional({ description: 'Clinic ID' })
  clinicId?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: string;
}

export class PaginatedClientsResponseDto {
  @ApiProperty({ type: [ClientResponseDto], description: 'List of clients' })
  data!: ClientResponseDto[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
