import { DeviceService } from '@reki/core-service';
import { DeviceDto, CreateDeviceDto, UpdateDeviceDto, PaginatedDevicesResponseDto } from '../dto/device.dto';
export declare class DevicesService {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    private mapToResponseDto;
    create(createDeviceDto: CreateDeviceDto): Promise<DeviceDto>;
    findAll(params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedDevicesResponseDto>;
    findById(id: string): Promise<DeviceDto | null>;
    findBySerial(serial: string): Promise<DeviceDto | null>;
    update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<DeviceDto | null>;
    delete(id: string): Promise<void>;
    findByClinic(clinicId: string, params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedDevicesResponseDto>;
    findByStatus(status: string, params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedDevicesResponseDto>;
}
