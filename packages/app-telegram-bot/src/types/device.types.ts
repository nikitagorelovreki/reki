// Типы для устройств (аналогично API слою)
export enum DeviceStatus {
  REGISTERED = 'REGISTERED',
  IN_STOCK = 'IN_STOCK',
  AT_CLINIC = 'AT_CLINIC',
  AT_PATIENT_HOME = 'AT_PATIENT_HOME',
  UNDER_SERVICE = 'UNDER_SERVICE',
  RMA = 'RMA',
  DECOMMISSIONED = 'DECOMMISSIONED',
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
