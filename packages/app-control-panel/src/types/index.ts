// Re-export all types from core-domain
export * from './core';

// Legacy types for backward compatibility (will be removed later)
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

// Note: These interfaces are now imported from @reki/core-domain
// Keeping them here temporarily for backward compatibility
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
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
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

export interface FormField {
  name: string;
  type: 'text' | 'date' | 'select' | 'rating' | 'number' | 'textarea' | 'checkbox' | 'checkbox-group';
  label: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  readOnly?: boolean;
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface FormSchema {
  sections: FormSection[];
}

export interface FormTemplate {
  id: string;
  title: string;
  type: string;
  description: string;
  schema: FormSchema;
}

export interface FormEntry {
  id: string;
  formId: string;
  patientId: string;
  deviceId?: string | null;
  clinicId?: string | null;
  status: FormEntryStatus;
  data: Record<string, any>;
  score?: number | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  patient?: Client;
  form?: FormTemplate;
}

export type FormEntryStatus = 'in_progress' | 'completed' | 'cancelled';
