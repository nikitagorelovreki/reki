import { Client } from '@reki/core-domain';

export interface ClientRepositoryPort {
  create(data: any): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByFullName(fullName: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findAll(page?: number, limit?: number): Promise<Client[]>;
  update(id: string, data: any): Promise<Client | null>;
  delete(id: string): Promise<void>;
}
