/**
 * Level 1: Backend Functional Tests - Device Service
 * Tests device management with real database, mocked HTTP
 */

import { DeviceService } from '../../src/device.service';
import { DeviceRepository } from '@reki/core-persistence';
import { CreateDeviceRequest, UpdateDeviceRequest, DeviceStatus } from '@reki/core-domain';

describe('DeviceService - Functional Tests', () => {
  let deviceService: DeviceService;
  let deviceRepository: DeviceRepository;
  let db: any;

  beforeAll(() => {
    db = global.getTestDb();
    deviceRepository = new DeviceRepository(db);
    deviceService = new DeviceService(deviceRepository);
  });

  describe('Device Registration', () => {
    it('should register new device and update inventory', async () => {
      const createRequest: CreateDeviceRequest = {
        model: 'RehabDevice Pro',
        serialNumber: 'RD-2024-001',
        manufactureDate: new Date('2024-01-15'),
        status: DeviceStatus.IN_STOCK,
        specifications: {
          weight: '2.5kg',
          dimensions: '30x20x15cm',
          powerRequirement: '220V'
        }
      };

      // Mock inventory management service
      global.mockHttp.mockExternalAPI.mockResolvedValue({ 
        inventory_updated: true,
        stock_count: 10 
      });

      const result = await deviceService.registerDevice(createRequest);

      // Verify service response
      expect(result.id).toBeDefined();
      expect(result.model).toBe('RehabDevice Pro');
      expect(result.serialNumber).toBe('RD-2024-001');
      expect(result.status).toBe(DeviceStatus.IN_STOCK);

      // Verify database persistence
      const savedDevice = await db('devices').where('id', result.id).first();
      expect(savedDevice).toBeDefined();
      expect(savedDevice.model).toBe('RehabDevice Pro');
      expect(savedDevice.serial_number).toBe('RD-2024-001');
      expect(savedDevice.status).toBe('IN_STOCK');

      // Verify inventory system was updated
      expect(global.mockHttp.mockExternalAPI).toHaveBeenCalledWith({
        endpoint: '/inventory/update',
        method: 'POST',
        data: expect.objectContaining({
          deviceId: result.id,
          action: 'add_to_stock'
        })
      });
    });

    it('should prevent duplicate serial numbers', async () => {
      const deviceData = global.testUtils.generateTestDevice({
        serialNumber: 'DUPLICATE-001'
      });

      await deviceService.registerDevice(deviceData);

      await expect(deviceService.registerDevice(deviceData))
        .rejects.toThrow('Serial number already exists');
    });

    it('should validate device specifications', async () => {
      const invalidDevice = {
        model: '',
        serialNumber: 'INVALID',
        status: 'INVALID_STATUS'
      } as CreateDeviceRequest;

      await expect(deviceService.registerDevice(invalidDevice))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('Device Status Management', () => {
    let deviceId: string;

    beforeEach(async () => {
      const device = await deviceService.registerDevice(
        global.testUtils.generateTestDevice()
      );
      deviceId = device.id;
    });

    it('should update device status and trigger notifications', async () => {
      global.mockHttp.mockEmailService.mockResolvedValue({ sent: true });
      global.mockHttp.mockExternalAPI.mockResolvedValue({ tracking_updated: true });

      const result = await deviceService.updateDeviceStatus(
        deviceId, 
        DeviceStatus.AT_CLINIC,
        { clinicId: 'clinic-123', assignedTo: 'Dr. Smith' }
      );

      // Verify status update
      expect(result.status).toBe(DeviceStatus.AT_CLINIC);
      expect(result.location).toEqual({
        clinicId: 'clinic-123',
        assignedTo: 'Dr. Smith'
      });

      // Verify database update
      const updatedDevice = await db('devices').where('id', deviceId).first();
      expect(updatedDevice.status).toBe('AT_CLINIC');

      // Verify tracking system notification
      expect(global.mockHttp.mockExternalAPI).toHaveBeenCalledWith({
        endpoint: '/tracking/update',
        method: 'PUT',
        data: expect.objectContaining({
          deviceId: deviceId,
          newStatus: 'AT_CLINIC',
          location: expect.objectContaining({
            clinicId: 'clinic-123'
          })
        })
      });
    });

    it('should handle invalid status transitions', async () => {
      // First set to maintenance
      await deviceService.updateDeviceStatus(deviceId, DeviceStatus.MAINTENANCE);

      // Try invalid transition from maintenance to at_client
      await expect(
        deviceService.updateDeviceStatus(deviceId, DeviceStatus.AT_CLIENT)
      ).rejects.toThrow('Invalid status transition');
    });

    it('should create status history log', async () => {
      await deviceService.updateDeviceStatus(deviceId, DeviceStatus.AT_CLINIC);
      await deviceService.updateDeviceStatus(deviceId, DeviceStatus.MAINTENANCE);

      const statusHistory = await deviceService.getDeviceStatusHistory(deviceId);
      
      expect(statusHistory).toHaveLength(3); // IN_STOCK, AT_CLINIC, MAINTENANCE
      expect(statusHistory[0].status).toBe('IN_STOCK');
      expect(statusHistory[1].status).toBe('AT_CLINIC');
      expect(statusHistory[2].status).toBe('MAINTENANCE');
    });
  });

  describe('Device Maintenance', () => {
    let deviceId: string;

    beforeEach(async () => {
      const device = await deviceService.registerDevice(
        global.testUtils.generateTestDevice()
      );
      deviceId = device.id;
    });

    it('should schedule maintenance and create maintenance record', async () => {
      const maintenanceData = {
        scheduledDate: new Date('2024-12-01'),
        type: 'routine_inspection',
        notes: 'Regular 6-month maintenance',
        technician: 'tech-001'
      };

      global.mockHttp.mockEmailService.mockResolvedValue({ sent: true });

      const result = await deviceService.scheduleMaintenance(deviceId, maintenanceData);

      expect(result.maintenanceId).toBeDefined();
      expect(result.scheduledDate).toEqual(maintenanceData.scheduledDate);

      // Verify maintenance record in database
      const maintenance = await db('device_maintenance')
        .where('device_id', deviceId)
        .first();
      
      expect(maintenance).toBeDefined();
      expect(maintenance.type).toBe('routine_inspection');
      expect(maintenance.technician).toBe('tech-001');

      // Verify technician notification
      expect(global.mockHttp.mockEmailService).toHaveBeenCalledWith({
        to: expect.stringContaining('tech-001'),
        template: 'maintenance_scheduled',
        data: expect.objectContaining({
          deviceId: deviceId,
          scheduledDate: maintenanceData.scheduledDate
        })
      });
    });

    it('should complete maintenance and update device status', async () => {
      // First schedule maintenance
      const scheduled = await deviceService.scheduleMaintenance(deviceId, {
        scheduledDate: new Date(),
        type: 'routine_inspection'
      });

      const completionData = {
        completedDate: new Date(),
        results: 'Device passed all checks',
        nextMaintenanceDate: new Date('2025-06-01'),
        partsReplaced: ['sensor_01', 'cable_02']
      };

      const result = await deviceService.completeMaintenance(
        scheduled.maintenanceId,
        completionData
      );

      expect(result.status).toBe('completed');
      expect(result.results).toBe('Device passed all checks');

      // Verify device is back in stock
      const device = await deviceService.getDeviceById(deviceId);
      expect(device.status).toBe(DeviceStatus.IN_STOCK);
    });
  });

  describe('Device Analytics', () => {
    beforeEach(async () => {
      // Create devices with different statuses
      const devices = [
        { ...global.testUtils.generateTestDevice(), status: DeviceStatus.IN_STOCK },
        { ...global.testUtils.generateTestDevice(), status: DeviceStatus.AT_CLINIC },
        { ...global.testUtils.generateTestDevice(), status: DeviceStatus.AT_CLIENT },
        { ...global.testUtils.generateTestDevice(), status: DeviceStatus.MAINTENANCE }
      ];

      for (const device of devices) {
        await deviceService.registerDevice(device);
      }
    });

    it('should calculate device utilization statistics', async () => {
      const stats = await deviceService.getDeviceStatistics();

      expect(stats.total).toBe(4);
      expect(stats.byStatus).toEqual({
        IN_STOCK: 1,
        AT_CLINIC: 1,
        AT_CLIENT: 1,
        MAINTENANCE: 1
      });
      expect(stats.utilizationRate).toBeCloseTo(0.5); // 2 out of 4 in use
    });

    it('should generate maintenance schedule report', async () => {
      const report = await deviceService.getMaintenanceSchedule();
      
      expect(report.upcomingMaintenance).toBeDefined();
      expect(report.overdueMaintenance).toBeDefined();
      expect(Array.isArray(report.upcomingMaintenance)).toBe(true);
    });

    it('should track device usage patterns', async () => {
      const deviceId = (await deviceService.getDevices({}))[0].id;
      
      // Simulate usage tracking
      await deviceService.logDeviceUsage(deviceId, {
        sessionStart: new Date('2024-01-01T10:00:00'),
        sessionEnd: new Date('2024-01-01T11:30:00'),
        patientId: 'patient-123',
        therapyType: 'mobility_training'
      });

      const usageStats = await deviceService.getDeviceUsageStats(deviceId);
      
      expect(usageStats.totalSessions).toBe(1);
      expect(usageStats.averageSessionDuration).toBe(90); // minutes
      expect(usageStats.mostCommonTherapyType).toBe('mobility_training');
    });
  });

  describe('Error Recovery', () => {
    it('should handle external service failures gracefully', async () => {
      global.mockHttp.mockExternalAPI.mockRejectedValue(
        new Error('Inventory service unavailable')
      );

      const deviceData = global.testUtils.generateTestDevice();
      
      // Should still register device locally
      const result = await deviceService.registerDevice(deviceData);
      expect(result.id).toBeDefined();

      // Should queue inventory update for later
      const queuedUpdates = await db('pending_inventory_updates')
        .where('device_id', result.id);
      expect(queuedUpdates).toHaveLength(1);
    });

    it('should validate business rules for status transitions', async () => {
      const device = await deviceService.registerDevice(
        global.testUtils.generateTestDevice()
      );

      // Try to set AT_CLIENT without client assignment
      await expect(
        deviceService.updateDeviceStatus(device.id, DeviceStatus.AT_CLIENT)
      ).rejects.toThrow('Client assignment required for AT_CLIENT status');
    });
  });
});
