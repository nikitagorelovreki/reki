"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceMapper = void 0;
const common_1 = require("@nestjs/common");
let DeviceMapper = class DeviceMapper {
    mapServiceToApiDto(serviceDevice) {
        return {
            id: serviceDevice.id,
            serial: serviceDevice.serial,
            qrCode: serviceDevice.qrCode,
            externalIds: serviceDevice.externalIds,
            model: serviceDevice.model,
            hardwareRevision: serviceDevice.hardwareRevision,
            firmwareVersion: serviceDevice.firmwareVersion,
            status: serviceDevice.status,
            currentLocation: serviceDevice.currentLocation,
            clinicId: serviceDevice.clinicId,
            ownerId: serviceDevice.ownerId,
            assignedPatientId: serviceDevice.assignedPatientId,
            responsibleUserId: serviceDevice.responsibleUserId,
            warrantyUntil: serviceDevice.warrantyUntil ? new Date(serviceDevice.warrantyUntil).toISOString() : undefined,
            purchaseOrder: serviceDevice.purchaseOrder,
            lastSeenAt: serviceDevice.lastSeenAt ? new Date(serviceDevice.lastSeenAt).toISOString() : undefined,
            lastSyncAt: serviceDevice.lastSyncAt ? new Date(serviceDevice.lastSyncAt).toISOString() : undefined,
            telemetryEndpoint: serviceDevice.telemetryEndpoint,
            maintenanceNotes: serviceDevice.maintenanceNotes,
            createdAt: new Date(serviceDevice.createdAt).toISOString(),
            updatedAt: new Date(serviceDevice.updatedAt).toISOString(),
        };
    }
    mapApiToServiceDto(apiDto) {
        return {
            serial: apiDto.serial,
            qrCode: apiDto.qrCode,
            externalIds: apiDto.externalIds,
            model: apiDto.model,
            hardwareRevision: apiDto.hardwareRevision,
            firmwareVersion: apiDto.firmwareVersion,
            status: apiDto.status,
            currentLocation: apiDto.currentLocation,
            clinicId: apiDto.clinicId,
            ownerId: apiDto.ownerId,
            assignedPatientId: apiDto.assignedPatientId,
            responsibleUserId: apiDto.responsibleUserId,
            warrantyUntil: apiDto.warrantyUntil,
            purchaseOrder: apiDto.purchaseOrder,
            telemetryEndpoint: apiDto.telemetryEndpoint,
            maintenanceNotes: apiDto.maintenanceNotes,
        };
    }
    mapApiToServiceUpdateDto(apiDto) {
        return {
            qrCode: apiDto.qrCode,
            externalIds: apiDto.externalIds,
            model: apiDto.model,
            hardwareRevision: apiDto.hardwareRevision,
            firmwareVersion: apiDto.firmwareVersion,
            status: apiDto.status,
            currentLocation: apiDto.currentLocation,
            clinicId: apiDto.clinicId,
            ownerId: apiDto.ownerId,
            assignedPatientId: apiDto.assignedPatientId,
            responsibleUserId: apiDto.responsibleUserId,
            warrantyUntil: apiDto.warrantyUntil,
            purchaseOrder: apiDto.purchaseOrder,
            telemetryEndpoint: apiDto.telemetryEndpoint,
            maintenanceNotes: apiDto.maintenanceNotes,
        };
    }
};
exports.DeviceMapper = DeviceMapper;
exports.DeviceMapper = DeviceMapper = __decorate([
    (0, common_1.Injectable)()
], DeviceMapper);
