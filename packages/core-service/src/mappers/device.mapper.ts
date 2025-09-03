import { Injectable } from '@nestjs/common';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '@reki/core-domain';
import { ServiceDevice, ServiceCreateDeviceDto, ServiceUpdateDeviceDto } from '../models/device.model';

@Injectable()
export class DeviceMapper {
  mapDomainToService(device: Device): ServiceDevice {
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
      warrantyUntil: device.warrantyUntil?.toISOString(),
      purchaseOrder: device.purchaseOrder,
      lastSeenAt: device.lastSeenAt?.toISOString(),
      lastSyncAt: device.lastSyncAt?.toISOString(),
      telemetryEndpoint: device.telemetryEndpoint,
      maintenanceNotes: device.maintenanceNotes,
      createdAt: device.createdAt.toISOString(),
      updatedAt: device.updatedAt.toISOString(),
    };
  }

  mapServiceToDomainCreate(serviceDto: ServiceCreateDeviceDto): CreateDeviceDto {
    return {
      serial: serviceDto.serial,
      qrCode: serviceDto.qrCode,
      externalIds: serviceDto.externalIds,
      model: serviceDto.model,
      hardwareRevision: serviceDto.hardwareRevision,
      firmwareVersion: serviceDto.firmwareVersion,
      status: serviceDto.status as any, // Map to domain enum
      currentLocation: serviceDto.currentLocation,
      clinicId: serviceDto.clinicId,
      ownerId: serviceDto.ownerId,
      assignedPatientId: serviceDto.assignedPatientId,
      responsibleUserId: serviceDto.responsibleUserId,
      warrantyUntil: serviceDto.warrantyUntil ? new Date(serviceDto.warrantyUntil) : undefined,
      purchaseOrder: serviceDto.purchaseOrder,
      telemetryEndpoint: serviceDto.telemetryEndpoint,
      maintenanceNotes: serviceDto.maintenanceNotes,
    };
  }

  mapServiceToDomainUpdate(serviceDto: ServiceUpdateDeviceDto): UpdateDeviceDto {
    return {
      qrCode: serviceDto.qrCode,
      externalIds: serviceDto.externalIds,
      model: serviceDto.model,
      hardwareRevision: serviceDto.hardwareRevision,
      firmwareVersion: serviceDto.firmwareVersion,
      status: serviceDto.status as any, // Map to domain enum
      currentLocation: serviceDto.currentLocation,
      clinicId: serviceDto.clinicId,
      ownerId: serviceDto.ownerId,
      assignedPatientId: serviceDto.assignedPatientId,
      responsibleUserId: serviceDto.responsibleUserId,
      warrantyUntil: serviceDto.warrantyUntil ? new Date(serviceDto.warrantyUntil) : undefined,
      purchaseOrder: serviceDto.purchaseOrder,
      telemetryEndpoint: serviceDto.telemetryEndpoint,
      maintenanceNotes: serviceDto.maintenanceNotes,
    };
  }
}
