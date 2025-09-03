export enum ExaminationFormType {
  LFK = 'lfk',
  FIM = 'fim',
}

export enum ExaminationFormStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export class ExaminationFormModel {
  static readonly tableName = 'forms';
  static readonly fieldMappings: Record<string, string> = {
    id: 'id',
    title: 'title',
    type: 'type',
    version: 'version',
    status: 'status',
    schema: 'schema',
    description: 'description',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  id: string;
  title: string;
  type: ExaminationFormType;
  version: number;
  status: ExaminationFormStatus;
  schema?: Record<string, any>;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ExaminationFormModel>) {
    Object.assign(this, data);
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.version = data.version || 1;
    this.status = data.status || ExaminationFormStatus.DRAFT;
  }

  update(data: Partial<ExaminationFormModel>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  createNewVersion(): ExaminationFormModel {
    return new ExaminationFormModel({
      title: this.title,
      type: this.type,
      version: this.version + 1,
      status: ExaminationFormStatus.DRAFT,
      schema: this.schema,
      description: this.description,
    });
  }
}

export class ExaminationFormEntryModel {
  static readonly tableName = 'form_entries';
  static readonly fieldMappings: Record<string, string> = {
    id: 'id',
    formId: 'form_id',
    clientId: 'client_id',
    therapistId: 'therapist_id',
    therapistName: 'therapist_name',
    submissionDate: 'submission_date',
    data: 'data',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  id: string;
  formId: string;
  clientId: string;
  therapistId?: string;
  therapistName?: string;
  submissionDate: Date;
  data: Record<string, any>; // JSON данные формы
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ExaminationFormEntryModel>) {
    Object.assign(this, data);
    this.submissionDate = data.submissionDate || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
