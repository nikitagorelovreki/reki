// Типы для устройств (аналогично API слою)
export enum DeviceStatus {
  REGISTERED = 'registered',
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  LOST = 'lost',
  DAMAGED = 'damaged',
}

export interface Device {
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
}
