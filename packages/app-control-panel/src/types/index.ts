// Swagger DTOs from API module (pure TypeScript, no NestJS decorators)

// Device DTOs
export enum DeviceStatus {
  REGISTERED = 'REGISTERED',
  IN_STOCK = 'IN_STOCK',
  AT_CLINIC = 'AT_CLINIC',
  AT_PATIENT_HOME = 'AT_PATIENT_HOME',
  UNDER_SERVICE = 'UNDER_SERVICE',
  RMA = 'RMA',
  DECOMMISSIONED = 'DECOMMISSIONED',
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
  warrantyUntil?: string;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
}

export interface UpdateDeviceDto {
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
  warrantyUntil?: string;
  purchaseOrder?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
}

export interface DeviceDto {
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
  warrantyUntil?: string;
  purchaseOrder?: string;
  lastSeenAt?: string;
  lastSyncAt?: string;
  telemetryEndpoint?: string;
  maintenanceNotes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Client DTOs
export enum ClientStatus {
  INTAKE = 'intake',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCHARGED = 'discharged',
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

export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
  status?: ClientStatus;
  clinicId?: string;
}

export interface ClientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
  status: ClientStatus;
  clinicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedClientsResponseDto {
  data: ClientResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form DTOs
export enum FormStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum FormType {
  ASSESSMENT = 'assessment',
  QUESTIONNAIRE = 'questionnaire',
  SURVEY = 'survey',
  LFK = 'lfk',
  FIM = 'fim',
}

export interface CreateFormDto {
  title: string;
  description?: string;
  type: FormType;
  status?: FormStatus;
  version?: number;
  schema: Record<string, any>;
}

export interface UpdateFormDto extends CreateFormDto {
  // All fields from CreateFormDto become optional
}

export interface FormResponseDto {
  id: string;
  title: string;
  description?: string;
  type: FormType;
  status: FormStatus;
  version: number;
  schema: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Form Entry DTOs
export enum FormEntryStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export interface CreateFormEntryDto {
  formId: string;
  patientId?: string;
  deviceId?: string;
  clinicId?: string;
  status?: FormEntryStatus;
  data?: Record<string, unknown>;
  score?: number;
}

export interface UpdateFormEntryDto {
  status?: FormEntryStatus;
  data?: Record<string, unknown>;
  score?: number;
}

export interface SaveFormDataDto {
  data: Record<string, unknown>;
}

export interface FormEntryResponseDto {
  id: string;
  formId: string;
  patientId?: string;
  deviceId?: string;
  clinicId?: string;
  status: FormEntryStatus;
  data: Record<string, unknown>;
  score?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Frontend-specific UI types (not part of Swagger)
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

// API response format from backend
export interface DevicesPaginatedResponse {
  devices: Device[];
  total: number;
  page: number;
  limit: number;
}

// Frontend-specific type aliases for better UX
export type Client = ClientResponseDto;
export type Device = DeviceDto;
export type Form = FormResponseDto;
export type FormEntry = FormEntryResponseDto;

// UI-specific form field types (not part of Swagger)
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
