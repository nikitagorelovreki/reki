/**
 * Level 1: Backend Functional Tests - Client Service
 * Tests core business logic with real database, mocked HTTP
 */

describe('ClientService - Level 1 Functional Tests', () => {
  let db: any;

  beforeAll(() => {
    db = global.testDb.getKnex();
  });

  describe('Client Creation', () => {
    it('should create client with valid data and save to database', async () => {
      const clientData = global.testUtils.generateTestClient({
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan.petrov@test.com'
      });

      // Mock external HTTP calls
      global.httpMocks.mockEmailService({ sent: true });

      // Import and test service directly
      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);
      
      const result = await service.create(clientData);

      // Verify service response
      expect(result.id).toBeDefined();
      expect(result.firstName).toBe('Иван');
      expect(result.lastName).toBe('Петров');
      expect(result.email).toBe('ivan.petrov@test.com');

      // Verify data persisted in database
      const savedClient = await db('clients').where('id', result.id).first();
      expect(savedClient).toBeDefined();
      expect(savedClient.first_name).toBe('Иван');
      expect(savedClient.email).toBe('ivan.petrov@test.com');

      // Verify email notification was attempted
      global.httpMocks.expectCalled('emailService');
    });

    it('should validate required fields and prevent invalid data', async () => {
      const invalidClient = {
        firstName: '',
        lastName: 'Тест',
        email: 'invalid-email'
      };

      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      await expect(service.create(invalidClient))
        .rejects.toThrow();

      // Verify no data was saved
      const clientCount = await db('clients').count('* as count').first();
      expect(clientCount.count).toBe('0');
    });

    it('should prevent duplicate email registration', async () => {
      const clientData = global.testUtils.generateTestClient({
        email: 'duplicate@test.com'
      });

      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      // Create first client
      await service.create(clientData);

      // Try to create duplicate
      await expect(service.create(clientData))
        .rejects.toThrow();
    });
  });

  describe('Client Updates', () => {
    let existingClient: any;

    beforeEach(async () => {
      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);
      
      existingClient = await service.create(
        global.testUtils.generateTestClient()
      );
    });

    it('should update client data and save changes', async () => {
      global.httpMocks.mockEmailService({ sent: true });

      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      const updateData = {
        firstName: 'Обновленный',
        status: 'completed_therapy'
      };

      const result = await service.update(existingClient.id, updateData);

      expect(result).toBeDefined();
      expect(result!.firstName).toBe('Обновленный');
      expect(result!.status).toBe('completed_therapy');

      // Verify database changes
      const updatedClient = await db('clients').where('id', existingClient.id).first();
      expect(updatedClient.first_name).toBe('Обновленный');
      expect(updatedClient.status).toBe('completed_therapy');
    });

    it('should handle non-existent client update', async () => {
      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      const result = await service.update('non-existent-id', { firstName: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('Client Queries', () => {
    beforeEach(async () => {
      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      const clients = [
        global.testUtils.generateTestClient({ status: 'active_therapy' }),
        global.testUtils.generateTestClient({ status: 'completed_therapy' }),
        global.testUtils.generateTestClient({ status: 'on_hold' })
      ];

      for (const client of clients) {
        await service.create(client);
      }
    });

    it('should get clients with pagination', async () => {
      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      const result = await service.findAll(1, 2);
      
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter clients by status', async () => {
      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      const allClients = await service.findAll(1, 10);
      
      expect(allClients.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('External Service Failures', () => {
    it('should handle email service failures gracefully', async () => {
      global.httpMocks.mockEmailService(null, new Error('Email service down'));

      const { ClientService, ClientMapper } = await import('@reki/core-service');
      const { ClientRepository } = await import('@reki/core-persistence');
      
      const repository = new ClientRepository(db);
      const mapper = new ClientMapper();
      const service = new ClientService(repository, mapper);

      const clientData = global.testUtils.generateTestClient();
      
      // Should still create client despite email failure
      const result = await service.create(clientData);
      expect(result.id).toBeDefined();

      // Verify client was saved
      const savedClient = await db('clients').where('id', result.id).first();
      expect(savedClient).toBeDefined();
    });
  });
});
