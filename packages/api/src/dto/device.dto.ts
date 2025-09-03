import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

// ===== DEVICE MODELS =====

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
  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @ApiPropertyOptional({
    description: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Assigned patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  assignedPatientId?: string;

  @ApiPropertyOptional({
    description: 'Responsible user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  responsibleUserId?: string;

  @ApiPropertyOptional({
    description: 'Warranty until date',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  warrantyUntil?: string;

  @ApiPropertyOptional({
    description: 'Purchase order',
    example: 'PO-2024-001',
  })
  @IsString()
  @IsOptional()
  purchaseOrder?: string;

  @ApiPropertyOptional({
    description: 'Telemetry endpoint',
    example: 'https://telemetry.example.com',
  })
  @IsString()
  @IsOptional()
  telemetryEndpoint?: string;

  @ApiPropertyOptional({
    description: 'Maintenance notes',
    example: { lastService: '2024-01-15', notes: 'Regular maintenance' },
  })
  @IsObject()
  @IsOptional()
  maintenanceNotes?: Record<string, any>;
}

export class UpdateDeviceDto {
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

  @ApiPropertyOptional({
    description: 'Device model',
    example: 'Model X1',
  })
  @IsString()
  @IsOptional()
  model?: string;

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
  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @ApiPropertyOptional({
    description: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Assigned patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  assignedPatientId?: string;

  @ApiPropertyOptional({
    description: 'Responsible user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  responsibleUserId?: string;

  @ApiPropertyOptional({
    description: 'Warranty until date',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  warrantyUntil?: string;

  @ApiPropertyOptional({
    description: 'Purchase order',
    example: 'PO-2024-001',
  })
  @IsString()
  @IsOptional()
  purchaseOrder?: string;

  @ApiPropertyOptional({
    description: 'Telemetry endpoint',
    example: 'https://telemetry.example.com',
  })
  @IsString()
  @IsOptional()
  telemetryEndpoint?: string;

  @ApiPropertyOptional({
    description: 'Maintenance notes',
    example: { lastService: '2024-01-15', notes: 'Regular maintenance' },
  })
  @IsObject()
  @IsOptional()
  maintenanceNotes?: Record<string, any>;
}

export class DeviceDto {
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
    example: '2025-12-31',
  })
  warrantyUntil?: string;

  @ApiPropertyOptional({
    description: 'Purchase order',
    example: 'PO-2024-001',
  })
  purchaseOrder?: string;

  @ApiPropertyOptional({
    description: 'Last seen at',
    example: '2024-01-15T10:30:00Z',
  })
  lastSeenAt?: string;

  @ApiPropertyOptional({
    description: 'Last sync at',
    example: '2024-01-15T10:30:00Z',
  })
  lastSyncAt?: string;

  @ApiPropertyOptional({
    description: 'Telemetry endpoint',
    example: 'https://telemetry.example.com',
  })
  telemetryEndpoint?: string;

  @ApiPropertyOptional({
    description: 'Maintenance notes',
    example: { lastService: '2024-01-15', notes: 'Regular maintenance' },
  })
  maintenanceNotes?: Record<string, any>;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt!: string;
}
