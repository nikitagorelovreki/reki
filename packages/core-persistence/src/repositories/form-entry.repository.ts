import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { DatabaseService } from '@reki/persistence-commons';
import { FormEntryModel, FormEntryStatus, PaginatedResult, PaginationOptions } from '@reki/core-domain';
import { FormEntryRepositoryPort } from '../ports/form-entry-repository.port';
import { camelToSnake, objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class FormEntryRepository implements FormEntryRepositoryPort {
  private readonly tableName = FormEntryModel.tableName;
  private readonly fieldMappings = FormEntryModel.fieldMappings;

  constructor(private readonly db: DatabaseService) {}

  private mapToDb(formEntry: Partial<FormEntryModel>): Record<string, any> {
    return objectCamelToSnake(formEntry, this.fieldMappings);
  }

  private mapFromDb(record: Record<string, any>): FormEntryModel {
    const camelCaseRecord = objectSnakeToCamel(record, this.fieldMappings) as FormEntryModel;
    return new FormEntryModel(camelCaseRecord);
  }

  async create(formEntry: FormEntryModel, trx?: Knex.Transaction): Promise<FormEntryModel> {
    const knexInstance = trx || this.db.knex;
    const [result] = await knexInstance(this.tableName)
      .insert(this.mapToDb(formEntry))
      .returning('*');
    return this.mapFromDb(result);
  }

  async findAll(options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = (this.fieldMappings as any)[sortBy] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .select([
        `${this.tableName}.*`,
        'clients.first_name as patient_first_name',
        'clients.last_name as patient_last_name',
        'clients.middle_name as patient_middle_name',
        'clients.full_name as patient_full_name',
        'clients.status as patient_status',
        'form_templates.title as form_title',
        'form_templates.type as form_type',
        'form_templates.description as form_description',
        'form_templates.schema as form_schema'
      ])
      .leftJoin('clients', `${this.tableName}.client_id`, 'clients.id')
      .leftJoin('form_templates', `${this.tableName}.form_template_id`, 'form_templates.id')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName).count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => {
        const formEntry = this.mapFromDb(record);
        
        // Добавляем связанные данные
        if (record.patient_first_name || record.patient_last_name) {
          (formEntry as any).patient = {
            id: formEntry.patientId,
            firstName: record.patient_first_name,
            lastName: record.patient_last_name,
            middleName: record.patient_middle_name,
            fullName: record.patient_full_name,
            status: record.patient_status,
          };
        }
        
        if (record.form_title) {
          (formEntry as any).form = {
            id: formEntry.formId,
            title: record.form_title,
            type: record.form_type,
            description: record.form_description,
            schema: record.form_schema || null,
          };
        }
        
        return formEntry;
      }),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<FormEntryModel | null> {
    const knexInstance = trx || this.db.knex;
    const record = await knexInstance(this.tableName)
      .where({ id })
      .first();
    return record ? this.mapFromDb(record) : null;
  }

  async findByFormId(formId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = (this.fieldMappings as any)[sortBy] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .where(this.fieldMappings.formId, formId)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName)
      .where(this.fieldMappings.formId, formId)
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(this.mapFromDb.bind(this)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByPatientId(patientId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = (this.fieldMappings as any)[sortBy] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .where(this.fieldMappings.patientId, patientId)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName)
      .where(this.fieldMappings.patientId, patientId)
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(this.mapFromDb.bind(this)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByDeviceId(deviceId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = (this.fieldMappings as any)[sortBy] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .where(this.fieldMappings.deviceId, deviceId)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName)
      .where(this.fieldMappings.deviceId, deviceId)
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(this.mapFromDb.bind(this)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByClinicId(clinicId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = (this.fieldMappings as any)[sortBy] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .where(this.fieldMappings.clinicId, clinicId)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName)
      .where(this.fieldMappings.clinicId, clinicId)
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(this.mapFromDb.bind(this)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByStatus(status: FormEntryStatus, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = (this.fieldMappings as any)[sortBy] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .where(this.fieldMappings.status, status)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName)
      .where(this.fieldMappings.status, status)
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(this.mapFromDb.bind(this)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async update(id: string, updateData: Partial<FormEntryModel>, trx?: Knex.Transaction): Promise<FormEntryModel> {
    const knexInstance = trx || this.db.knex;
    const [result] = await knexInstance(this.tableName)
      .where({ id })
      .update(this.mapToDb({ ...updateData, updatedAt: new Date() }))
      .returning('*');
    if (!result) {
      throw new NotFoundException(`FormEntry with ID ${id} not found`);
    }
    return this.mapFromDb(result);
  }

  async delete(id: string, trx?: Knex.Transaction): Promise<boolean> {
    const knexInstance = trx || this.db.knex;
    const result = await knexInstance(this.tableName)
      .where({ id })
      .del();
    if (result === 0) {
      throw new NotFoundException(`FormEntry with ID ${id} not found`);
    }
    return result > 0;
  }
}
