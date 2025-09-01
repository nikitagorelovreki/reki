import { Knex } from 'knex';
import { FormEntryModel, FormEntryStatus } from '../models/form-entry.model';
import { PaginatedResult, PaginationOptions } from './device-repository.port';

/**
 * Интерфейс репозитория для работы с заполнениями форм
 */
export abstract class IFormEntryRepository {
  abstract create(formEntry: FormEntryModel, trx?: Knex.Transaction): Promise<FormEntryModel>;
  abstract findAll(options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>>;
  abstract findById(id: string, trx?: Knex.Transaction): Promise<FormEntryModel | null>;
  abstract findByFormId(formId: string, options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>>;
  abstract findByPatientId(patientId: string, options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>>;
  abstract findByDeviceId(deviceId: string, options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>>;
  abstract findByClinicId(clinicId: string, options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>>;
  abstract findByStatus(status: FormEntryStatus, options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>>;
  abstract update(id: string, formEntry: Partial<FormEntryModel>, trx?: Knex.Transaction): Promise<FormEntryModel>;
  abstract delete(id: string, trx?: Knex.Transaction): Promise<boolean>;
}
