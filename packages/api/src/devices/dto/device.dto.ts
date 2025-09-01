import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsObject } from 'class-validator';

export enum DeviceStatus {
  REGISTERED = 'REGISTERED',
  IN_STOCK = 'IN_STOCK',
  AT_CLINIC = 'AT_CLINIC',
  AT_PATIENT_HOME = 'AT_PATIENT_HOME',
  UNDER_SERVICE = 'UNDER_SERVICE',
  RMA = 'RMA',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Device serial number',
    example: 'DEV-001-2024',
  })
  @IsString()
  serial!: string;

  @ApiPropertyOptional({
    description: 'QR code for the device',
    example: 'QR-DEV001',
  })
  @IsString()
  @IsOptional()
  qrCode?: string;

  @ApiPropertyOptional({
    description: 'External IDs for the device',
    example: { vendorId: 'V123', legacyId: 'L456' },
  })
  @IsObject()
  @IsOptional()
  externalIds?: Record<string, string>;

  @ApiProperty({
    description: 'Device model',
    example: 'Model X1',
  })
  @IsString()
  model!: string;

  @ApiPropertyOptional({
    description: 'Hardware revision',
    example: 'v1.0',
  })
  @IsString()
  @IsOptional()
  hardwareRevision?: string;

  @ApiPropertyOptional({
    description: 'Firmware version',
    example: '1.2.3',
  })
  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @ApiPropertyOptional({
    description: 'Device status',
    enum: DeviceStatus,
    default: DeviceStatus.REGISTERED,
  })
  @IsEnum(DeviceStatus)
  @IsOptional()
  status?: DeviceStatus;

  @ApiPropertyOptional({
    description: 'Current device location',
    example: 'Main Lab',
  })
  @IsString()
  @IsOptional()
  currentLocation?: string;

  @ApiPropertyOptional({
    description: 'Clinic ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  clinicId?: string;

  @ApiPropertyOptional({
    description: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Assigned patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  assignedPatientId?: string;

  @ApiPropertyOptional({
    description: 'Responsible user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  responsibleUserId?: string;

  @ApiPropertyOptional({
    description: 'Warranty until date',
    example: '2025-12-31T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  warrantyUntil?: string;

  @ApiPropertyOptional({
    description: 'Purchase order number',
    example: 'PO-2023-001',
  })
  @IsString()
  @IsOptional()
  purchaseOrder?: string;

  @ApiPropertyOptional({
    description: 'Telemetry endpoint',
    example: 'https://api.example.com/telemetry',
  })
  @IsString()
  @IsOptional()
  telemetryEndpoint?: string;

  @ApiPropertyOptional({
    description: 'Maintenance notes',
    example: { lastCheck: '2023-06-15', notes: 'All systems operational' },
  })
  @IsObject()
  @IsOptional()
  maintenanceNotes?: Record<string, any>;
}

export class UpdateDeviceDto extends CreateDeviceDto {
  // Все поля наследуются от CreateDeviceDto и становятся опциональными
}

export class DeviceResponseDto {
  @ApiProperty({
    description: 'Device ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Device serial number',
    example: 'DEV-001-2024',
  })
  serial!: string;

  @ApiPropertyOptional({
    description: 'QR code for the device',
    example: 'QR-DEV001',
  })
  qrCode?: string;

  @ApiPropertyOptional({
    description: 'External IDs for the device',
    example: { vendorId: 'V123', legacyId: 'L456' },
  })
  externalIds?: Record<string, string>;

  @ApiProperty({
    description: 'Device model',
    example: 'Model X1',
  })
  model!: string;

  @ApiPropertyOptional({
    description: 'Hardware revision',
    example: 'v1.0',
  })
  hardwareRevision?: string;

  @ApiPropertyOptional({
    description: 'Firmware version',
    example: '1.2.3',
  })
  firmwareVersion?: string;

  @ApiProperty({
    description: 'Device status',
    enum: DeviceStatus,
  })
  status!: DeviceStatus;

  @ApiPropertyOptional({
    description: 'Current device location',
    example: 'Main Lab',
  })
  currentLocation?: string;

  @ApiPropertyOptional({
    description: 'Clinic ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  clinicId?: string;

  @ApiPropertyOptional({
    description: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Assigned patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assignedPatientId?: string;

  @ApiPropertyOptional({
    description: 'Responsible user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  responsibleUserId?: string;

  @ApiPropertyOptional({
    description: 'Warranty until date',
    example: '2025-12-31T00:00:00Z',
  })
  warrantyUntil?: Date;

  @ApiPropertyOptional({
    description: 'Purchase order number',
    example: 'PO-2023-001',
  })
  purchaseOrder?: string;

  @ApiPropertyOptional({
    description: 'Last seen date',
    example: '2023-06-15T10:30:00Z',
  })
  lastSeenAt?: Date;

  @ApiPropertyOptional({
    description: 'Last sync date',
    example: '2023-06-15T10:30:00Z',
  })
  lastSyncAt?: Date;

  @ApiPropertyOptional({
    description: 'Telemetry endpoint',
    example: 'https://api.example.com/telemetry',
  })
  telemetryEndpoint?: string;

  @ApiPropertyOptional({
    description: 'Maintenance notes',
    example: { lastCheck: '2023-06-15', notes: 'All systems operational' },
  })
  maintenanceNotes?: Record<string, any>;

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
