"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedDevicesResponseDto = exports.DeviceDto = exports.UpdateDeviceDto = exports.CreateDeviceDto = exports.DeviceStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DeviceStatus;
(function (DeviceStatus) {
    DeviceStatus["REGISTERED"] = "REGISTERED";
    DeviceStatus["IN_STOCK"] = "IN_STOCK";
    DeviceStatus["AT_CLINIC"] = "AT_CLINIC";
    DeviceStatus["AT_PATIENT_HOME"] = "AT_PATIENT_HOME";
    DeviceStatus["UNDER_SERVICE"] = "UNDER_SERVICE";
    DeviceStatus["RMA"] = "RMA";
    DeviceStatus["DECOMMISSIONED"] = "DECOMMISSIONED";
})(DeviceStatus || (exports.DeviceStatus = DeviceStatus = {}));
class CreateDeviceDto {
}
exports.CreateDeviceDto = CreateDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device serial number',
        example: 'DEV-001-2024',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "serial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'QR code for the device',
        example: 'QR-DEV001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'External IDs for the device',
        example: { vendorId: 'V123', legacyId: 'L456' },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDeviceDto.prototype, "externalIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device model',
        example: 'Model X1',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hardware revision',
        example: 'v1.0',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "hardwareRevision", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firmware version',
        example: '1.2.3',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "firmwareVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device status',
        enum: DeviceStatus,
        default: DeviceStatus.REGISTERED,
    }),
    (0, class_validator_1.IsEnum)(DeviceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current device location',
        example: 'Main Lab',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "currentLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinic ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Owner ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assigned patient ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "assignedPatientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Responsible user ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "responsibleUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty until date',
        example: '2025-12-31',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "warrantyUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purchase order',
        example: 'PO-2024-001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "purchaseOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telemetry endpoint',
        example: 'https://telemetry.example.com',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "telemetryEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maintenance notes',
        example: { lastService: '2024-01-15', notes: 'Regular maintenance' },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDeviceDto.prototype, "maintenanceNotes", void 0);
class UpdateDeviceDto {
}
exports.UpdateDeviceDto = UpdateDeviceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'QR code for the device',
        example: 'QR-DEV001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'External IDs for the device',
        example: { vendorId: 'V123', legacyId: 'L456' },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDeviceDto.prototype, "externalIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device model',
        example: 'Model X1',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hardware revision',
        example: 'v1.0',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "hardwareRevision", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firmware version',
        example: '1.2.3',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "firmwareVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device status',
        enum: DeviceStatus,
    }),
    (0, class_validator_1.IsEnum)(DeviceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current device location',
        example: 'Main Lab',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "currentLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinic ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Owner ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assigned patient ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "assignedPatientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Responsible user ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "responsibleUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty until date',
        example: '2025-12-31',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "warrantyUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purchase order',
        example: 'PO-2024-001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "purchaseOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telemetry endpoint',
        example: 'https://telemetry.example.com',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "telemetryEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maintenance notes',
        example: { lastService: '2024-01-15', notes: 'Regular maintenance' },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDeviceDto.prototype, "maintenanceNotes", void 0);
class DeviceDto {
}
exports.DeviceDto = DeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device serial number',
        example: 'DEV-001-2024',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "serial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'QR code for the device',
        example: 'QR-DEV001',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'External IDs for the device',
        example: { vendorId: 'V123', legacyId: 'L456' },
    }),
    __metadata("design:type", Object)
], DeviceDto.prototype, "externalIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device model',
        example: 'Model X1',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hardware revision',
        example: 'v1.0',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "hardwareRevision", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firmware version',
        example: '1.2.3',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "firmwareVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device status',
        enum: DeviceStatus,
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current device location',
        example: 'Main Lab',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "currentLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinic ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Owner ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assigned patient ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "assignedPatientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Responsible user ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "responsibleUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty until date',
        example: '2025-12-31',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "warrantyUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purchase order',
        example: 'PO-2024-001',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "purchaseOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last seen at',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "lastSeenAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last sync at',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "lastSyncAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telemetry endpoint',
        example: 'https://telemetry.example.com',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "telemetryEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maintenance notes',
        example: { lastService: '2024-01-15', notes: 'Regular maintenance' },
    }),
    __metadata("design:type", Object)
], DeviceDto.prototype, "maintenanceNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created at',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated at',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], DeviceDto.prototype, "updatedAt", void 0);
class PaginatedDevicesResponseDto {
}
exports.PaginatedDevicesResponseDto = PaginatedDevicesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of devices',
        type: [DeviceDto],
    }),
    __metadata("design:type", Array)
], PaginatedDevicesResponseDto.prototype, "devices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total count of devices',
        example: 100,
    }),
    __metadata("design:type", Number)
], PaginatedDevicesResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page',
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginatedDevicesResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginatedDevicesResponseDto.prototype, "limit", void 0);
