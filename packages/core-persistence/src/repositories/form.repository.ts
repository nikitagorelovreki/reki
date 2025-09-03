import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from '@reki/persistence-commons';
import { Form, CreateFormDto, UpdateFormDto } from '@reki/core-domain';
import { FormRepositoryPort } from '../ports/form-repository.port';

@Injectable()
export class FormRepository implements FormRepositoryPort {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(data: CreateFormDto): Promise<Form> {
    const [form] = await this.knex('form_templates')
      .insert({
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status || 'draft',
        version: data.version || 1,
        schema: data.schema,
        created_by: data.createdBy,
      })
      .returning('*');

    if (!form) {
      throw new Error('Failed to create form');
    }

    return this.mapToForm(form);
  }

  async findById(id: string): Promise<Form | null> {
    const result = await this.knex('form_templates')
      .where('id', id)
      .first();

    if (!result) return null;

    return this.mapToForm(result);
  }

  async findByTitle(title: string): Promise<Form | null> {
    const result = await this.knex('form_templates')
      .where('title', title)
      .first();

    if (!result) return null;

    return this.mapToForm(result);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Form[]> {
    const offset = (page - 1) * limit;

    const results = await this.knex('form_templates')
      .orderBy('created_at', 'desc')
      .offset(offset)
      .limit(limit);

    return results.map(this.mapToForm);
  }

  async update(id: string, data: UpdateFormDto): Promise<Form | null> {
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.schema !== undefined) updateData.schema = data.schema;
    if (data.updatedBy !== undefined) updateData.updated_by = data.updatedBy;

    const [form] = await this.knex('form_templates')
      .where('id', id)
      .update(updateData)
      .returning('*');

    if (!form) return null;

    return this.mapToForm(form);
  }

  async delete(id: string): Promise<void> {
    await this.knex('form_templates')
      .where('id', id)
      .del();
  }

  private mapToForm(result: any): Form {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      type: result.type,
      status: result.status,
      version: result.version,
      schema: result.schema,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      createdBy: result.created_by,
      updatedBy: result.updated_by,
    };
  }
}