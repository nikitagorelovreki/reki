import { Device, DeviceStatus } from '../models/device.model';

describe('Device Model', () => {
  let device: Device;
  const mockDeviceData = {
    id: 'device-123',
    serial: 'SN001',
    model: 'TestDevice',
    status: DeviceStatus.REGISTERED,
  };

  beforeEach(() => {
    device = new Device(mockDeviceData);
  });

  describe('Constructor', () => {
    it('should create device with provided data', () => {
      expect(device.id).toBe('device-123');
      expect(device.serial).toBe('SN001');
      expect(device.model).toBe('TestDevice');
      expect(device.status).toBe(DeviceStatus.REGISTERED);
    });

    it('should set default values for timestamps', () => {
      const newDevice = new Device({ serial: 'SN002', model: 'TestDevice2' });
      expect(newDevice.createdAt).toBeInstanceOf(Date);
      expect(newDevice.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default status to REGISTERED', () => {
      const newDevice = new Device({ serial: 'SN003', model: 'TestDevice3' });
      expect(newDevice.status).toBe(DeviceStatus.REGISTERED);
    });

    it('should preserve provided timestamps', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      const newDevice = new Device({
        serial: 'SN004',
        model: 'TestDevice4',
        createdAt,
        updatedAt,
      });
      expect(newDevice.createdAt).toBe(createdAt);
      expect(newDevice.updatedAt).toBe(updatedAt);
    });
  });

  describe('updateStatus', () => {
    it('should update device status', () => {
      const originalUpdatedAt = device.updatedAt;
      
      // Wait a moment to ensure different timestamp
      setTimeout(() => {
        device.updateStatus(DeviceStatus.AT_CLINIC);
        
        expect(device.status).toBe(DeviceStatus.AT_CLINIC);
        expect(device.updatedAt).not.toBe(originalUpdatedAt);
        expect(device.updatedAt).toBeInstanceOf(Date);
      }, 1);
    });

    it('should update timestamp when status changes', () => {
      const originalUpdatedAt = device.updatedAt;
      
      device.updateStatus(DeviceStatus.UNDER_SERVICE);
      
      expect(device.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('assignToPatient', () => {
    it('should assign device to patient', () => {
      const patientId = 'patient-456';
      const originalUpdatedAt = device.updatedAt;
      
      device.assignToPatient(patientId);
      
      expect(device.assignedPatientId).toBe(patientId);
      expect(device.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should update timestamp when assigning to patient', () => {
      const originalUpdatedAt = device.updatedAt;
      
      device.assignToPatient('patient-789');
      
      expect(device.updatedAt).not.toBe(originalUpdatedAt);
    });
  });

  describe('unassignFromPatient', () => {
    it('should unassign device from patient', () => {
      // First assign a patient
      device.assignToPatient('patient-456');
      expect(device.assignedPatientId).toBe('patient-456');
      
      const originalUpdatedAt = device.updatedAt;
      
      device.unassignFromPatient();
      
      expect(device.assignedPatientId).toBeUndefined();
      expect(device.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should handle unassigning when no patient is assigned', () => {
      expect(device.assignedPatientId).toBeUndefined();
      
      device.unassignFromPatient();
      
      expect(device.assignedPatientId).toBeUndefined();
    });
  });

  describe('isActive', () => {
    it('should return true when device is at clinic', () => {
      device.updateStatus(DeviceStatus.AT_CLINIC);
      expect(device.isActive()).toBe(true);
    });

    it('should return true when device is at patient home', () => {
      device.updateStatus(DeviceStatus.AT_PATIENT_HOME);
      expect(device.isActive()).toBe(true);
    });

    it('should return false when device is registered', () => {
      device.updateStatus(DeviceStatus.REGISTERED);
      expect(device.isActive()).toBe(false);
    });

    it('should return false when device is under service', () => {
      device.updateStatus(DeviceStatus.UNDER_SERVICE);
      expect(device.isActive()).toBe(false);
    });

    it('should return false when device is decommissioned', () => {
      device.updateStatus(DeviceStatus.DECOMMISSIONED);
      expect(device.isActive()).toBe(false);
    });
  });

  describe('Optional Properties', () => {
    it('should handle optional properties correctly', () => {
      const deviceWithOptional = new Device({
        serial: 'SN005',
        model: 'TestDevice5',
        qrCode: 'QR123',
        externalIds: { system1: 'ext-123' },
        hardwareRevision: '1.0',
        firmwareVersion: '2.0',
        currentLocation: 'Room 101',
        clinicId: 'clinic-1',
        ownerId: 'owner-1',
        responsibleUserId: 'user-1',
        warrantyUntil: new Date('2025-12-31'),
        purchaseOrder: 'PO-123',
        lastSeenAt: new Date(),
        lastSyncAt: new Date(),
        telemetryEndpoint: 'https://api.example.com/telemetry',
        maintenanceNotes: { note: 'Regular maintenance' },
      });

      expect(deviceWithOptional.qrCode).toBe('QR123');
      expect(deviceWithOptional.externalIds).toEqual({ system1: 'ext-123' });
      expect(deviceWithOptional.hardwareRevision).toBe('1.0');
      expect(deviceWithOptional.firmwareVersion).toBe('2.0');
      expect(deviceWithOptional.currentLocation).toBe('Room 101');
      expect(deviceWithOptional.clinicId).toBe('clinic-1');
      expect(deviceWithOptional.ownerId).toBe('owner-1');
      expect(deviceWithOptional.responsibleUserId).toBe('user-1');
      expect(deviceWithOptional.warrantyUntil).toBeInstanceOf(Date);
      expect(deviceWithOptional.purchaseOrder).toBe('PO-123');
      expect(deviceWithOptional.lastSeenAt).toBeInstanceOf(Date);
      expect(deviceWithOptional.lastSyncAt).toBeInstanceOf(Date);
      expect(deviceWithOptional.telemetryEndpoint).toBe('https://api.example.com/telemetry');
      expect(deviceWithOptional.maintenanceNotes).toEqual({ note: 'Regular maintenance' });
    });
  });
});