import { NotFoundException } from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { Device, DeviceRepositoryPort, DeviceStatus, PaginationOptions } from '@cuis/domain';

describe('DeviceService', () => {
  let service: DeviceService;
  let mockDeviceRepository: jest.Mocked<DeviceRepositoryPort>;

  const mockDevice = new Device({
    id: 'device-123',
    serial: 'SN001',
    model: 'TestDevice',
    status: DeviceStatus.REGISTERED,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  beforeEach(() => {
    mockDeviceRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySerial: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByStatus: jest.fn(),
      findByClinic: jest.fn(),
      findByPatient: jest.fn(),
      getQueryBuilder: jest.fn(),
    };

    service = new DeviceService(mockDeviceRepository);
  });

  describe('createDevice', () => {
    it('should create device with generated id and default status', async () => {
      const deviceData = {
        serial: 'SN002',
        model: 'NewDevice',
      };

      mockDeviceRepository.create.mockResolvedValue(mockDevice);

      const result = await service.createDevice(deviceData);

      expect(mockDeviceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          serial: 'SN002',
          model: 'NewDevice',
          status: DeviceStatus.REGISTERED,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(mockDevice);
    });

    it('should preserve provided id and status', async () => {
      const deviceData = {
        id: 'custom-id',
        serial: 'SN003',
        model: 'CustomDevice',
        status: DeviceStatus.AT_CLINIC,
      };

      mockDeviceRepository.create.mockResolvedValue(mockDevice);

      await service.createDevice(deviceData);

      expect(mockDeviceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'custom-id',
          status: DeviceStatus.AT_CLINIC,
        })
      );
    });
  });

  describe('getDeviceById', () => {
    it('should return device when found', async () => {
      mockDeviceRepository.findById.mockResolvedValue(mockDevice);

      const result = await service.getDeviceById('device-123');

      expect(mockDeviceRepository.findById).toHaveBeenCalledWith('device-123');
      expect(result).toBe(mockDevice);
    });

    it('should throw NotFoundException when device not found', async () => {
      mockDeviceRepository.findById.mockResolvedValue(null);

      await expect(service.getDeviceById('nonexistent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getDeviceById('nonexistent')).rejects.toThrow(
        'Device with ID nonexistent not found'
      );
    });
  });

  describe('getDeviceBySerial', () => {
    it('should return device when found by serial', async () => {
      mockDeviceRepository.findBySerial.mockResolvedValue(mockDevice);

      const result = await service.getDeviceBySerial('SN001');

      expect(mockDeviceRepository.findBySerial).toHaveBeenCalledWith('SN001');
      expect(result).toBe(mockDevice);
    });

    it('should return null when device not found by serial', async () => {
      mockDeviceRepository.findBySerial.mockResolvedValue(null);

      const result = await service.getDeviceBySerial('NONEXISTENT');

      expect(result).toBeNull();
    });
  });

  describe('getAllDevices', () => {
    it('should return paginated devices with default options', async () => {
      const mockPaginatedResult = {
        data: [mockDevice],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockDeviceRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllDevices();

      expect(mockDeviceRepository.findAll).toHaveBeenCalledWith({});
      expect(result).toBe(mockPaginatedResult);
    });

    it('should pass pagination options to repository', async () => {
      const options: PaginationOptions = {
        page: 2,
        limit: 5,
        sortBy: 'serial',
        sortOrder: 'asc',
      };

      const mockPaginatedResult = {
        data: [mockDevice],
        pagination: { page: 2, limit: 5, total: 10, totalPages: 2 },
      };
      mockDeviceRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllDevices(options);

      expect(mockDeviceRepository.findAll).toHaveBeenCalledWith(options);
      expect(result).toBe(mockPaginatedResult);
    });
  });

  describe('updateDevice', () => {
    it('should update device successfully', async () => {
      const updateData = {
        status: DeviceStatus.AT_CLINIC,
        currentLocation: 'Room 101',
      };

      mockDeviceRepository.findById.mockResolvedValue(mockDevice);
      const updatedDevice = new Device({ ...mockDevice, ...updateData });
      mockDeviceRepository.update.mockResolvedValue(updatedDevice);

      const result = await service.updateDevice('device-123', updateData);

      expect(mockDeviceRepository.findById).toHaveBeenCalledWith('device-123');
      expect(mockDeviceRepository.update).toHaveBeenCalledWith(
        'device-123',
        expect.objectContaining({
          status: DeviceStatus.AT_CLINIC,
          currentLocation: 'Room 101',
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toBe(updatedDevice);
    });

    it('should throw NotFoundException when device not found for update', async () => {
      mockDeviceRepository.findById.mockResolvedValue(null);

      await expect(service.updateDevice('nonexistent', { status: DeviceStatus.AT_CLINIC }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('assignDeviceToPatient', () => {
    it('should assign device to patient successfully', async () => {
      mockDeviceRepository.findById.mockResolvedValue(mockDevice);
      const updatedDevice = new Device({ ...mockDevice, assignedPatientId: 'patient-456' });
      mockDeviceRepository.update.mockResolvedValue(updatedDevice);

      const result = await service.assignDeviceToPatient('device-123', 'patient-456');

      expect(mockDeviceRepository.findById).toHaveBeenCalledWith('device-123');
      expect(mockDeviceRepository.update).toHaveBeenCalledWith('device-123', expect.any(Device));
      expect(result).toBe(updatedDevice);
    });

    it('should throw NotFoundException when device not found for assignment', async () => {
      mockDeviceRepository.findById.mockResolvedValue(null);

      await expect(service.assignDeviceToPatient('nonexistent', 'patient-456'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('unassignDeviceFromPatient', () => {
    it('should unassign device from patient successfully', async () => {
      const assignedDevice = new Device({ ...mockDevice, assignedPatientId: 'patient-456' });
      mockDeviceRepository.findById.mockResolvedValue(assignedDevice);
      const unassignedDevice = new Device({ ...assignedDevice, assignedPatientId: undefined });
      mockDeviceRepository.update.mockResolvedValue(unassignedDevice);

      const result = await service.unassignDeviceFromPatient('device-123');

      expect(mockDeviceRepository.findById).toHaveBeenCalledWith('device-123');
      expect(mockDeviceRepository.update).toHaveBeenCalledWith('device-123', expect.any(Device));
      expect(result).toBe(unassignedDevice);
    });
  });

  describe('updateDeviceStatus', () => {
    it('should update device status successfully', async () => {
      mockDeviceRepository.findById.mockResolvedValue(mockDevice);
      const updatedDevice = new Device({ ...mockDevice, status: DeviceStatus.AT_CLINIC });
      mockDeviceRepository.update.mockResolvedValue(updatedDevice);

      const result = await service.updateDeviceStatus('device-123', DeviceStatus.AT_CLINIC);

      expect(mockDeviceRepository.findById).toHaveBeenCalledWith('device-123');
      expect(mockDeviceRepository.update).toHaveBeenCalledWith('device-123', expect.any(Device));
      expect(result.status).toBe(DeviceStatus.AT_CLINIC);
    });
  });

  describe('Error Handling', () => {
    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Repository connection failed');
      mockDeviceRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.getDeviceById('device-123')).rejects.toThrow('Repository connection failed');
    });
  });
});