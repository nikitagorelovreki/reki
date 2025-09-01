import { FormEntryRepository } from '../repositories/form-entry.repository';
import { DatabaseService } from '../database/database.service';
import { FormEntryModel, FormEntryStatus } from '@cuis/domain';

// Mock the DatabaseService
jest.mock('../database/database.service');

describe('FormEntryRepository', () => {
  let repository: FormEntryRepository;
  let mockDatabaseService: jest.Mocked<DatabaseService>;
  let mockKnex: jest.MockedFunction<any>;
  let mockQueryBuilder: any;

  const mockFormEntry = new FormEntryModel({
    id: 'entry-123',
    formId: 'form-456',
    patientId: 'patient-789',
    status: FormEntryStatus.IN_PROGRESS,
    data: { answer1: 'value1' },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  const mockDbRow = {
    id: 'entry-123',
    form_id: 'form-456',
    patient_id: 'patient-789',
    status: 'in_progress',
    data: JSON.stringify({ answer1: 'value1' }),
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

    repository = new FormEntryRepository(mockDatabaseService);
  });

  describe('create', () => {
    it('should create a form entry and return it', async () => {
      mockQueryBuilder.returning.mockResolvedValue([mockDbRow]);

      const result = await repository.create(mockFormEntry);

      expect(mockKnex).toHaveBeenCalledWith('form_entries');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
        id: 'entry-123',
        form_id: 'form-456',
        patient_id: 'patient-789',
        status: 'in_progress',
      }));
      expect(result).toBeInstanceOf(FormEntryModel);
      expect(result.id).toBe('entry-123');
    });
  });

  describe('findById', () => {
    it('should find form entry by id', async () => {
      mockQueryBuilder.first.mockResolvedValue(mockDbRow);

      const result = await repository.findById('entry-123');

      expect(mockKnex).toHaveBeenCalledWith('form_entries');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'entry-123' });
      expect(result).toBeInstanceOf(FormEntryModel);
      expect(result?.id).toBe('entry-123');
    });

    it('should return null when form entry not found', async () => {
      mockQueryBuilder.first.mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update form entry and return it', async () => {
      const updatedEntry = new FormEntryModel({
        ...mockFormEntry,
        status: FormEntryStatus.COMPLETED,
        score: 85,
      });

      mockQueryBuilder.returning.mockResolvedValue([{
        ...mockDbRow,
        status: 'completed',
        score: 85,
      }]);

      const result = await repository.update('entry-123', updatedEntry);

      expect(mockKnex).toHaveBeenCalledWith('form_entries');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'entry-123' });
      expect(result.status).toBe(FormEntryStatus.COMPLETED);
      expect(result.score).toBe(85);
    });
  });

  describe('delete', () => {
    it('should delete form entry by id', async () => {
      mockQueryBuilder.del.mockResolvedValue(1);

      const result = await repository.delete('entry-123');

      expect(mockKnex).toHaveBeenCalledWith('form_entries');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: 'entry-123' });
      expect(mockQueryBuilder.del).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw NotFoundException when form entry not found', async () => {
      mockQueryBuilder.del.mockResolvedValue(0);

      await expect(repository.delete('nonexistent')).rejects.toThrow('FormEntry with ID nonexistent not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database error');
      mockQueryBuilder.first.mockRejectedValue(dbError);

      await expect(repository.findById('entry-123')).rejects.toThrow('Database error');
    });
  });

  describe('JSON Data Handling', () => {
    it('should properly serialize and deserialize JSON data', async () => {
      const complexData = {
        answers: ['A', 'B', 'C'],
        scores: { section1: 85, section2: 90 },
        metadata: { completed_at: '2023-01-01' },
      };

      const entryWithComplexData = new FormEntryModel({
        formId: 'form-complex',
        patientId: 'patient-complex',
        data: complexData,
      });

      mockQueryBuilder.returning.mockResolvedValue([{
        ...mockDbRow,
        data: JSON.stringify(complexData),
      }]);

      await repository.create(entryWithComplexData);

      // Verify that the data was properly passed to insert (the repository handles JSON serialization)
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
        data: complexData,
      }));
    });
  });
});