import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { DatabaseService } from '../database/database.service';
import { FormModel, FormStatus, FormType, IFormRepository, PaginatedResult, PaginationOptions } from '@cuis/domain';
import { camelToSnake, objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class FormRepository implements IFormRepository {
  private readonly tableName = FormModel.tableName;
  private readonly fieldMappings = FormModel.fieldMappings;

  constructor(private readonly db: DatabaseService) {}

  private mapToDb(form: Partial<FormModel>): Record<string, any> {
    return objectCamelToSnake(form, this.fieldMappings);
  }

  private mapFromDb(record: Record<string, any>): FormModel {
    const camelCaseRecord = objectSnakeToCamel(record, this.fieldMappings) as FormModel;
    return new FormModel(camelCaseRecord);
  }

  async create(form: FormModel, trx?: Knex.Transaction): Promise<FormModel> {
    const knexInstance = trx || this.db.knex;
    const [result] = await knexInstance(this.tableName)
      .insert(this.mapToDb(form))
      .returning('*');
    return this.mapFromDb(result);
  }

  async findAll(options: PaginationOptions = {}, trx?: Knex.Transaction): Promise<PaginatedResult<FormModel>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    const knexInstance = trx || this.db.knex;

    const dbSortField = this.fieldMappings[sortBy as keyof FormModel] || camelToSnake(sortBy);

    const query = knexInstance(this.tableName)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = knexInstance(this.tableName).count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(this.mapFromDb.bind(this)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<FormModel | null> {
    const knexInstance = trx || this.db.knex;
    const record = await knexInstance(this.tableName)
      .where({ id })
      .first();
    return record ? this.mapFromDb(record) : null;
  }

  async findByTitle(title: string, trx?: Knex.Transaction): Promise<FormModel[]> {
    const knexInstance = trx || this.db.knex;
    const records = await knexInstance(this.tableName)
      .where(this.fieldMappings.title, title)
      .select('*');
    return records.map(this.mapFromDb.bind(this));
  }

  async findByType(type: FormType, trx?: Knex.Transaction): Promise<FormModel[]> {
    const knexInstance = trx || this.db.knex;
    const records = await knexInstance(this.tableName)
      .where(this.fieldMappings.type, type)
      .select('*');
    return records.map(this.mapFromDb.bind(this));
  }

  async findByStatus(status: FormStatus, trx?: Knex.Transaction): Promise<FormModel[]> {
    const knexInstance = trx || this.db.knex;
    const records = await knexInstance(this.tableName)
      .where(this.fieldMappings.status, status)
      .select('*');
    return records.map(this.mapFromDb.bind(this));
  }

  async findLatestVersion(title: string, trx?: Knex.Transaction): Promise<FormModel | null> {
    const knexInstance = trx || this.db.knex;
    const record = await knexInstance(this.tableName)
      .where(this.fieldMappings.title, title)
      .orderBy(this.fieldMappings.version, 'desc')
      .first();
    return record ? this.mapFromDb(record) : null;
  }

  async update(id: string, updateData: Partial<FormModel>, trx?: Knex.Transaction): Promise<FormModel> {
    const knexInstance = trx || this.db.knex;
    const [result] = await knexInstance(this.tableName)
      .where({ id })
      .update(this.mapToDb({ ...updateData, updatedAt: new Date() }))
      .returning('*');
    if (!result) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return this.mapFromDb(result);
  }

  async delete(id: string, trx?: Knex.Transaction): Promise<boolean> {
    const knexInstance = trx || this.db.knex;
    const result = await knexInstance(this.tableName)
      .where({ id })
      .del();
    if (result === 0) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return result > 0;
  }
}