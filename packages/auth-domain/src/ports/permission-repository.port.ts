import { Permission, PermissionAction } from '../models/permission.model';

export interface CreatePermissionDto {
  name: string;
  description?: string;
  action: PermissionAction;
  resource: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  action?: PermissionAction;
  resource?: string;
}

export interface PermissionRepositoryPort {
  create(data: CreatePermissionDto): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByIds(ids: string[]): Promise<Permission[]>;
  findByName(name: string): Promise<Permission | null>;
  findByResourceAndAction(resource: string, action: string): Promise<Permission | null>;
  findAll(page?: number, limit?: number): Promise<Permission[]>;
  update(id: string, data: UpdatePermissionDto): Promise<Permission | null>;
  delete(id: string): Promise<void>;
}
