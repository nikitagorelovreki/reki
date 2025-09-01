import { Device, DeviceStatus } from '../models/device.model';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeviceRepositoryPort {
  // Базовые CRUD операции
  create(device: Device): Promise<Device>;
  findById(id: string): Promise<Device | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Device>>;
  update(id: string, device: Partial<Device>): Promise<Device>;
  delete(id: string): Promise<void>;
  
  // Специфичные запросы
  findBySerial(serial: string): Promise<Device | null>;
  findByClinic(clinicId: string, options?: PaginationOptions): Promise<PaginatedResult<Device>>;
  findByStatus(status: DeviceStatus, options?: PaginationOptions): Promise<PaginatedResult<Device>>;
  findByPatient(patientId: string): Promise<Device[]>;
  
  // Прямой доступ к билдеру запросов для сложных кейсов
  getQueryBuilder(): any;
}