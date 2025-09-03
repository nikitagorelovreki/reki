import { Injectable, Inject } from '@nestjs/common';
import {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionRepositoryPort,
} from '@reki/auth-domain';
import { PERMISSION_REPOSITORY } from '@reki/auth-persistence';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async create(data: CreatePermissionDto): Promise<Permission> {
    return this.permissionRepository.create(data);
  }

  async findById(id: string): Promise<Permission | null> {
    return this.permissionRepository.findById(id);
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionRepository.findByName(name);
  }

  async findAll(page?: number, limit?: number): Promise<Permission[]> {
    return this.permissionRepository.findAll(page, limit);
  }

  async update(id: string, data: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }

    return this.permissionRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }

    await this.permissionRepository.delete(id);
  }
}
