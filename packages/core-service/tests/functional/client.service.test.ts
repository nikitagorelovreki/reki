/**
 * Level 1: Backend Functional Tests - Client Service
 * Tests core business logic with real database, mocked HTTP
 */

import { ClientService } from '../../src/client.service';
import { ClientRepository } from '@reki/core-persistence';
import { CreateClientRequest, UpdateClientRequest } from '@reki/core-domain';

describe('ClientService - Functional Tests', () => {
  let clientService: ClientService;
  let clientRepository: ClientRepository;
  let db: any;

  beforeAll(() => {
    db = global.getTestDb();
    clientRepository = new ClientRepository(db);
    clientService = new ClientService(clientRepository);
  });

  describe('Client Creation', () => {
    it('should create client with valid data and save to database', async () => {
      const createRequest: CreateClientRequest = {
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan.petrov@example.com',
        phone: '+7900123456',
        dateOfBirth: new Date('1990-05-15'),
        status: 'active_therapy'
      };

      // Mock external HTTP calls (notifications, etc.)
      global.mockHttp.mockEmailService.mockResolvedValue({ sent: true });

      const result = await clientService.createClient(createRequest);

      // Verify service response
      expect(result.id).toBeDefined();
      expect(result.firstName).toBe('Иван');
      expect(result.lastName).toBe('Петров');
      expect(result.email).toBe('ivan.petrov@example.com');
      expect(result.status).toBe('active_therapy');

      // Verify data persisted in database
      const savedClient = await db('clients').where('id', result.id).first();
      expect(savedClient).toBeDefined();
      expect(savedClient.first_name).toBe('Иван');
      expect(savedClient.last_name).toBe('Петров');
      expect(savedClient.email).toBe('ivan.petrov@example.com');

      // Verify email notification was sent
      expect(global.mockHttp.mockEmailService).toHaveBeenCalledWith({
        to: 'ivan.petrov@example.com',
        template: 'welcome',
        data: expect.objectContaining({
          firstName: 'Иван'
        })
      });
    });

    it('should validate required fields and throw error', async () => {
      const invalidRequest = {
        firstName: '',
        lastName: 'Петров',
        email: 'invalid-email',
        phone: '+7900123456'
      } as CreateClientRequest;

      await expect(clientService.createClient(invalidRequest))
        .rejects.toThrow('Validation failed');

      // Verify no data was saved
      const clientCount = await db('clients').count('* as count').first();
      expect(clientCount.count).toBe('0');
    });

    it('should prevent duplicate email registration', async () => {
      const clientData = global.testUtils.generateTestClient({
        email: 'duplicate@example.com'
      });

      // Create first client
      await clientService.createClient(clientData);

      // Try to create duplicate
      await expect(clientService.createClient(clientData))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('Client Updates', () => {
    let existingClientId: string;

    beforeEach(async () => {
      const client = await clientService.createClient(
        global.testUtils.generateTestClient()
      );
      existingClientId = client.id;
    });

    it('should update client data and save changes', async () => {
      const updateRequest: UpdateClientRequest = {
        firstName: 'Обновленный',
        lastName: 'Пациент',
        status: 'completed_therapy'
      };

      global.mockHttp.mockEmailService.mockResolvedValue({ sent: true });

      const result = await clientService.updateClient(existingClientId, updateRequest);

      // Verify service response
      expect(result.firstName).toBe('Обновленный');
      expect(result.lastName).toBe('Пациент');
      expect(result.status).toBe('completed_therapy');

      // Verify database changes
      const updatedClient = await db('clients').where('id', existingClientId).first();
      expect(updatedClient.first_name).toBe('Обновленный');
      expect(updatedClient.last_name).toBe('Пациент');
      expect(updatedClient.status).toBe('completed_therapy');

      // Verify status change notification
      expect(global.mockHttp.mockEmailService).toHaveBeenCalledWith({
        to: expect.any(String),
        template: 'status_change',
        data: expect.objectContaining({
          newStatus: 'completed_therapy'
        })
      });
    });

    it('should handle non-existent client update', async () => {
      const nonExistentId = 'non-existent-id';
      const updateRequest: UpdateClientRequest = {
        firstName: 'Test'
      };

      await expect(clientService.updateClient(nonExistentId, updateRequest))
        .rejects.toThrow('Client not found');
    });
  });

  describe('Client Queries', () => {
    beforeEach(async () => {
      // Create test clients
      const clients = [
        global.testUtils.generateTestClient({ 
          firstName: 'Активный',
          status: 'active_therapy'
        }),
        global.testUtils.generateTestClient({
          firstName: 'Завершенный', 
          status: 'completed_therapy'
        }),
        global.testUtils.generateTestClient({
          firstName: 'На паузе',
          status: 'on_hold'
        })
      ];

      for (const client of clients) {
        await clientService.createClient(client);
      }
    });

    it('should get clients by status filter', async () => {
      const activeClients = await clientService.getClientsByStatus('active_therapy');
      
      expect(activeClients).toHaveLength(1);
      expect(activeClients[0].firstName).toBe('Активный');
      expect(activeClients[0].status).toBe('active_therapy');
    });

    it('should get all clients with pagination', async () => {
      const result = await clientService.getClients({ page: 1, limit: 2 });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('should search clients by name', async () => {
      const results = await clientService.searchClients('Активный');
      
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Активный');
    });
  });

  describe('Client Statistics', () => {
    beforeEach(async () => {
      // Create test data for statistics
      const clients = [
        { ...global.testUtils.generateTestClient(), status: 'active_therapy' },
        { ...global.testUtils.generateTestClient(), status: 'active_therapy' },
        { ...global.testUtils.generateTestClient(), status: 'completed_therapy' },
        { ...global.testUtils.generateTestClient(), status: 'on_hold' }
      ];

      for (const client of clients) {
        await clientService.createClient(client);
      }
    });

    it('should calculate client statistics by status', async () => {
      const stats = await clientService.getClientStatistics();

      expect(stats.totalClients).toBe(4);
      expect(stats.byStatus).toEqual({
        active_therapy: 2,
        completed_therapy: 1,
        on_hold: 1
      });
    });

    it('should calculate monthly registration statistics', async () => {
      const monthlyStats = await clientService.getMonthlyRegistrations();
      
      expect(monthlyStats).toBeDefined();
      expect(monthlyStats.currentMonth).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Simulate database error
      const brokenService = new ClientService(null as any);
      
      await expect(brokenService.getClients({}))
        .rejects.toThrow('Database connection error');
    });

    it('should handle external service failures without breaking core functionality', async () => {
      global.mockHttp.mockEmailService.mockRejectedValue(new Error('Email service down'));

      const clientData = global.testUtils.generateTestClient();
      
      // Should still create client even if email fails
      const result = await clientService.createClient(clientData);
      expect(result.id).toBeDefined();

      // Verify client was saved despite email failure
      const savedClient = await db('clients').where('id', result.id).first();
      expect(savedClient).toBeDefined();
    });
  });
});
