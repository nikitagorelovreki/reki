export enum DeviceStatus {
  REGISTERED = 'REGISTERED',
  IN_STOCK = 'IN_STOCK',
  AT_CLINIC = 'AT_CLINIC',
  AT_PATIENT_HOME = 'AT_PATIENT_HOME',
  UNDER_SERVICE = 'UNDER_SERVICE',
  RMA = 'RMA',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export class Device {
  id: string;
  serial: string;
  qrCode?: string;
  externalIds?: Record<string, string>;
  model: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status: DeviceStatus;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: Date;
  purchaseOrder?: string;
  lastSeenAt?: Date;
  lastSyncAt?: Date;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Device>) {
    Object.assign(this, data);
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.status = data.status || DeviceStatus.REGISTERED;
  }

  updateStatus(status: DeviceStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  assignToPatient(patientId: string): void {
    this.assignedPatientId = patientId;
    this.updatedAt = new Date();
  }

  unassignFromPatient(): void {
    this.assignedPatientId = undefined;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === DeviceStatus.AT_CLINIC || 
           this.status === DeviceStatus.AT_PATIENT_HOME;
  }
}

export interface CreateDeviceDto {
  serial: string;
  qrCode?: string;
  externalIds?: Record<string, string>;
  model: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status?: DeviceStatus;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: Date;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
}

export interface UpdateDeviceDto {
  serial?: string;
  qrCode?: string;
  externalIds?: Record<string, string>;
  model?: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status?: DeviceStatus;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: Date;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
}
