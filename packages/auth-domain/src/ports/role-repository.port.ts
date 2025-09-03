import { Role } from '../models/role.model';

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleRepositoryPort {
  create(data: CreateRoleDto): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByIds(ids: string[]): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
  findAll(page?: number, limit?: number): Promise<Role[]>;
  update(id: string, data: UpdateRoleDto): Promise<Role | null>;
  delete(id: string): Promise<void>;
}
