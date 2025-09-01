export enum DeviceStatus {
  REGISTERED = 'REGISTERED',
  IN_STOCK = 'IN_STOCK',
  AT_CLINIC = 'AT_CLINIC',
  AT_PATIENT_HOME = 'AT_PATIENT_HOME',
  UNDER_SERVICE = 'UNDER_SERVICE',
  RMA = 'RMA',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export enum ClientStatus {
  INTAKE = 'intake',
  DIAGNOSTICS = 'diagnostics',
  ACTIVE_THERAPY = 'active_therapy',
  PAUSED = 'paused',
  DISCHARGED = 'discharged',
  FOLLOWUP = 'followup',
  ARCHIVED = 'archived',
}

export interface Device {
  id: string;
  serial: string;
  qrCode?: string;
  externalIds?: any;
  model: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status: DeviceStatus;
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
  maintenanceNotes?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: string;
  diagnosis?: string;
  contacts?: any;
  status: ClientStatus;
  clinicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceDto {
  serial: string;
  qrCode?: string;
  externalIds?: any;
  model: string;
  hardwareRevision?: string;
  firmwareVersion?: string;
  status?: DeviceStatus;
  currentLocation?: string;
  clinicId?: string;
  ownerId?: string;
  assignedPatientId?: string;
  responsibleUserId?: string;
  warrantyUntil?: string;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: any;
}

export interface CreateClientDto {
  fullName: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: string;
  diagnosis?: string;
  contacts?: any;
  status?: ClientStatus;
  clinicId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
