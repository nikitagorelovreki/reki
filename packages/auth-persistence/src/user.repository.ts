import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from '@reki/persistence-commons';
import { User, CreateUserDto, UpdateUserDto, UserRepositoryPort } from '@reki/auth-domain';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.knex.transaction(async (trx) => {
      const [user] = await trx('users')
        .insert({
          username: data.username,
          email: data.email,
          password: data.password, // В реальном приложении здесь должен быть хеш
          first_name: data.firstName,
          last_name: data.lastName,
          is_active: data.isActive ?? true,
        })
        .returning('*');

      if (data.roles?.length) {
        await trx('user_roles')
          .insert(
            data.roles.map((roleId: string) => ({
              user_id: user.id,
              role_id: roleId,
            }))
          );
      }

      return this.findById(user.id, trx);
    });

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<User | null> {
    const query = (trx || this.knex)('users as u')
      .select(
        'u.*',
        this.knex.raw('ARRAY_AGG(DISTINCT r.id) as role_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT r.name) as role_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names')
      )
      .leftJoin('user_roles as ur', 'u.id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', 'r.id')
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('u.id', id)
      .groupBy('u.id')
      .first();

    const result = await query;

    if (!result) return null;

    return this.mapToUser(result);
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.knex('users as u')
      .select(
        'u.*',
        this.knex.raw('ARRAY_AGG(DISTINCT r.id) as role_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT r.name) as role_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names')
      )
      .leftJoin('user_roles as ur', 'u.id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', 'r.id')
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('u.username', username)
      .groupBy('u.id')
      .first();

    if (!result) return null;

    return this.mapToUser(result);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.knex('users as u')
      .select(
        'u.*',
        this.knex.raw('ARRAY_AGG(DISTINCT r.id) as role_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT r.name) as role_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names')
      )
      .leftJoin('user_roles as ur', 'u.id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', 'r.id')
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('u.email', email)
      .groupBy('u.id')
      .first();

    if (!result) return null;

    return this.mapToUser(result);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const offset = (page - 1) * limit;

    const results = await this.knex('users as u')
      .select(
        'u.*',
        this.knex.raw('ARRAY_AGG(DISTINCT r.id) as role_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT r.name) as role_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names')
      )
      .leftJoin('user_roles as ur', 'u.id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', 'r.id')
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .groupBy('u.id')
      .orderBy('u.created_at', 'desc')
      .offset(offset)
      .limit(limit);

    return results.map(this.mapToUser);
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const user = await this.knex.transaction(async (trx) => {
      const updateData: any = {};
      
      if (data.username !== undefined) updateData.username = data.username;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.password !== undefined) updateData.password = data.password; // В реальном приложении здесь должен быть хеш
      if (data.firstName !== undefined) updateData.first_name = data.firstName;
      if (data.lastName !== undefined) updateData.last_name = data.lastName;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;
      if (data.lastLoginAt !== undefined) updateData.last_login_at = data.lastLoginAt;

      if (Object.keys(updateData).length > 0) {
        await trx('users')
          .where('id', id)
          .update(updateData);
      }

      if (data.roles !== undefined) {
        // Удаляем старые роли
        await trx('user_roles')
          .where('user_id', id)
          .del();

        // Добавляем новые роли
        if (data.roles.length > 0) {
          await trx('user_roles')
            .insert(
              data.roles.map((roleId: string) => ({
                user_id: id,
                role_id: roleId,
              }))
            );
        }
      }

      return this.findById(id, trx);
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx('user_roles')
        .where('user_id', id)
        .del();
      
      await trx('users')
        .where('id', id)
        .del();
    });
  }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    const user = await this.knex('users')
      .select('password_hash')
      .where('username', username)
      .first();

    if (!user) return false;

    // Используем bcrypt для проверки хеша пароля
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(password, user.password_hash);
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];

    const results = await this.knex('users as u')
      .select(
        'u.*',
        this.knex.raw('ARRAY_AGG(DISTINCT r.id) as role_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT r.name) as role_names'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.id) as permission_ids'),
        this.knex.raw('ARRAY_AGG(DISTINCT p.name) as permission_names')
      )
      .leftJoin('user_roles as ur', 'u.id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', 'r.id')
      .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .whereIn('u.id', ids)
      .groupBy('u.id');

    return results.map(this.mapToUser);
  }

  private mapToUser(result: any): User {
    return {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.first_name,
      lastName: result.last_name,
      isActive: result.is_active,
      lastLoginAt: result.last_login_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      roles: result.role_ids?.filter((id: string) => id !== null) || [],
      permissions: result.permission_ids?.filter((id: string) => id !== null) || [],
    };
  }
}
