import { ServiceDevice, ServiceCreateDeviceDto, ServiceUpdateDeviceDto } from '@reki/core-service';
import { CreateDeviceDto, UpdateDeviceDto, DeviceDto } from '../dto/device.dto';
export declare class DeviceMapper {
    mapServiceToApiDto(serviceDevice: ServiceDevice): DeviceDto;
    mapApiToServiceDto(apiDto: CreateDeviceDto): ServiceCreateDeviceDto;
    mapApiToServiceUpdateDto(apiDto: UpdateDeviceDto): ServiceUpdateDeviceDto;
}
