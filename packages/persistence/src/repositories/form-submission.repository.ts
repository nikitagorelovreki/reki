import { Injectable } from '@nestjs/common';
import { FormSubmission, FormSubmissionRepositoryPort, PaginationOptions, PaginatedResult } from '@cuis/domain';
import { DatabaseService } from '../database/database.service';
import { objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class FormSubmissionRepository implements FormSubmissionRepositoryPort {
  private readonly tableName = 'form_submissions';
  private readonly fieldMappings: Record<string, string> = {
    formId: 'form_id',
    clientId: 'client_id',
    therapistId: 'therapist_id',
    therapistName: 'therapist_name',
    submissionDate: 'submission_date',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private readonly db: DatabaseService) {}

  async createSubmission(submission: FormSubmission): Promise<FormSubmission> {
    const dbData = objectCamelToSnake(submission, this.fieldMappings);
    
    // Ensure data is properly serialized as JSON
    if (dbData.data && typeof dbData.data === 'object') {
      dbData.data = JSON.stringify(dbData.data);
    }
    
    const [result] = await this.db.knex(this.tableName)
      .insert(dbData)
      .returning('*');
    
    return this.mapToSubmission(result);
  }

  async findSubmissionById(id: string): Promise<FormSubmission | null> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .first();
    
    return result ? this.mapToSubmission(result) : null;
  }

  async findAllSubmissions(options: PaginationOptions = {}): Promise<PaginatedResult<FormSubmission>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName).count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToSubmission(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async updateSubmission(id: string, submissionData: Partial<FormSubmission>): Promise<FormSubmission> {
    const dbData = objectCamelToSnake(submissionData, this.fieldMappings);
    
    // Ensure data is properly serialized as JSON
    if (dbData.data && typeof dbData.data === 'object') {
      dbData.data = JSON.stringify(dbData.data);
    }
    
    const [result] = await this.db.knex(this.tableName)
      .where({ id })
      .update({ ...dbData, updated_at: new Date() })
      .returning('*');
    
    if (!result) {
      throw new Error(`Form submission with ID ${id} not found`);
    }
    
    return this.mapToSubmission(result);
  }

  async deleteSubmission(id: string): Promise<void> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .del();
    
    if (result === 0) {
      throw new Error(`Form submission with ID ${id} not found`);
    }
  }

  async findSubmissionsByClient(clientId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormSubmission>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ client_id: clientId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ client_id: clientId })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToSubmission(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findSubmissionsByForm(formId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormSubmission>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ form_id: formId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ form_id: formId })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToSubmission(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findSubmissionsByClientAndForm(clientId: string, formId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormSubmission>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ 
        client_id: clientId,
        form_id: formId 
      })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ 
        client_id: clientId,
        form_id: formId 
      })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToSubmission(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findLatestSubmissionByClientAndForm(clientId: string, formId: string): Promise<FormSubmission | null> {
    const result = await this.db.knex(this.tableName)
      .where({ 
        client_id: clientId,
        form_id: formId 
      })
      .orderBy('submission_date', 'desc')
      .first();
    
    return result ? this.mapToSubmission(result) : null;
  }

  getSubmissionQueryBuilder() {
    return this.db.knex(this.tableName);
  }

  private mapToSubmission(data: any): FormSubmission {
    const submissionData = objectSnakeToCamel(data, this.fieldMappings);
    
    // Parse JSON data if it's a string
    if (submissionData.data && typeof submissionData.data === 'string') {
      try {
        submissionData.data = JSON.parse(submissionData.data);
      } catch (e) {
        console.error('Error parsing JSON data:', e);
      }
    }
    
    return new FormSubmission(submissionData);
  }
}
