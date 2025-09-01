import { FormRepository } from '../repositories/form.repository';
import { DatabaseService } from '../database/database.service';
import { FormModel, FormStatus, FormType, PaginationOptions } from '@cuis/domain';

// Mock the DatabaseService
jest.mock('../database/database.service');

describe('FormRepository', () => {
  let repository: FormRepository;
  let mockDatabaseService: jest.Mocked<DatabaseService>;
  let mockKnex: jest.MockedFunction<any>;
  let mockQueryBuilder: any;

  const mockForm = new FormModel({
    id: 'form-123',
    title: 'Test Form',
    description: 'Test description',
    type: FormType.ASSESSMENT,
    status: FormStatus.DRAFT,
    version: 1,
    schema: { fields: [] },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  const mockDbRow = {
    id: 'form-123',
    title: 'Test Form',
    description: 'Test description',
    type: 'assessment',
    status: 'draft',
    version: 1,
    schema: JSON.stringify({ fields: [] }),
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

    repository = new FormRepository(mockDatabaseService);
  });

  describe('create', () => {
    it('should create a form and return it', async () => {
      mockQueryBuilder.returning.mockResolvedValue([mockDbRow]);

      const result = await repository.create(mockForm);

      expect(mockKnex).toHaveBeenCalledWith('form_templates');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
        id: 'form-123',
        title: 'Test Form',
        type: 'assessment',
        status: 'draft',
        version: 1,
      }));
      expect(result).toBeInstanceOf(FormModel);
      expect(result.title).toBe('Test Form');
    });
  });

  describe('findById', () => {
    it('should find form by id', async () => {
      mockQueryBuilder.first.mockResolvedValue(mockDbRow);

      const result = await repository.findById('form-123');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'form-123' });
      expect(result).toBeInstanceOf(FormModel);
      expect(result?.id).toBe('form-123');
    });

    it('should return null when form not found', async () => {
      mockQueryBuilder.first.mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update form and return updated form', async () => {
      const updatedForm = new FormModel({
        ...mockForm,
        status: FormStatus.ACTIVE,
        title: 'Updated Form',
      });

      mockQueryBuilder.returning.mockResolvedValue([{
        ...mockDbRow,
        status: 'active',
        title: 'Updated Form',
      }]);

      const result = await repository.update('form-123', updatedForm);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'form-123' });
      expect(result.status).toBe(FormStatus.ACTIVE);
      expect(result.title).toBe('Updated Form');
    });
  });

  describe('delete', () => {
    it('should delete form by id', async () => {
      mockQueryBuilder.del.mockResolvedValue(1);

      await repository.delete('form-123');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'form-123' });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database error');
      mockQueryBuilder.first.mockRejectedValue(dbError);

      await expect(repository.findById('form-123')).rejects.toThrow('Database error');
    });
  });
});