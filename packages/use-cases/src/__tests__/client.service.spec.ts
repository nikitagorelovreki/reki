import { NotFoundException } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { Client, ClientRepositoryPort, ClientStatus, PaginationOptions } from '@reki/domain';

describe('ClientService', () => {
  let service: ClientService;
  let mockClientRepository: jest.Mocked<ClientRepositoryPort>;

  const mockClient = new Client({
    id: 'client-123',
    fullName: 'Иван Иванов',
    firstName: 'Иван',
    lastName: 'Иванов',
    status: ClientStatus.INTAKE,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  beforeEach(() => {
    mockClientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByClinic: jest.fn(),
      findByStatus: jest.fn(),
      search: jest.fn(),
      getQueryBuilder: jest.fn(),
    };

    service = new ClientService(mockClientRepository);
  });

  describe('createClient', () => {
    it('should create client with generated id and default status', async () => {
      const clientData = {
        fullName: 'Петр Петров',
        firstName: 'Петр',
        lastName: 'Петров',
      };

      mockClientRepository.create.mockResolvedValue(mockClient);

      const result = await service.createClient(clientData);

      expect(mockClientRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Петр Петров',
          firstName: 'Петр',
          lastName: 'Петров',
          status: ClientStatus.INTAKE,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(mockClient);
    });

    it('should preserve provided id and status', async () => {
      const clientData = {
        id: 'custom-client-id',
        fullName: 'Анна Сидорова',
        status: ClientStatus.ACTIVE_THERAPY,
      };

      mockClientRepository.create.mockResolvedValue(mockClient);

      await service.createClient(clientData);

      expect(mockClientRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'custom-client-id',
          status: ClientStatus.ACTIVE_THERAPY,
        })
      );
    });
  });

  describe('getClientById', () => {
    it('should return client when found', async () => {
      mockClientRepository.findById.mockResolvedValue(mockClient);

      const result = await service.getClientById('client-123');

      expect(mockClientRepository.findById).toHaveBeenCalledWith('client-123');
      expect(result).toBe(mockClient);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockClientRepository.findById.mockResolvedValue(null);

      await expect(service.getClientById('nonexistent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getClientById('nonexistent')).rejects.toThrow(
        'Client with ID nonexistent not found'
      );
    });
  });

  describe('getAllClients', () => {
    it('should return paginated clients', async () => {
      const mockPaginatedResult = {
        data: [mockClient],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockClientRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllClients();

      expect(mockClientRepository.findAll).toHaveBeenCalledWith({});
      expect(result).toBe(mockPaginatedResult);
    });

    it('should pass pagination options to repository', async () => {
      const options: PaginationOptions = {
        page: 3,
        limit: 15,
        sortBy: 'fullName',
        sortOrder: 'desc',
      };

      const mockPaginatedResult = {
        data: [mockClient],
        pagination: { page: 3, limit: 15, total: 45, totalPages: 3 },
      };
      mockClientRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllClients(options);

      expect(mockClientRepository.findAll).toHaveBeenCalledWith(options);
      expect(result).toBe(mockPaginatedResult);
    });
  });

  describe('updateClient', () => {
    it('should update client successfully', async () => {
      const updateData = {
        status: ClientStatus.ACTIVE_THERAPY,
        diagnosis: 'Реабилитация после операции',
      };

      mockClientRepository.findById.mockResolvedValue(mockClient);
      const updatedClient = new Client({ ...mockClient, ...updateData });
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await service.updateClient('client-123', updateData);

      expect(mockClientRepository.findById).toHaveBeenCalledWith('client-123');
      expect(mockClientRepository.update).toHaveBeenCalledWith(
        'client-123',
        expect.objectContaining({
          status: ClientStatus.ACTIVE_THERAPY,
          diagnosis: 'Реабилитация после операции',
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(updatedClient);
    });

    it('should throw NotFoundException when client not found for update', async () => {
      mockClientRepository.findById.mockResolvedValue(null);

      await expect(service.updateClient('nonexistent', { status: ClientStatus.ACTIVE_THERAPY }))
        .rejects.toThrow(NotFoundException);
      
      expect(mockClientRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully', async () => {
      mockClientRepository.delete.mockResolvedValue(undefined);

      await service.deleteClient('client-123');

      expect(mockClientRepository.delete).toHaveBeenCalledWith('client-123');
      expect(mockClientRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('Business Logic', () => {
    it('should create new Client instance with updated timestamp in updateClient', async () => {
      const originalClient = new Client({
        id: 'original-id',
        fullName: 'Original Name',
        status: ClientStatus.INTAKE,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      });

      mockClientRepository.findById.mockResolvedValue(originalClient);
      mockClientRepository.update.mockImplementation(async (id, client) => {
        return client as Client;
      });

      const updateData = { fullName: 'Updated Name' };
      const result = await service.updateClient('original-id', updateData);

      expect(result.fullName).toBe('Updated Name');
      expect(result.updatedAt.getTime()).toBeGreaterThan(originalClient.updatedAt.getTime());
    });
  });

  describe('Error Handling', () => {
    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Repository connection failed');
      mockClientRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.getClientById('client-123')).rejects.toThrow('Repository connection failed');
    });
  });
});