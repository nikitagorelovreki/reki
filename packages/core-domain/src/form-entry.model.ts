import { v4 as uuidv4 } from 'uuid';

/**
 * Статус заполнения формы
 */
export enum FormEntryStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Модель заполнения формы
 */
export interface FormEntry {
  id: string;
  formId: string;
  patientId?: string;
  deviceId?: string;
  clinicId?: string;
  status: FormEntryStatus;
  data: Record<string, any>; // JSON с результатами заполнения формы
  score?: number; // Опциональное поле для оценки/баллов
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Класс для работы с заполнениями форм
 */
export class FormEntryModel implements FormEntry {
  static tableName = 'form_entries';
  static fieldMappings: Record<keyof FormEntry, string> = {
    id: 'id',
    formId: 'form_id',
    patientId: 'patient_id',
    deviceId: 'device_id',
    clinicId: 'clinic_id',
    status: 'status',
    data: 'data',
    score: 'score',
    completedAt: 'completed_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    createdBy: 'created_by',
    updatedBy: 'updated_by',
  };

  id: string;
  formId: string;
  patientId?: string;
  deviceId?: string;
  clinicId?: string;
  status: FormEntryStatus;
  data: Record<string, any>;
  score?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(data: Partial<FormEntry>) {
    this.id = data.id || uuidv4();
    this.formId = data.formId!;
    this.patientId = data.patientId;
    this.deviceId = data.deviceId;
    this.clinicId = data.clinicId;
    this.status = data.status || FormEntryStatus.IN_PROGRESS;
    this.data = data.data || {};
    this.score = data.score;
    this.completedAt = data.completedAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
  }

  update(updateData: Partial<FormEntry>): void {
    Object.assign(this, { ...updateData, updatedAt: new Date() });
  }

  /**
   * Завершает заполнение формы
   */
  complete(score?: number): void {
    this.status = FormEntryStatus.COMPLETED;
    this.completedAt = new Date();
    if (score !== undefined) {
      this.score = score;
    }
    this.updatedAt = new Date();
  }

  /**
   * Отменяет заполнение формы
   */
  cancel(): void {
    this.status = FormEntryStatus.CANCELLED;
    this.updatedAt = new Date();
  }
}

export interface CreateFormEntryDto {
  formId: string;
  patientId?: string;
  deviceId?: string;
  clinicId?: string;
  status?: FormEntryStatus;
  data?: Record<string, any>;
  score?: number;
  createdBy?: string;
}

export interface UpdateFormEntryDto {
  patientId?: string;
  deviceId?: string;
  clinicId?: string;
  status?: FormEntryStatus;
  data?: Record<string, any>;
  score?: number;
  completedAt?: Date;
  updatedBy?: string;
}
