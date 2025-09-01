import { ClientRepository } from '../repositories/client.repository';
import { DatabaseService } from '../database/database.service';
import { Client, ClientStatus, PaginationOptions } from '@reki/domain';

// Mock the DatabaseService
jest.mock('../database/database.service');

describe('ClientRepository', () => {
  let repository: ClientRepository;
  let mockDatabaseService: jest.Mocked<DatabaseService>;
  let mockKnex: jest.MockedFunction<any>;
  let mockQueryBuilder: any;

  const mockClient: Client = new Client({
    id: 'client-123',
    fullName: 'Иван Иванов',
    firstName: 'Иван',
    lastName: 'Иванов',
    status: ClientStatus.INTAKE,
    clinicId: 'clinic-1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  const mockDbRow = {
    id: 'client-123',
    full_name: 'Иван Иванов',
    first_name: 'Иван',
    last_name: 'Иванов',
    status: 'intake',
    clinic_id: 'clinic-1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  beforeEach(() => {
    // Create mock query builder methods
    mockQueryBuilder = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      whereIn: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(mockDbRow),
      count: jest.fn().mockResolvedValue([{ 'count(*)': 1 }]),
    };

    // Mock the knex function to return the query builder
    mockKnex = jest.fn().mockReturnValue(mockQueryBuilder);

    mockDatabaseService = {
      knex: mockKnex,
    } as any;

    repository = new ClientRepository(mockDatabaseService);
  });

  describe('create', () => {
    it('should create a client and return it', async () => {
      mockQueryBuilder.returning.mockResolvedValue([mockDbRow]);

      const result = await repository.create(mockClient);

      expect(mockKnex).toHaveBeenCalledWith('patients');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
        id: 'client-123',
        full_name: 'Иван Иванов',
        first_name: 'Иван',
        last_name: 'Иванов',
        status: 'intake',
        clinic_id: 'clinic-1',
      }));
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toBe('client-123');
      expect(result.fullName).toBe('Иван Иванов');
    });
  });

  describe('findById', () => {
    it('should find client by id', async () => {
      mockQueryBuilder.first.mockResolvedValue(mockDbRow);

      const result = await repository.findById('client-123');

      expect(mockKnex).toHaveBeenCalledWith('patients');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'client-123' });
      expect(mockQueryBuilder.first).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Client);
      expect(result?.id).toBe('client-123');
    });

    it('should return null when client not found', async () => {
      mockQueryBuilder.first.mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update client and return updated client', async () => {
      const updatedClient = new Client({
        ...mockClient,
        status: ClientStatus.ACTIVE_THERAPY,
        updatedAt: new Date('2023-02-01'),
      });

      mockQueryBuilder.returning.mockResolvedValue([{
        ...mockDbRow,
        status: 'active_therapy',
        updated_at: new Date('2023-02-01'),
      }]);

      const result = await repository.update('client-123', updatedClient);

      expect(mockKnex).toHaveBeenCalledWith('patients');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'client-123' });
      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(result.status).toBe(ClientStatus.ACTIVE_THERAPY);
    });
  });

  describe('delete', () => {
    it('should delete client by id', async () => {
      mockQueryBuilder.del.mockResolvedValue(1);

      await repository.delete('client-123');

      expect(mockKnex).toHaveBeenCalledWith('patients');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'client-123' });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockQueryBuilder.first.mockRejectedValue(dbError);

      await expect(repository.findById('client-123')).rejects.toThrow('Database connection failed');
    });

    it('should handle update errors gracefully', async () => {
      const dbError = new Error('Constraint violation');
      mockQueryBuilder.returning.mockRejectedValue(dbError);

      await expect(repository.update('client-123', mockClient)).rejects.toThrow('Constraint violation');
    });
  });
});