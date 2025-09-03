import { Injectable } from '@nestjs/common';
import { DeviceService } from '@reki/core-service';
import { ServiceDevice, ServiceCreateDeviceDto, ServiceUpdateDeviceDto } from '@reki/core-service';
import { 
  DeviceResponseDto, 
  CreateDeviceDto, 
  UpdateDeviceDto, 
  PaginatedDevicesResponseDto,
  DeviceStatus 
} from './dto/device.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly deviceService: DeviceService) {}

  private mapToResponseDto(device: ServiceDevice): DeviceResponseDto {
    return {
      id: device.id,
      serial: device.serial,
      qrCode: device.qrCode,
      externalIds: device.externalIds,
      model: device.model,
      hardwareRevision: device.hardwareRevision,
      firmwareVersion: device.firmwareVersion,
      status: device.status as DeviceStatus,
      currentLocation: device.currentLocation,
      clinicId: device.clinicId,
      ownerId: device.ownerId,
      assignedPatientId: device.assignedPatientId,
      responsibleUserId: device.responsibleUserId,
      warrantyUntil: device.warrantyUntil ? new Date(device.warrantyUntil) : undefined,
      purchaseOrder: device.purchaseOrder,
      lastSeenAt: device.lastSeenAt ? new Date(device.lastSeenAt) : undefined,
      lastSyncAt: device.lastSyncAt ? new Date(device.lastSyncAt) : undefined,
      telemetryEndpoint: device.telemetryEndpoint,
      maintenanceNotes: device.maintenanceNotes,
      createdAt: new Date(device.createdAt),
      updatedAt: new Date(device.updatedAt),
    };
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<DeviceResponseDto> {
    const serviceDto: ServiceCreateDeviceDto = {
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

  async findAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedDevicesResponseDto> {
    const {
      page = 1,
      limit = 10,
    } = params;

    const devices = await this.deviceService.findAll(page, limit);

    return {
      data: devices.map((device) => this.mapToResponseDto(device)),
      pagination: {
        page,
        limit,
        total: devices.length,
        totalPages: Math.ceil(devices.length / limit),
      },
    };
  }

  async findById(id: string): Promise<DeviceResponseDto | null> {
    const device = await this.deviceService.findById(id);
    return device ? this.mapToResponseDto(device) : null;
  }

  async findBySerial(serial: string): Promise<DeviceResponseDto | null> {
    const device = await this.deviceService.findBySerial(serial);
    return device ? this.mapToResponseDto(device) : null;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<DeviceResponseDto | null> {
    const serviceDto: ServiceUpdateDeviceDto = {
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

  async delete(id: string): Promise<void> {
    return this.deviceService.delete(id);
  }

  async findByClinic(
    clinicId: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedDevicesResponseDto> {
    const { page = 1, limit = 10 } = params;

    const devices = await this.deviceService.findAll(page, limit);

    // Фильтруем по клинике
    const filteredData = devices.filter(
      (device) => device.clinicId === clinicId
    );

    return {
      data: filteredData.map((device) => this.mapToResponseDto(device)),
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }

  async findByStatus(
    status: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedDevicesResponseDto> {
    const { page = 1, limit = 10 } = params;

    const devices = await this.deviceService.findAll(page, limit);

    // Фильтруем по статусу
    const filteredData = devices.filter(
      (device) => device.status === status
    );

    return {
      data: filteredData.map((device) => this.mapToResponseDto(device)),
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }
}
