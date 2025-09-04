/**
 * Level 2: API Integration Tests - Core API Server
 * Tests REST API endpoints with real HTTP server and database
 */

import request from 'supertest';

describe('Core API - Level 2 Integration Tests', () => {
  let app: any;
  let db: any;

  beforeAll(async () => {
    db = global.testDb.getKnex();
    
    // Create test app instance
    const { createApp } = await import('@reki/app-core-server');
    app = await createApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Clients API', () => {
    it('POST /api/clients - should create new client', async () => {
      const clientData = global.testUtils.generateTestClient({
        firstName: 'Тестовый',
        lastName: 'Клиент API',
        email: 'api.test@example.com'
      });

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.firstName).toBe('Тестовый');
      expect(response.body.lastName).toBe('Клиент API');
      expect(response.body.email).toBe('api.test@example.com');

      // Verify in database
      const savedClient = await db('clients').where('id', response.body.id).first();
      expect(savedClient).toBeDefined();
      expect(savedClient.first_name).toBe('Тестовый');
    });

    it('GET /api/clients - should return paginated clients', async () => {
      // Create test clients
      for (let i = 0; i < 3; i++) {
        const clientData = global.testUtils.generateTestClient({
          firstName: `Client${i}`
        });
        await request(app).post('/api/clients').send(clientData);
      }

      const response = await request(app)
        .get('/api/clients?page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(2);
    });

    it('GET /api/clients/:id - should return specific client', async () => {
      const clientData = global.testUtils.generateTestClient();
      const createResponse = await request(app).post('/api/clients').send(clientData);
      const clientId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/clients/${clientId}`)
        .expect(200);

      expect(response.body.id).toBe(clientId);
      expect(response.body.firstName).toBe(clientData.firstName);
    });

    it('PUT /api/clients/:id - should update client', async () => {
      const clientData = global.testUtils.generateTestClient();
      const createResponse = await request(app).post('/api/clients').send(clientData);
      const clientId = createResponse.body.id;

      const updateData = {
        firstName: 'Обновленный',
        status: 'completed_therapy'
      };

      const response = await request(app)
        .put(`/api/clients/${clientId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe('Обновленный');
      expect(response.body.status).toBe('completed_therapy');
    });

    it('DELETE /api/clients/:id - should delete client', async () => {
      const clientData = global.testUtils.generateTestClient();
      const createResponse = await request(app).post('/api/clients').send(clientData);
      const clientId = createResponse.body.id;

      await request(app)
        .delete(`/api/clients/${clientId}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/clients/${clientId}`)
        .expect(404);
    });

    it('POST /api/clients - should validate required fields', async () => {
      const invalidClient = {
        firstName: '',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(invalidClient)
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toContain('firstName is required');
    });
  });

  describe('Devices API', () => {
    it('POST /api/devices - should create new device', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        model: 'API Test Device',
        serialNumber: 'API-TEST-001'
      });

      const response = await request(app)
        .post('/api/devices')
        .send(deviceData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.model).toBe('API Test Device');
      expect(response.body.serialNumber).toBe('API-TEST-001');
      expect(response.body.status).toBe('IN_STOCK');
    });

    it('GET /api/devices - should return devices with filtering', async () => {
      // Create devices with different statuses
      await request(app).post('/api/devices').send({
        ...global.testUtils.generateTestDevice(),
        status: 'IN_STOCK'
      });
      
      await request(app).post('/api/devices').send({
        ...global.testUtils.generateTestDevice(),
        status: 'AT_CLINIC'
      });

      // Filter by status
      const response = await request(app)
        .get('/api/devices?status=IN_STOCK')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('IN_STOCK');
    });

    it('PUT /api/devices/:id/status - should update device status', async () => {
      const deviceData = global.testUtils.generateTestDevice();
      const createResponse = await request(app).post('/api/devices').send(deviceData);
      const deviceId = createResponse.body.id;

      const statusUpdate = {
        status: 'AT_CLINIC',
        location: {
          clinicId: 'clinic-123',
          assignedTo: 'Dr. Smith'
        }
      };

      const response = await request(app)
        .put(`/api/devices/${deviceId}/status`)
        .send(statusUpdate)
        .expect(200);

      expect(response.body.status).toBe('AT_CLINIC');
      expect(response.body.location.clinicId).toBe('clinic-123');
    });

    it('POST /api/devices - should prevent duplicate serial numbers', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        serialNumber: 'DUPLICATE-001'
      });

      await request(app).post('/api/devices').send(deviceData).expect(201);

      await request(app)
        .post('/api/devices')
        .send(deviceData)
        .expect(409);
    });
  });

  describe('Forms API', () => {
    let formTemplateId: string;

    beforeEach(async () => {
      const formData = global.testUtils.generateTestForm({
        name: 'API Test Form',
        fields: [
          {
            name: 'score',
            type: 'number',
            label: 'Score',
            required: true,
            validation: { min: 1, max: 10 }
          }
        ]
      });

      const response = await request(app).post('/api/forms/templates').send(formData);
      formTemplateId = response.body.id;
    });

    it('POST /api/forms/templates - should create form template', async () => {
      const formData = global.testUtils.generateTestForm({
        name: 'New API Form'
      });

      const response = await request(app)
        .post('/api/forms/templates')
        .send(formData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('New API Form');
      expect(response.body.fields).toBeDefined();
    });

    it('POST /api/forms/submissions - should submit form', async () => {
      // Create client first
      const clientData = global.testUtils.generateTestClient();
      const clientResponse = await request(app).post('/api/clients').send(clientData);
      const clientId = clientResponse.body.id;

      const submissionData = {
        templateId: formTemplateId,
        clientId: clientId,
        submittedBy: 'therapist-001',
        data: {
          score: 8
        }
      };

      const response = await request(app)
        .post('/api/forms/submissions')
        .send(submissionData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.templateId).toBe(formTemplateId);
      expect(response.body.clientId).toBe(clientId);
      expect(response.body.data.score).toBe(8);
    });

    it('POST /api/forms/submissions - should validate submission data', async () => {
      const clientData = global.testUtils.generateTestClient();
      const clientResponse = await request(app).post('/api/clients').send(clientData);
      const clientId = clientResponse.body.id;

      const invalidSubmission = {
        templateId: formTemplateId,
        clientId: clientId,
        submittedBy: 'therapist-001',
        data: {
          score: 15 // Exceeds max validation
        }
      };

      const response = await request(app)
        .post('/api/forms/submissions')
        .send(invalidSubmission)
        .expect(400);

      expect(response.body.errors).toContain('score exceeds maximum value');
    });

    it('GET /api/forms/submissions - should return submissions with pagination', async () => {
      // Create client
      const clientData = global.testUtils.generateTestClient();
      const clientResponse = await request(app).post('/api/clients').send(clientData);
      const clientId = clientResponse.body.id;

      // Create multiple submissions
      for (let i = 0; i < 3; i++) {
        await request(app).post('/api/forms/submissions').send({
          templateId: formTemplateId,
          clientId: clientId,
          submittedBy: 'therapist-001',
          data: { score: i + 1 }
        });
      }

      const response = await request(app)
        .get('/api/forms/submissions?page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent resources', async () => {
      await request(app)
        .get('/api/clients/non-existent-id')
        .expect(404);

      await request(app)
        .get('/api/devices/non-existent-id') 
        .expect(404);
    });

    it('should handle malformed JSON requests', async () => {
      await request(app)
        .post('/api/clients')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should return proper validation errors', async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });

  describe('Performance and Load', () => {
    it('should handle concurrent requests', async () => {
      const promises = [];
      
      // Create 10 concurrent client creation requests
      for (let i = 0; i < 10; i++) {
        const clientData = global.testUtils.generateTestClient({
          email: `concurrent${i}@test.com`
        });
        promises.push(request(app).post('/api/clients').send(clientData));
      }

      const responses = await Promise.all(promises);
      
      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
      });

      // Verify all clients were created
      const allClients = await request(app).get('/api/clients');
      expect(allClients.body.total).toBe(10);
    });

    it('should handle large pagination requests', async () => {
      // Create many clients
      for (let i = 0; i < 25; i++) {
        await request(app).post('/api/clients').send(
          global.testUtils.generateTestClient()
        );
      }

      const response = await request(app)
        .get('/api/clients?page=1&limit=100')
        .expect(200);

      expect(response.body.data).toHaveLength(25);
      expect(response.body.total).toBe(25);
    });
  });
});
