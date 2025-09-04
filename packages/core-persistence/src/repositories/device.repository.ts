import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from '@reki/persistence-commons';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '@reki/core-domain';
import { DeviceRepositoryPort } from '../ports/device-repository.port';

@Injectable()
export class DeviceRepository implements DeviceRepositoryPort {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(data: CreateDeviceDto): Promise<Device> {
    const [device] = await this.knex('devices')
      .insert({
        name: data.name || data.model || 'Device', // Use name, fallback to model or default
        serial: data.serial,
        qr_code: data.qrCode,
        external_ids: data.externalIds,
        model: data.model,
        hardware_revision: data.hardwareRevision,
        firmware_version: data.firmwareVersion,
        status: data.status || 'REGISTERED',
        current_location: data.currentLocation,
        clinic_id: data.clinicId,
        owner_id: data.ownerId,
        assigned_patient_id: data.assignedPatientId,
        responsible_user_id: data.responsibleUserId,
        warranty_until: data.warrantyUntil,
        purchase_order: data.purchaseOrder,
        telemetry_endpoint: data.telemetryEndpoint,
        maintenance_notes: data.maintenanceNotes,
      })
      .returning('*');

    if (!device) {
      throw new Error('Failed to create device');
    }

    return this.mapToDevice(device);
  }

  async findById(id: string): Promise<Device | null> {
    const result = await this.knex('devices')
      .where('id', id)
      .first();

    if (!result) return null;

    return this.mapToDevice(result);
  }

  async findBySerial(serial: string): Promise<Device | null> {
    const result = await this.knex('devices')
      .where('serial', serial)
      .first();

    if (!result) return null;

    return this.mapToDevice(result);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Device[]> {
    const offset = (page - 1) * limit;

    const results = await this.knex('devices')
      .orderBy('created_at', 'desc')
      .offset(offset)
      .limit(limit);

    return results.map(this.mapToDevice);
  }

  async update(id: string, data: UpdateDeviceDto): Promise<Device | null> {
    const updateData: any = {};
    
    if (data.serial !== undefined) updateData.serial = data.serial;
    if (data.qrCode !== undefined) updateData.qr_code = data.qrCode;
    if (data.externalIds !== undefined) updateData.external_ids = data.externalIds;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.hardwareRevision !== undefined) updateData.hardware_revision = data.hardwareRevision;
    if (data.firmwareVersion !== undefined) updateData.firmware_version = data.firmwareVersion;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.currentLocation !== undefined) updateData.current_location = data.currentLocation;
    if (data.clinicId !== undefined) updateData.clinic_id = data.clinicId;
    if (data.ownerId !== undefined) updateData.owner_id = data.ownerId;
    if (data.assignedPatientId !== undefined) updateData.assigned_patient_id = data.assignedPatientId;
    if (data.responsibleUserId !== undefined) updateData.responsible_user_id = data.responsibleUserId;
    if (data.warrantyUntil !== undefined) updateData.warranty_until = data.warrantyUntil;
    if (data.purchaseOrder !== undefined) updateData.purchase_order = data.purchaseOrder;
    if (data.telemetryEndpoint !== undefined) updateData.telemetry_endpoint = data.telemetryEndpoint;
    if (data.maintenanceNotes !== undefined) updateData.maintenance_notes = data.maintenanceNotes;

    const [device] = await this.knex('devices')
      .where('id', id)
      .update(updateData)
      .returning('*');

    if (!device) return null;

    return this.mapToDevice(device);
  }

  async delete(id: string): Promise<void> {
    await this.knex('devices')
      .where('id', id)
      .del();
  }

  private mapToDevice(result: any): Device {
    return new Device({
      id: result.id,
      name: result.name,
      serial: result.serial,
      qrCode: result.qr_code,
      externalIds: result.external_ids,
      model: result.model,
      hardwareRevision: result.hardware_revision,
      firmwareVersion: result.firmware_version,
      status: result.status,
      currentLocation: result.current_location,
      clinicId: result.clinic_id,
      ownerId: result.owner_id,
      assignedPatientId: result.assigned_patient_id,
      responsibleUserId: result.responsible_user_id,
      warrantyUntil: result.warranty_until,
      purchaseOrder: result.purchase_order,
      lastSeenAt: result.last_seen_at,
      lastSyncAt: result.last_sync_at,
      telemetryEndpoint: result.telemetry_endpoint,
      maintenanceNotes: result.maintenance_notes,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
}
