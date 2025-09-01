import { Injectable } from '@nestjs/common';
import { Device, DeviceStatus, DeviceRepositoryPort, PaginationOptions, PaginatedResult } from '@cuis/domain';
import { DatabaseService } from '../database/database.service';
import { objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class DeviceRepository implements DeviceRepositoryPort {
  private readonly tableName = 'devices';
  private readonly fieldMappings: Record<string, string> = {
    qrCode: 'qr_code',
    hardwareRevision: 'hardware_revision',
    firmwareVersion: 'firmware_version',
    currentLocation: 'current_location',
    clinicId: 'clinic_id',
    ownerId: 'owner_id',
    assignedPatientId: 'assigned_patient_id',
    responsibleUserId: 'responsible_user_id',
    warrantyUntil: 'warranty_until',
    purchaseOrder: 'purchase_order',
    lastSeenAt: 'last_seen_at',
    lastSyncAt: 'last_sync_at',
    telemetryEndpoint: 'telemetry_endpoint',
    maintenanceNotes: 'maintenance_notes',
    externalIds: 'external_ids',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private readonly db: DatabaseService) {}

  async create(device: Device): Promise<Device> {
    const dbData = objectCamelToSnake(device, this.fieldMappings);
    const [result] = await this.db.knex(this.tableName)
      .insert(dbData)
      .returning('*');
    
    return this.mapToDevice(result);
  }

  async findById(id: string): Promise<Device | null> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .first();
    
    return result ? this.mapToDevice(result) : null;
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Device>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    // Преобразуем camelCase поле сортировки в snake_case для SQL
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName).count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToDevice(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async update(id: string, deviceData: Partial<Device>): Promise<Device> {
    const dbData = objectCamelToSnake(deviceData, this.fieldMappings);
    const [result] = await this.db.knex(this.tableName)
      .where({ id })
      .update({ ...dbData, updated_at: new Date() })
      .returning('*');
    
    if (!result) {
      throw new Error(`Device with ID ${id} not found`);
    }
    
    return this.mapToDevice(result);
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .del();
    
    if (result === 0) {
      throw new Error(`Device with ID ${id} not found`);
    }
  }

  async findBySerial(serial: string): Promise<Device | null> {
    const result = await this.db.knex(this.tableName)
      .where({ serial })
      .first();
    
    return result ? this.mapToDevice(result) : null;
  }

  async findByClinic(clinicId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Device>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ clinic_id: clinicId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ clinic_id: clinicId })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToDevice(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByStatus(status: DeviceStatus, options: PaginationOptions = {}): Promise<PaginatedResult<Device>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ status })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ status })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToDevice(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByPatient(patientId: string): Promise<Device[]> {
    const results = await this.db.knex(this.tableName)
      .where({ assigned_patient_id: patientId })
      .select('*');
    
    return results.map(record => this.mapToDevice(record));
  }

  getQueryBuilder() {
    return this.db.knex(this.tableName);
  }

  private mapToDevice(data: any): Device {
    const deviceData = objectSnakeToCamel(data, this.fieldMappings);
    return new Device(deviceData);
  }
}
