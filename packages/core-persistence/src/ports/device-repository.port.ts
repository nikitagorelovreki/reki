import { Device } from '@reki/core-domain';

export interface DeviceRepositoryPort {
  create(data: any): Promise<Device>;
  findById(id: string): Promise<Device | null>;
  findBySerial(serial: string): Promise<Device | null>;
  findAll(page?: number, limit?: number): Promise<Device[]>;
  update(id: string, data: any): Promise<Device | null>;
  delete(id: string): Promise<void>;
}

export const DEVICE_REPOSITORY_TOKEN = Symbol('DeviceRepository');
