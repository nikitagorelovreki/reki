import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from '@reki/persistence-commons';
import { Role, CreateRoleDto, UpdateRoleDto, RoleRepositoryPort } from '@reki/auth-domain';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const role = await this.knex.transaction(async (trx) => {
      const [role] = await trx('roles')
        .insert({
          name: data.name,
          description: data.description,
        })
        .returning('*');

      if (data.permissions?.length) {
        await trx('role_permissions')
          .insert(
            data.permissions.map((permissionId: string) => ({
              role_id: role.id,
              permission_id: permissionId,
            }))
          );
      }

      return this.findById(role.id, trx);
    });

    if (!role) {
      throw new Error('Failed to create role');
    }

    return role;
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<Role | null> {
    const query = (trx || this.knex)('roles as r')
      .select(
        'r.*',
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.resource) as permission_resources'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.action) as permission_actions')
      )
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('r.id', id)
      .groupBy('r.id')
      .first();

    const result = await query;

    if (!result) return null;

    return this.mapToRole(result);
  }

  async findByName(name: string): Promise<Role | null> {
    const result = await this.knex('roles as r')
      .select(
        'r.*',
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.resource) as permission_resources'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.action) as permission_actions')
      )
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('r.name', name)
      .groupBy('r.id')
      .first();

    if (!result) return null;

    return this.mapToRole(result);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Role[]> {
    const offset = (page - 1) * limit;

    const results = await this.knex('roles as r')
      .select(
        'r.*',
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.resource) as permission_resources'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.action) as permission_actions')
      )
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .groupBy('r.id')
      .orderBy('r.created_at', 'desc')
      .offset(offset)
      .limit(limit);

    return results.map(this.mapToRole);
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role | null> {
    const role = await this.knex.transaction(async (trx) => {
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;

      if (Object.keys(updateData).length > 0) {
        await trx('roles')
          .where('id', id)
          .update(updateData);
      }

      if (data.permissions !== undefined) {
        // Удаляем старые разрешения
        await trx('role_permissions')
          .where('role_id', id)
          .del();

        // Добавляем новые разрешения
        if (data.permissions.length > 0) {
          await trx('role_permissions')
            .insert(
              data.permissions.map((permissionId: string) => ({
                role_id: id,
                permission_id: permissionId,
              }))
            );
        }
      }

      return this.findById(id, trx);
    });

    return role;
  }

  async delete(id: string): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx('role_permissions')
        .where('role_id', id)
        .del();
      
      await trx('user_roles')
        .where('role_id', id)
        .del();
      
      await trx('roles')
        .where('id', id)
        .del();
    });
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    if (ids.length === 0) return [];

    const results = await this.knex('roles as r')
      .select(
        'r.*',
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.resource) as permission_resources'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.action) as permission_actions')
      )
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .whereIn('r.id', ids)
      .groupBy('r.id');

    return results.map(this.mapToRole);
  }

  private mapToRole(result: any): Role {
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      permissions: result.permission_ids?.filter((id: string) => id !== null) || [],
    };
  }
}
