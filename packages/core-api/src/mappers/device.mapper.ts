import { Injectable } from '@nestjs/common';
import { ServiceDevice, ServiceCreateDeviceDto, ServiceUpdateDeviceDto } from '@reki/core-service';
import { CreateDeviceDto, UpdateDeviceDto, DeviceDto, DeviceStatus } from '../dto/device.dto';

@Injectable()
export class DeviceMapper {
  mapServiceToApiDto(serviceDevice: ServiceDevice): DeviceDto {
    return {
      id: serviceDevice.id,
      serial: serviceDevice.serial,
      qrCode: serviceDevice.qrCode,
      externalIds: serviceDevice.externalIds,
      model: serviceDevice.model,
      hardwareRevision: serviceDevice.hardwareRevision,
      firmwareVersion: serviceDevice.firmwareVersion,
      status: serviceDevice.status as DeviceStatus,
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

  mapApiToServiceDto(apiDto: CreateDeviceDto): ServiceCreateDeviceDto {
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

  mapApiToServiceUpdateDto(apiDto: UpdateDeviceDto): ServiceUpdateDeviceDto {
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
}
