import { Injectable } from '@nestjs/common';
import { FormEntryModel, FormEntryStatus, PaginatedResult, PaginationOptions } from '@reki/core-domain';
import { FormEntryRepositoryPort } from '../ports/form-entry-repository.port';
import { DatabaseService } from '../database/database.service';
import { objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';
import { Knex } from 'knex';

@Injectable()
export class FormSubmissionRepository implements FormEntryRepositoryPort {
  private readonly tableName = 'form_entries';
  private readonly fieldMappings: Record<string, string> = {
    formId: 'form_template_id',
    patientId: 'client_id',
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

  constructor(private readonly db: DatabaseService) {}

  async create(formEntry: FormEntryModel, trx?: Knex.Transaction): Promise<FormEntryModel> {
    const dbData = objectCamelToSnake(formEntry, this.fieldMappings);
    
    // Ensure data is properly serialized as JSON
    if (dbData.data && typeof dbData.data === 'object') {
      dbData.data = JSON.stringify(dbData.data);
    }
    
    const query = this.db.knex(this.tableName).insert(dbData).returning('*');
    if (trx) query.transacting(trx);
    
    const [result] = await query;
    return this.mapToFormEntryModel(result);
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<FormEntryModel | null> {
    const query = this.db.knex(this.tableName).where({ id }).first();
    if (trx) query.transacting(trx);
    
    const result = await query;
    return result ? this.mapToFormEntryModel(result) : null;
  }

  async findAll(options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);
    
    if (trx) query.transacting(trx);

    const countQuery = this.db.knex(this.tableName).count('* as count');
    if (trx) countQuery.transacting(trx);

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToFormEntryModel(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async update(id: string, formEntry: Partial<FormEntryModel>, trx?: Knex.Transaction): Promise<FormEntryModel> {
    const dbData = objectCamelToSnake(formEntry, this.fieldMappings);
    
    // Ensure data is properly serialized as JSON
    if (dbData.data && typeof dbData.data === 'object') {
      dbData.data = JSON.stringify(dbData.data);
    }
    
    const query = this.db.knex(this.tableName)
      .where({ id })
      .update({ ...dbData, updated_at: new Date() })
      .returning('*');
    
    if (trx) query.transacting(trx);
    
    const [result] = await query;
    
    if (!result) {
      throw new Error(`Form entry with ID ${id} not found`);
    }
    
    return this.mapToFormEntryModel(result);
  }

  async delete(id: string, trx?: Knex.Transaction): Promise<boolean> {
    const query = this.db.knex(this.tableName).where({ id }).del();
    if (trx) query.transacting(trx);
    
    const result = await query;
    return result > 0;
  }

  async findByPatientId(patientId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ client_id: patientId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);
    
    if (trx) query.transacting(trx);

    const countQuery = this.db.knex(this.tableName)
      .where({ client_id: patientId })
      .count('* as count');
    
    if (trx) countQuery.transacting(trx);

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToFormEntryModel(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByFormId(formId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ form_template_id: formId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);
    
    if (trx) query.transacting(trx);

    const countQuery = this.db.knex(this.tableName)

      .where({ form_template_id: formId })
      .count('* as count');
    
    if (trx) countQuery.transacting(trx);

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToFormEntryModel(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByDeviceId(deviceId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ device_id: deviceId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);
    
    if (trx) query.transacting(trx);

    const countQuery = this.db.knex(this.tableName)
      .where({ device_id: deviceId })
      .count('* as count');
    
    if (trx) countQuery.transacting(trx);

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToFormEntryModel(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByClinicId(clinicId: string, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ clinic_id: clinicId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);
    
    if (trx) query.transacting(trx);

    const countQuery = this.db.knex(this.tableName)
      .where({ clinic_id: clinicId })
      .count('* as count');
    
    if (trx) countQuery.transacting(trx);

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToFormEntryModel(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByStatus(status: FormEntryStatus, options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormEntryModel>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ status })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);
    
    if (trx) query.transacting(trx);

    const countQuery = this.db.knex(this.tableName)
      .where({ status })
      .count('* as count');
    
    if (trx) countQuery.transacting(trx);

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToFormEntryModel(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  private mapToFormEntryModel(data: any): FormEntryModel {
    const entryData = objectSnakeToCamel(data, this.fieldMappings);
    
    // Parse JSON data if it's a string
    if (entryData.data && typeof entryData.data === 'string') {
      try {
        entryData.data = JSON.parse(entryData.data);
      } catch (e) {
        console.error('Error parsing JSON data:', e);
      }
    }
    
    return new FormEntryModel(entryData);
  }
}
