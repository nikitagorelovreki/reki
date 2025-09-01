import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { 
  Device, 
  DEVICE_REPOSITORY, 
  DeviceRepositoryPort, 
  DeviceStatus, 
  PaginatedResult,
  PaginationOptions
} from '@reki/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: DeviceRepositoryPort
  ) {}

  async createDevice(deviceData: Partial<Device>): Promise<Device> {
    const device = new Device({
      id: uuidv4(),
      status: DeviceStatus.REGISTERED,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...deviceData,
    });

    return this.deviceRepository.create(device);
  }

  async getDeviceById(id: string): Promise<Device> {
    const device = await this.deviceRepository.findById(id);
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }

  async getDeviceBySerial(serial: string): Promise<Device | null> {
    return this.deviceRepository.findBySerial(serial);
  }

  async getAllDevices(options: PaginationOptions = {}): Promise<PaginatedResult<Device>> {
    return this.deviceRepository.findAll(options);
  }

  async updateDevice(id: string, updateData: Partial<Device>): Promise<Device> {
    const existingDevice = await this.getDeviceById(id);
    
    // Обновляем свойства устройства
    const updatedDevice = new Device({
      ...existingDevice,
      ...updateData,
      updatedAt: new Date()
    });
    
    return this.deviceRepository.update(id, updatedDevice);
  }

  async deleteDevice(id: string): Promise<void> {
    await this.deviceRepository.delete(id);
  }

  async getDevicesByClinic(clinicId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Device>> {
    return this.deviceRepository.findByClinic(clinicId, options);
  }

  async getDevicesByStatus(status: DeviceStatus, options: PaginationOptions = {}): Promise<PaginatedResult<Device>> {
    return this.deviceRepository.findByStatus(status, options);
  }

  async getDevicesByPatient(patientId: string): Promise<Device[]> {
    return this.deviceRepository.findByPatient(patientId);
  }

  async assignDeviceToPatient(deviceId: string, patientId: string): Promise<Device> {
    const device = await this.getDeviceById(deviceId);
    device.assignToPatient(patientId);
    return this.deviceRepository.update(deviceId, device);
  }

  async unassignDeviceFromPatient(deviceId: string): Promise<Device> {
    const device = await this.getDeviceById(deviceId);
    device.unassignFromPatient();
    return this.deviceRepository.update(deviceId, device);
  }

  async updateDeviceStatus(deviceId: string, status: DeviceStatus): Promise<Device> {
    const device = await this.getDeviceById(deviceId);
    device.updateStatus(status);
    return this.deviceRepository.update(deviceId, device);
  }
}
