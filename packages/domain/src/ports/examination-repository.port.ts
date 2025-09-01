import { ExaminationFormModel as Form, ExaminationFormType, ExaminationFormEntryModel as FormSubmission } from '../models/examination.model';
import { PaginationOptions, PaginatedResult } from './device-repository.port';

export interface FormRepositoryPort {
  // Базовые CRUD операции для форм
  createForm(form: Form): Promise<Form>;
  findFormById(id: string): Promise<Form | null>;
  findAllForms(options?: PaginationOptions): Promise<PaginatedResult<Form>>;
  updateForm(id: string, form: Partial<Form>): Promise<Form>;
  deleteForm(id: string): Promise<void>;
  
  // Специфичные запросы для форм
  findFormsByType(type: ExaminationFormType, options?: PaginationOptions): Promise<PaginatedResult<Form>>;
  
  // Прямой доступ к билдеру запросов для сложных кейсов
  getFormQueryBuilder(): any;
}

export interface FormSubmissionRepositoryPort {
  // Базовые CRUD операции для заполнений форм
  createSubmission(submission: FormSubmission): Promise<FormSubmission>;
  findSubmissionById(id: string): Promise<FormSubmission | null>;
  findAllSubmissions(options?: PaginationOptions): Promise<PaginatedResult<FormSubmission>>;
  updateSubmission(id: string, submission: Partial<FormSubmission>): Promise<FormSubmission>;
  deleteSubmission(id: string): Promise<void>;
  
  // Специфичные запросы для заполнений форм
  findSubmissionsByClient(clientId: string, options?: PaginationOptions): Promise<PaginatedResult<FormSubmission>>;
  findSubmissionsByForm(formId: string, options?: PaginationOptions): Promise<PaginatedResult<FormSubmission>>;
  findSubmissionsByClientAndForm(clientId: string, formId: string, options?: PaginationOptions): Promise<PaginatedResult<FormSubmission>>;
  findLatestSubmissionByClientAndForm(clientId: string, formId: string): Promise<FormSubmission | null>;
  
  // Прямой доступ к билдеру запросов для сложных кейсов
  getSubmissionQueryBuilder(): any;
}
