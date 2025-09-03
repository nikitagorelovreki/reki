// Frontend-specific types (without backend dependencies)

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

// Basic types for frontend
export interface Device {
  id: string;
  serial: string;
  model: string;
  status: DeviceStatus;
  createdAt: string;
  updatedAt: string;
}

export enum DeviceStatus {
  REGISTERED = 'registered',
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormEntry {
  id: string;
  clientId: string;
  formType: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// UI-specific types
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

// Extended FormEntry with UI-specific fields
export interface FormEntryWithRelations extends FormEntry {
  patient?: Client;
  form?: FormTemplate;
}
