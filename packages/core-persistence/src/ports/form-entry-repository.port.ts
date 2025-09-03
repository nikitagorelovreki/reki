import { FormEntryModel } from '@reki/core-domain';
import { PaginatedResult, PaginationOptions } from '@reki/core-domain';

export interface FormEntryRepositoryPort {
  create(data: any): Promise<FormEntryModel>;
  findById(id: string): Promise<FormEntryModel | null>;
  findByFormId(formId: string, options?: PaginationOptions): Promise<PaginatedResult<FormEntryModel>>;
  findByPatientId(patientId: string, options?: PaginationOptions): Promise<PaginatedResult<FormEntryModel>>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<FormEntryModel>>;
  update(id: string, data: any): Promise<FormEntryModel | null>;
  delete(id: string): Promise<boolean>;
}
