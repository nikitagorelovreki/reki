import { Injectable, Inject } from '@nestjs/common';
import { DeviceRepositoryPort, DEVICE_REPOSITORY_TOKEN } from '@reki/core-persistence';
import { ServiceDevice, ServiceCreateDeviceDto, ServiceUpdateDeviceDto } from '../models/device.model';
import { DeviceMapper } from '../mappers/device.mapper';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(DEVICE_REPOSITORY_TOKEN)
    private readonly deviceRepository: DeviceRepositoryPort,
    private readonly deviceMapper: DeviceMapper,
  ) {}

  async create(createDeviceDto: ServiceCreateDeviceDto): Promise<ServiceDevice> {
    const domainDto = this.deviceMapper.mapServiceToDomainCreate(createDeviceDto);
    const device = await this.deviceRepository.create(domainDto);
    return this.deviceMapper.mapDomainToService(device);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ServiceDevice[]> {
    const devices = await this.deviceRepository.findAll(page, limit);
    return devices.map(device => this.deviceMapper.mapDomainToService(device));
  }

  async findById(id: string): Promise<ServiceDevice | null> {
    const device = await this.deviceRepository.findById(id);
    return device ? this.deviceMapper.mapDomainToService(device) : null;
  }

  async findBySerial(serial: string): Promise<ServiceDevice | null> {
    const device = await this.deviceRepository.findBySerial(serial);
    return device ? this.deviceMapper.mapDomainToService(device) : null;
  }

  async update(id: string, updateDeviceDto: ServiceUpdateDeviceDto): Promise<ServiceDevice | null> {
    const domainDto = this.deviceMapper.mapServiceToDomainUpdate(updateDeviceDto);
    const device = await this.deviceRepository.update(id, domainDto);
    return device ? this.deviceMapper.mapDomainToService(device) : null;
  }

  async delete(id: string): Promise<void> {
    return this.deviceRepository.delete(id);
  }
}
