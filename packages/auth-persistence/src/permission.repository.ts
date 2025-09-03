import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from '@reki/persistence-commons';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionRepositoryPort } from '@reki/auth-domain';

@Injectable()
export class PermissionRepository implements PermissionRepositoryPort {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(data: CreatePermissionDto): Promise<Permission> {
    const [permission] = await this.knex('permissions')
      .insert({
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
      })
      .returning('*');

    if (!permission) {
      throw new Error('Failed to create permission');
    }

    return this.mapToPermission(permission);
  }

  async findById(id: string): Promise<Permission | null> {
    const result = await this.knex('permissions')
      .where('id', id)
      .first();

    if (!result) return null;

    return this.mapToPermission(result);
  }

  async findByName(name: string): Promise<Permission | null> {
    const result = await this.knex('permissions')
      .where('name', name)
      .first();

    if (!result) return null;

    return this.mapToPermission(result);
  }

  async findByResourceAndAction(resource: string, action: string): Promise<Permission | null> {
    const result = await this.knex('permissions')
      .where('resource', resource)
      .andWhere('action', action)
      .first();

    if (!result) return null;

    return this.mapToPermission(result);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Permission[]> {
    const offset = (page - 1) * limit;

    const results = await this.knex('permissions')
      .orderBy('created_at', 'desc')
      .offset(offset)
      .limit(limit);

    return results.map(this.mapToPermission);
  }

  async update(id: string, data: UpdatePermissionDto): Promise<Permission | null> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.resource !== undefined) updateData.resource = data.resource;
    if (data.action !== undefined) updateData.action = data.action;

    const [permission] = await this.knex('permissions')
      .where('id', id)
      .update(updateData)
      .returning('*');

    if (!permission) return null;

    return this.mapToPermission(permission);
  }

  async delete(id: string): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx('role_permissions')
        .where('permission_id', id)
        .del();
      
      await trx('permissions')
        .where('id', id)
        .del();
    });
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    if (ids.length === 0) return [];

    const results = await this.knex('permissions')
      .whereIn('id', ids);

    return results.map(this.mapToPermission);
  }

  private mapToPermission(result: any): Permission {
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      resource: result.resource,
      action: result.action,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }
}
