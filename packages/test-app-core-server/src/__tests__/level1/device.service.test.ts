/**
 * Level 1: Backend Functional Tests - Device Service
 * Tests device management with real database, mocked HTTP
 */

describe('Device Service - Level 1 Tests', () => {
  let db: any;

  beforeAll(async () => {
    db = await global.testDatabase.connect();
    await global.testDatabase.runMigrations();
  });

  afterAll(async () => {
    await global.testDatabase.cleanup();
    await global.testDatabase.disconnect();
  });

  describe('Device CRUD Operations', () => {
    it('should create a new device', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        model: 'RehabDevice Pro',
        serial: 'RD-2024-001',
        status: 'IN_STOCK'
      });

      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);
      
      const result = await service.create(deviceData);

      expect(result.id).toBeDefined();
      expect(result.model).toBe('RehabDevice Pro');
      expect(result.serial).toBe('RD-2024-001');
      expect(result.status).toBe('IN_STOCK');

      // Verify database persistence
      const savedDevice = await db('devices').where('id', result.id).first();
      expect(savedDevice).toBeDefined();
      expect(savedDevice.model).toBe('RehabDevice Pro');
      expect(savedDevice.serial).toBe('RD-2024-001');
    });

    it('should find device by ID', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        serial: 'FIND-BY-ID-001'
      });

      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);

      const created = await service.create(deviceData);
      const found = await service.findById(created.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
      expect(found!.serial).toBe('FIND-BY-ID-001');
    });

    it('should find device by serial number', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        serial: 'FIND-BY-SERIAL-001'
      });

      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);

      await service.create(deviceData);
      const found = await service.findBySerial('FIND-BY-SERIAL-001');

      expect(found).toBeDefined();
      expect(found!.serial).toBe('FIND-BY-SERIAL-001');
    });

    it('should find all devices with pagination', async () => {
      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);

      // Create multiple devices
      for (let i = 1; i <= 3; i++) {
        await service.create(global.testUtils.generateTestDevice({
          serial: `FINDALL-${i.toString().padStart(3, '0')}`
        }));
      }

      const devices = await service.findAll(1, 10);
      expect(devices.length).toBeGreaterThanOrEqual(3);
    });

    it('should update device', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        serial: 'UPDATE-001',
        model: 'Original Model'
      });

      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);

      const created = await service.create(deviceData);
      const updated = await service.update(created.id, {
        model: 'Updated Model',
        status: 'MAINTENANCE'
      });

      expect(updated).toBeDefined();
      expect(updated!.model).toBe('Updated Model');
      expect(updated!.status).toBe('MAINTENANCE');
      expect(updated!.serial).toBe('UPDATE-001'); // Should remain unchanged
    });

    it('should delete device', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        serial: 'DELETE-001'
      });

      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);

      const created = await service.create(deviceData);
      await service.delete(created.id);

      const found = await service.findById(created.id);
      expect(found).toBeNull();
    });

    it('should handle non-existent device operations', async () => {
      const { DeviceService, DeviceMapper } = await import('@reki/core-service');
      const { DeviceRepository } = await import('@reki/core-persistence');
      
      const repository = new DeviceRepository(db);
      const mapper = new DeviceMapper();
      const service = new DeviceService(repository, mapper);

      const nonExistentId = 'non-existent-id';
      
      const found = await service.findById(nonExistentId);
      expect(found).toBeNull();

      const updated = await service.update(nonExistentId, { model: 'Test' });
      expect(updated).toBeNull();
    });
  });
});
