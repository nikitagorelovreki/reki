import { Injectable, Inject } from '@nestjs/common';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRepositoryPort,
  RoleRepositoryPort,
} from '@reki/auth-domain';
import { USER_REPOSITORY, ROLE_REPOSITORY } from '@reki/auth-persistence';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    // Проверяем существование ролей
    if (data.roles?.length) {
      const roles = await this.roleRepository.findByIds(data.roles);
      if (roles.length !== data.roles.length) {
        throw new Error('Some roles do not exist');
      }
    }

    return this.userRepository.create(data);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(page?: number, limit?: number): Promise<User[]> {
    return this.userRepository.findAll(page, limit);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    // Проверяем существование ролей
    if (data.roles?.length) {
      const roles = await this.roleRepository.findByIds(data.roles);
      if (roles.length !== data.roles.length) {
        throw new Error('Some roles do not exist');
      }
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Проверяем, не является ли пользователь системным администратором
    if (user.roles.includes('ADMIN')) {
      throw new Error('Cannot delete system administrator');
    }

    await this.userRepository.delete(id);
  }
}
