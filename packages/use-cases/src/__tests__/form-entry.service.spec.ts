import { NotFoundException } from '@nestjs/common';
import { FormEntryService } from '../services/form-entry.service';
import { FormEntryModel, FormEntryStatus, IFormEntryRepository, PaginationOptions } from '@reki/domain';

describe('FormEntryService', () => {
  let service: FormEntryService;
  let mockFormEntryRepository: jest.Mocked<IFormEntryRepository>;

  const mockFormEntry = new FormEntryModel({
    id: 'entry-123',
    formId: 'form-456',
    patientId: 'patient-789',
    status: FormEntryStatus.IN_PROGRESS,
    data: { answer1: 'value1', answer2: 'value2' },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  beforeEach(() => {
    mockFormEntryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFormId: jest.fn(),
      findByPatientId: jest.fn(),
      findByDeviceId: jest.fn(),
      findByClinicId: jest.fn(),
      findByStatus: jest.fn(),
    };

    service = new FormEntryService(mockFormEntryRepository);
  });

  describe('createFormEntry', () => {
    it('should create form entry with generated id and default status', async () => {
      const formEntryData = {
        formId: 'form-abc',
        patientId: 'patient-def',
        data: { question1: 'answer1' },
      };

      mockFormEntryRepository.create.mockResolvedValue(mockFormEntry);

      const result = await service.createFormEntry(formEntryData);

      expect(mockFormEntryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          formId: 'form-abc',
          patientId: 'patient-def',
          data: { question1: 'answer1' },
          status: FormEntryStatus.IN_PROGRESS,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(mockFormEntry);
    });

    it('should preserve provided values', async () => {
      const formEntryData = {
        id: 'custom-entry-id',
        formId: 'form-xyz',
        status: FormEntryStatus.COMPLETED,
        score: 95,
      };

      mockFormEntryRepository.create.mockResolvedValue(mockFormEntry);

      await service.createFormEntry(formEntryData);

      expect(mockFormEntryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'custom-entry-id',
          status: FormEntryStatus.COMPLETED,
          score: 95,
        })
      );
    });
  });

  describe('getFormEntryById', () => {
    it('should return form entry when found', async () => {
      mockFormEntryRepository.findById.mockResolvedValue(mockFormEntry);

      const result = await service.getFormEntryById('entry-123');

      expect(mockFormEntryRepository.findById).toHaveBeenCalledWith('entry-123');
      expect(result).toBe(mockFormEntry);
    });

    it('should throw NotFoundException when form entry not found', async () => {
      mockFormEntryRepository.findById.mockResolvedValue(null);

      await expect(service.getFormEntryById('nonexistent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getFormEntryById('nonexistent')).rejects.toThrow(
        'Form entry with ID nonexistent not found'
      );
    });
  });

  describe('getAllFormEntries', () => {
    it('should return paginated form entries', async () => {
      const mockPaginatedResult = {
        data: [mockFormEntry],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockFormEntryRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllFormEntries();

      expect(mockFormEntryRepository.findAll).toHaveBeenCalledWith({});
      expect(result).toBe(mockPaginatedResult);
    });
  });

  describe('updateFormEntry', () => {
    it('should update form entry successfully', async () => {
      const updateData = {
        status: FormEntryStatus.COMPLETED,
        score: 88,
        data: { answer1: 'updated_value1' },
      };

      mockFormEntryRepository.findById.mockResolvedValue(mockFormEntry);
      const updatedEntry = new FormEntryModel({ ...mockFormEntry, ...updateData });
      mockFormEntryRepository.update.mockResolvedValue(updatedEntry);

      const result = await service.updateFormEntry('entry-123', updateData);

      expect(mockFormEntryRepository.findById).toHaveBeenCalledWith('entry-123');
      expect(mockFormEntryRepository.update).toHaveBeenCalledWith(
        'entry-123',
        expect.objectContaining({
          status: FormEntryStatus.COMPLETED,
          score: 88,
          data: { answer1: 'updated_value1' },
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(updatedEntry);
    });

    it('should throw NotFoundException when form entry not found for update', async () => {
      mockFormEntryRepository.findById.mockResolvedValue(null);

      await expect(service.updateFormEntry('nonexistent', { score: 85 }))
        .rejects.toThrow(NotFoundException);
      
      expect(mockFormEntryRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteFormEntry', () => {
    it('should delete form entry and return result', async () => {
      mockFormEntryRepository.delete.mockResolvedValue(true);

      const result = await service.deleteFormEntry('entry-123');

      expect(mockFormEntryRepository.delete).toHaveBeenCalledWith('entry-123');
      expect(result).toBe(true);
      expect(mockFormEntryRepository.findById).not.toHaveBeenCalled();
    });

    it('should return false when form entry not found for deletion', async () => {
      mockFormEntryRepository.delete.mockResolvedValue(false);

      const result = await service.deleteFormEntry('nonexistent');

      expect(mockFormEntryRepository.delete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('Business Logic Methods', () => {
    it('should complete form entry with score', async () => {
      mockFormEntryRepository.findById.mockResolvedValue(mockFormEntry);
      
      // Mock the complete method behavior
      const completedEntry = new FormEntryModel({
        ...mockFormEntry,
        status: FormEntryStatus.COMPLETED,
        score: 92,
        completedAt: new Date(),
      });
      
      mockFormEntryRepository.update.mockResolvedValue(completedEntry);

      const result = await service.completeFormEntry('entry-123', 92);

      expect(mockFormEntryRepository.findById).toHaveBeenCalledWith('entry-123');
      expect(result.status).toBe(FormEntryStatus.COMPLETED);
    });

    it('should cancel form entry', async () => {
      mockFormEntryRepository.findById.mockResolvedValue(mockFormEntry);
      
      const cancelledEntry = new FormEntryModel({
        ...mockFormEntry,
        status: FormEntryStatus.CANCELLED,
      });
      
      mockFormEntryRepository.update.mockResolvedValue(cancelledEntry);

      const result = await service.cancelFormEntry('entry-123');

      expect(mockFormEntryRepository.findById).toHaveBeenCalledWith('entry-123');
      expect(result.status).toBe(FormEntryStatus.CANCELLED);
    });
  });

  describe('Error Handling', () => {
    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Repository connection failed');
      mockFormEntryRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.getFormEntryById('entry-123')).rejects.toThrow('Repository connection failed');
    });
  });
});