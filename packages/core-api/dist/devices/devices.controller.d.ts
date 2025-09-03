import { DeviceService } from '@reki/core-service';
import { DevicesService } from './devices.service';
import { CreateDeviceDto, DeviceDto, UpdateDeviceDto, PaginatedDevicesResponseDto } from '../dto/device.dto';
export declare class DevicesController {
    private readonly deviceService;
    private readonly devicesService;
    constructor(deviceService: DeviceService, devicesService: DevicesService);
    create(createDeviceDto: CreateDeviceDto): Promise<DeviceDto>;
    findAll(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc'): Promise<PaginatedDevicesResponseDto>;
    findByClinic(clinicId: string, page: number, limit: number): Promise<PaginatedDevicesResponseDto>;
    findByStatus(status: string, page: number, limit: number): Promise<PaginatedDevicesResponseDto>;
    findBySerial(serial: string): Promise<DeviceDto | null>;
    findOne(id: string): Promise<DeviceDto>;
    update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<DeviceDto | null>;
    remove(id: string): Promise<void>;
    assignToPatient(deviceId: string, patientId: string): Promise<DeviceDto>;
    unassignFromPatient(deviceId: string): Promise<DeviceDto>;
    updateStatus(deviceId: string, status: string): Promise<DeviceDto>;
}
