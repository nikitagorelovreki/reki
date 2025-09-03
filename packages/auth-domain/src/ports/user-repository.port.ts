import { User } from '../models/user.model';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roles?: string[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roles?: string[];
  lastLoginAt?: Date;
}

export interface UserRepositoryPort {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(page?: number, limit?: number): Promise<User[]>;
  update(id: string, data: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<void>;
  validateCredentials(username: string, password: string): Promise<boolean>;
}
