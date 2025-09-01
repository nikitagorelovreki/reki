import { Knex } from 'knex';
import { FormModel, FormStatus, FormType } from '../models/form.model';
import { PaginatedResult, PaginationOptions } from './device-repository.port';

/**
 * Интерфейс репозитория для работы с формами
 */
export abstract class IFormRepository {
  abstract create(form: FormModel, trx?: Knex.Transaction): Promise<FormModel>;
  abstract findAll(options?: PaginationOptions, trx?: Knex.Transaction): Promise<PaginatedResult<FormModel>>;
  abstract findById(id: string, trx?: Knex.Transaction): Promise<FormModel | null>;
  abstract findByTitle(title: string, trx?: Knex.Transaction): Promise<FormModel[]>;
  abstract findByType(type: FormType, trx?: Knex.Transaction): Promise<FormModel[]>;
  abstract findByStatus(status: FormStatus, trx?: Knex.Transaction): Promise<FormModel[]>;
  abstract findLatestVersion(title: string, trx?: Knex.Transaction): Promise<FormModel | null>;
  abstract update(id: string, form: Partial<FormModel>, trx?: Knex.Transaction): Promise<FormModel>;
  abstract delete(id: string, trx?: Knex.Transaction): Promise<boolean>;
}
