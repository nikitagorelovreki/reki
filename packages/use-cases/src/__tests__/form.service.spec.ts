import { NotFoundException } from '@nestjs/common';
import { FormService } from '../services/form.service';
import { FormModel, FormStatus, FormType, IFormRepository, PaginationOptions } from '@cuis/domain';

describe('FormService', () => {
  let service: FormService;
  let mockFormRepository: jest.Mocked<IFormRepository>;

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

  beforeEach(() => {
    mockFormRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByTitle: jest.fn(),
      findByType: jest.fn(),
      findByStatus: jest.fn(),
      findLatestVersion: jest.fn(),
    };

    service = new FormService(mockFormRepository);
  });

  describe('createForm', () => {
    it('should create form with generated id and default values', async () => {
      const formData = {
        title: 'New Assessment',
        description: 'New assessment form',
        type: FormType.QUESTIONNAIRE,
      };

      mockFormRepository.create.mockResolvedValue(mockForm);

      const result = await service.createForm(formData);

      expect(mockFormRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Assessment',
          description: 'New assessment form',
          type: FormType.QUESTIONNAIRE,
          status: FormStatus.DRAFT,
          version: 1,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(mockForm);
    });

    it('should preserve provided values', async () => {
      const formData = {
        id: 'custom-form-id',
        title: 'Custom Form',
        status: FormStatus.ACTIVE,
        version: 3,
      };

      mockFormRepository.create.mockResolvedValue(mockForm);

      await service.createForm(formData);

      expect(mockFormRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'custom-form-id',
          status: FormStatus.ACTIVE,
          version: 3,
        })
      );
    });
  });

  describe('getFormById', () => {
    it('should return form when found', async () => {
      mockFormRepository.findById.mockResolvedValue(mockForm);

      const result = await service.getFormById('form-123');

      expect(mockFormRepository.findById).toHaveBeenCalledWith('form-123');
      expect(result).toBe(mockForm);
    });

    it('should throw NotFoundException when form not found', async () => {
      mockFormRepository.findById.mockResolvedValue(null);

      await expect(service.getFormById('nonexistent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getFormById('nonexistent')).rejects.toThrow(
        'Form with ID nonexistent not found'
      );
    });
  });

  describe('getAllForms', () => {
    it('should return paginated forms', async () => {
      const mockPaginatedResult = {
        data: [mockForm],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockFormRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllForms();

      expect(mockFormRepository.findAll).toHaveBeenCalledWith({});
      expect(result).toBe(mockPaginatedResult);
    });

    it('should pass pagination options to repository', async () => {
      const options: PaginationOptions = {
        page: 2,
        limit: 20,
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockPaginatedResult = {
        data: [mockForm],
        pagination: { page: 2, limit: 20, total: 50, totalPages: 3 },
      };
      mockFormRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllForms(options);

      expect(mockFormRepository.findAll).toHaveBeenCalledWith(options);
      expect(result).toBe(mockPaginatedResult);
    });
  });

  describe('updateForm', () => {
    it('should update form successfully', async () => {
      const updateData = {
        title: 'Updated Form Title',
        status: FormStatus.ACTIVE,
        description: 'Updated description',
      };

      mockFormRepository.findById.mockResolvedValue(mockForm);
      const updatedForm = new FormModel({ ...mockForm, ...updateData });
      mockFormRepository.update.mockResolvedValue(updatedForm);

      const result = await service.updateForm('form-123', updateData);

      expect(mockFormRepository.findById).toHaveBeenCalledWith('form-123');
      expect(mockFormRepository.update).toHaveBeenCalledWith(
        'form-123',
        expect.objectContaining({
          title: 'Updated Form Title',
          status: FormStatus.ACTIVE,
          description: 'Updated description',
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(updatedForm);
    });

    it('should throw NotFoundException when form not found for update', async () => {
      mockFormRepository.findById.mockResolvedValue(null);

      await expect(service.updateForm('nonexistent', { title: 'New Title' }))
        .rejects.toThrow(NotFoundException);
      
      expect(mockFormRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteForm', () => {
    it('should delete form and return result', async () => {
      mockFormRepository.delete.mockResolvedValue(true);

      const result = await service.deleteForm('form-123');

      expect(mockFormRepository.delete).toHaveBeenCalledWith('form-123');
      expect(result).toBe(true);
      expect(mockFormRepository.findById).not.toHaveBeenCalled();
    });

    it('should return false when form not found for deletion', async () => {
      mockFormRepository.delete.mockResolvedValue(false);

      const result = await service.deleteForm('nonexistent');

      expect(mockFormRepository.delete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('Business Logic', () => {
    it('should create new FormModel instance with updated timestamp in updateForm', async () => {
      const originalForm = new FormModel({
        id: 'original-form-id',
        title: 'Original Title',
        status: FormStatus.DRAFT,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      });

      mockFormRepository.findById.mockResolvedValue(originalForm);
      mockFormRepository.update.mockImplementation(async (id, form) => {
        return form as FormModel;
      });

      const updateData = { title: 'Updated Title' };
      const result = await service.updateForm('original-form-id', updateData);

      expect(result.title).toBe('Updated Title');
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(originalForm.updatedAt.getTime());
    });
  });

  describe('Error Handling', () => {
    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Repository connection failed');
      mockFormRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.getFormById('form-123')).rejects.toThrow('Repository connection failed');
    });
  });
});