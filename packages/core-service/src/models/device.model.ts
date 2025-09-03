// Service-level models (not domain, not API)
export interface ServiceDevice {
  id: string;
  serial: string;
  qrCode?: string;
  externalIds?: Record<string, string>;
  model: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status: string;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: string;
  purchaseOrder?: string;
  lastSeenAt?: string;
  lastSyncAt?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateDeviceDto {
  serial: string;
  qrCode?: string;
  externalIds?: Record<string, string>;
  model: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status?: string;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: string;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
}

export interface ServiceUpdateDeviceDto {
  qrCode?: string;
  externalIds?: Record<string, string>;
  model?: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status?: string;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: string;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
}
