import { Injectable } from '@nestjs/common';
import { Client, ClientStatus, ClientRepositoryPort, PaginationOptions, PaginatedResult } from '@cuis/domain';
import { DatabaseService } from '../database/database.service';
import { objectCamelToSnake, objectSnakeToCamel } from '../utils/case-converter';

@Injectable()
export class ClientRepository implements ClientRepositoryPort {
  private readonly tableName = 'patients'; // Используем таблицу patients для клиентов
  private readonly fieldMappings: Record<string, string> = {
    fullName: 'full_name',
    firstName: 'first_name',
    lastName: 'last_name',
    middleName: 'middle_name',
    dob: 'date_of_birth',
    diagnosis: 'primary_diagnosis',
    clinicId: 'clinic_id',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private readonly db: DatabaseService) {}

  async create(client: Client): Promise<Client> {
    const dbData = objectCamelToSnake(client, this.fieldMappings);
    const [result] = await this.db.knex(this.tableName)
      .insert(dbData)
      .returning('*');
    
    return this.mapToClient(result);
  }

  async findById(id: string): Promise<Client | null> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .first();
    
    return result ? this.mapToClient(result) : null;
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    // Преобразуем camelCase поле сортировки в snake_case для SQL
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName).count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToClient(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async update(id: string, clientData: Partial<Client>): Promise<Client> {
    const dbData = objectCamelToSnake(clientData, this.fieldMappings);
    const [result] = await this.db.knex(this.tableName)
      .where({ id })
      .update({ ...dbData, updated_at: new Date() })
      .returning('*');
    
    if (!result) {
      throw new Error(`Client with ID ${id} not found`);
    }
    
    return this.mapToClient(result);
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.knex(this.tableName)
      .where({ id })
      .del();
    
    if (result === 0) {
      throw new Error(`Client with ID ${id} not found`);
    }
  }

  async findByClinic(clinicId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ clinic_id: clinicId })
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ clinic_id: clinicId })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToClient(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async findByStatus(status: ClientStatus, options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;

    const query = this.db.knex(this.tableName)
      .where({ state: status }) // Используем поле state для статуса клиента
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = this.db.knex(this.tableName)
      .where({ state: status })
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([query, countQuery]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToClient(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  async search(query: string, options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;
    
    const dbSortField = this.fieldMappings[sortBy] || sortBy;
    const searchQuery = `%${query}%`;

    const queryBuilder = this.db.knex(this.tableName)
      .where('full_name', 'ILIKE', searchQuery)
      .orWhere('primary_diagnosis', 'ILIKE', searchQuery)
      .select('*')
      .orderBy(dbSortField, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQueryBuilder = this.db.knex(this.tableName)
      .where('full_name', 'ILIKE', searchQuery)
      .orWhere('primary_diagnosis', 'ILIKE', searchQuery)
      .count('* as count');

    const [records, [{ count }]] = await Promise.all([queryBuilder, countQueryBuilder]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: records.map(record => this.mapToClient(record)),
      pagination: { page, limit, total, totalPages },
    };
  }

  getQueryBuilder() {
    return this.db.knex(this.tableName);
  }

  private mapToClient(data: any): Client {
    const clientData = objectSnakeToCamel(data, this.fieldMappings);
    
    // Маппинг специфичных полей
    if (data.state) {
      clientData.status = data.state as ClientStatus;
    }
    if (data.primary_diagnosis) {
      clientData.diagnosis = data.primary_diagnosis;
    }
    
    return new Client(clientData);
  }
}
