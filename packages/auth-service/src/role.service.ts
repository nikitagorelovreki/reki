import { Injectable, Inject } from '@nestjs/common';
import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleRepositoryPort,
  PermissionRepositoryPort,
} from '@reki/auth-domain';
import { ROLE_REPOSITORY, PERMISSION_REPOSITORY } from '@reki/auth-persistence';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async create(data: CreateRoleDto): Promise<Role> {
    // Проверяем существование разрешений
    if (data.permissions?.length) {
      const permissions = await this.permissionRepository.findByIds(data.permissions);
      if (permissions.length !== data.permissions.length) {
        throw new Error('Some permissions do not exist');
      }
    }

    return this.roleRepository.create(data);
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findById(id);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findByName(name);
  }

  async findAll(page?: number, limit?: number): Promise<Role[]> {
    return this.roleRepository.findAll(page, limit);
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Проверяем существование разрешений
    if (data.permissions?.length) {
      const permissions = await this.permissionRepository.findByIds(data.permissions);
      if (permissions.length !== data.permissions.length) {
        throw new Error('Some permissions do not exist');
      }
    }

    return this.roleRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    await this.roleRepository.delete(id);
  }
}
