import { Client, ClientStatus } from '../models/client.model';
import { PaginationOptions, PaginatedResult } from './device-repository.port';

export interface ClientRepositoryPort {
  // Базовые CRUD операции
  create(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Client>>;
  update(id: string, client: Partial<Client>): Promise<Client>;
  delete(id: string): Promise<void>;
  
  // Специфичные запросы
  findByClinic(clinicId: string, options?: PaginationOptions): Promise<PaginatedResult<Client>>;
  findByStatus(status: ClientStatus, options?: PaginationOptions): Promise<PaginatedResult<Client>>;
  search(query: string, options?: PaginationOptions): Promise<PaginatedResult<Client>>;
  
  // Прямой доступ к билдеру запросов для сложных кейсов
  getQueryBuilder(): any;
}