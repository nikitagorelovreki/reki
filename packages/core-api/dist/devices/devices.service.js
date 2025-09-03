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
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const core_service_1 = require("@reki/core-service");
let DevicesService = class DevicesService {
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    mapToResponseDto(device) {
        return {
            id: device.id,
            serial: device.serial,
            qrCode: device.qrCode,
            externalIds: device.externalIds,
            model: device.model,
            hardwareRevision: device.hardwareRevision,
            firmwareVersion: device.firmwareVersion,
            status: device.status,
            currentLocation: device.currentLocation,
            clinicId: device.clinicId,
            ownerId: device.ownerId,
            assignedPatientId: device.assignedPatientId,
            responsibleUserId: device.responsibleUserId,
            warrantyUntil: device.warrantyUntil ? new Date(device.warrantyUntil).toISOString() : undefined,
            purchaseOrder: device.purchaseOrder,
            lastSeenAt: device.lastSeenAt ? new Date(device.lastSeenAt).toISOString() : undefined,
            lastSyncAt: device.lastSyncAt ? new Date(device.lastSyncAt).toISOString() : undefined,
            telemetryEndpoint: device.telemetryEndpoint,
            maintenanceNotes: device.maintenanceNotes,
            createdAt: new Date(device.createdAt).toISOString(),
            updatedAt: new Date(device.updatedAt).toISOString(),
        };
    }
    async create(createDeviceDto) {
        const serviceDto = {
            serial: createDeviceDto.serial,
            qrCode: createDeviceDto.qrCode,
            externalIds: createDeviceDto.externalIds,
            model: createDeviceDto.model,
            hardwareRevision: createDeviceDto.hardwareRevision,
            firmwareVersion: createDeviceDto.firmwareVersion,
            status: createDeviceDto.status,
            currentLocation: createDeviceDto.currentLocation,
            clinicId: createDeviceDto.clinicId,
            ownerId: createDeviceDto.ownerId,
            assignedPatientId: createDeviceDto.assignedPatientId,
            responsibleUserId: createDeviceDto.responsibleUserId,
            warrantyUntil: createDeviceDto.warrantyUntil,
            purchaseOrder: createDeviceDto.purchaseOrder,
            telemetryEndpoint: createDeviceDto.telemetryEndpoint,
            maintenanceNotes: createDeviceDto.maintenanceNotes,
        };
        const device = await this.deviceService.create(serviceDto);
        return this.mapToResponseDto(device);
    }
    async findAll(params) {
        const { page = 1, limit = 10, } = params;
        const devices = await this.deviceService.findAll(page, limit);
        return {
            devices: devices.map((device) => this.mapToResponseDto(device)),
            total: devices.length,
            page,
            limit,
        };
    }
    async findById(id) {
        const device = await this.deviceService.findById(id);
        return device ? this.mapToResponseDto(device) : null;
    }
    async findBySerial(serial) {
        const device = await this.deviceService.findBySerial(serial);
        return device ? this.mapToResponseDto(device) : null;
    }
    async update(id, updateDeviceDto) {
        const serviceDto = {
            qrCode: updateDeviceDto.qrCode,
            externalIds: updateDeviceDto.externalIds,
            model: updateDeviceDto.model,
            hardwareRevision: updateDeviceDto.hardwareRevision,
            firmwareVersion: updateDeviceDto.firmwareVersion,
            status: updateDeviceDto.status,
            currentLocation: updateDeviceDto.currentLocation,
            clinicId: updateDeviceDto.clinicId,
            ownerId: updateDeviceDto.ownerId,
            assignedPatientId: updateDeviceDto.assignedPatientId,
            responsibleUserId: updateDeviceDto.responsibleUserId,
            warrantyUntil: updateDeviceDto.warrantyUntil,
            purchaseOrder: updateDeviceDto.purchaseOrder,
            telemetryEndpoint: updateDeviceDto.telemetryEndpoint,
            maintenanceNotes: updateDeviceDto.maintenanceNotes,
        };
        const device = await this.deviceService.update(id, serviceDto);
        return device ? this.mapToResponseDto(device) : null;
    }
    async delete(id) {
        return this.deviceService.delete(id);
    }
    async findByClinic(clinicId, params) {
        const { page = 1, limit = 10 } = params;
        const devices = await this.deviceService.findAll(page, limit);
        const filteredData = devices.filter((device) => device.clinicId === clinicId);
        return {
            devices: filteredData.map((device) => this.mapToResponseDto(device)),
            total: filteredData.length,
            page,
            limit,
        };
    }
    async findByStatus(status, params) {
        const { page = 1, limit = 10 } = params;
        const devices = await this.deviceService.findAll(page, limit);
        const filteredData = devices.filter((device) => device.status === status);
        return {
            devices: filteredData.map((device) => this.mapToResponseDto(device)),
            total: filteredData.length,
            page,
            limit,
        };
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_service_1.DeviceService])
], DevicesService);
