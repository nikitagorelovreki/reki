import { v4 as uuidv4 } from 'uuid';

/**
 * Статус формы
 */
export enum FormStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

/**
 * Тип формы
 */
export enum FormType {
  ASSESSMENT = 'assessment',
  QUESTIONNAIRE = 'questionnaire',
  SURVEY = 'survey',
  TEST = 'test',
  LFK = 'lfk',
  FIM = 'fim'
}

/**
 * Модель формы
 */
export interface Form {
  id: string;
  title: string;
  description?: string;
  type: FormType;
  status: FormStatus;
  version: number;
  schema: Record<string, any>; // JSON-схема формы
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Класс для работы с формами
 */
export class FormModel implements Form {
  static tableName = 'form_templates';
  static fieldMappings: Record<keyof Form, string> = {
    id: 'id',
    title: 'title',
    description: 'description',
    type: 'type',
    status: 'status',
    version: 'version',
    schema: 'schema',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    createdBy: 'created_by',
    updatedBy: 'updated_by',
  };

  id: string;
  title: string;
  description?: string;
  type: FormType;
  status: FormStatus;
  version: number;
  schema: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(data: Partial<Form>) {
    this.id = data.id || uuidv4();
    this.title = data.title || '';
    this.description = data.description;
    this.type = data.type || FormType.ASSESSMENT;
    this.status = data.status || FormStatus.DRAFT;
    this.version = data.version || 1;
    this.schema = data.schema || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
  }

  update(updateData: Partial<Form>): void {
    Object.assign(this, { ...updateData, updatedAt: new Date() });
  }

  /**
   * Создает новую версию формы
   */
  createNewVersion(): FormModel {
    return new FormModel({
      title: this.title,
      description: this.description,
      type: this.type,
      status: FormStatus.DRAFT,
      version: this.version + 1,
      schema: this.schema,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    });
  }
}

export interface CreateFormDto {
  title: string;
  description?: string;
  type: FormType;
  status?: FormStatus;
  version?: number;
  schema: Record<string, any>;
  createdBy?: string;
}

export interface UpdateFormDto {
  title?: string;
  description?: string;
  type?: FormType;
  status?: FormStatus;
  version?: number;
  schema?: Record<string, any>;
  updatedBy?: string;
}
