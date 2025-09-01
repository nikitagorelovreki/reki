import { DeviceRepository } from '../repositories/device.repository';
import { DatabaseService } from '../database/database.service';
import { Device, DeviceStatus } from '@reki/domain';

describe('DeviceRepository', () => {
  let repository: DeviceRepository;
  let mockDatabaseService: any;

  const mockDevice = new Device({
    id: 'device-123',
    serial: 'SN001',
    model: 'TestDevice',
    status: DeviceStatus.REGISTERED,
  });

  beforeEach(() => {
    mockDatabaseService = {
      knex: jest.fn(),
    };

    repository = new DeviceRepository(mockDatabaseService as DatabaseService);
  });

  describe('create', () => {
    it('should call knex with correct table and data', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ 
          id: 'device-123', 
          serial: 'SN001',
          model: 'TestDevice',
          status: 'REGISTERED',
          created_at: new Date(),
          updated_at: new Date(),
        }])
      });

      mockDatabaseService.knex.mockReturnValue({
        insert: mockInsert,
      });

      await repository.create(mockDevice);

      expect(mockDatabaseService.knex).toHaveBeenCalledWith('devices');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        serial: 'SN001',
        model: 'TestDevice',
        status: 'REGISTERED',
      }));
    });
  });

  describe('findById', () => {
    it('should call knex with correct query', async () => {
      const mockWhere = jest.fn().mockReturnValue({
        first: jest.fn().mockResolvedValue({
          id: 'device-123',
          serial: 'SN001',
          model: 'TestDevice',
          status: 'REGISTERED',
          created_at: new Date(),
          updated_at: new Date(),
        })
      });

      mockDatabaseService.knex.mockReturnValue({
        where: mockWhere,
      });

      const result = await repository.findById('device-123');

      expect(mockDatabaseService.knex).toHaveBeenCalledWith('devices');
      expect(mockWhere).toHaveBeenCalledWith({ id: 'device-123' });
      expect(result).toBeInstanceOf(Device);
    });
  });

  describe('update', () => {
    it('should call knex with correct update data', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{
          id: 'device-123',
          serial: 'SN001',
          model: 'TestDevice',
          status: 'AT_CLINIC',
          created_at: new Date(),
          updated_at: new Date(),
        }])
      });

      const mockWhere = jest.fn().mockReturnValue({
        update: mockUpdate,
      });

      mockDatabaseService.knex.mockReturnValue({
        where: mockWhere,
      });

      const updatedDevice = new Device({ ...mockDevice, status: DeviceStatus.AT_CLINIC });
      await repository.update('device-123', updatedDevice);

      expect(mockWhere).toHaveBeenCalledWith({ id: 'device-123' });
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call knex delete method', async () => {
      const mockDel = jest.fn().mockResolvedValue(1);
      const mockWhere = jest.fn().mockReturnValue({
        del: mockDel,
      });

      mockDatabaseService.knex.mockReturnValue({
        where: mockWhere,
      });

      await repository.delete('device-123');

      expect(mockWhere).toHaveBeenCalledWith({ id: 'device-123' });
      expect(mockDel).toHaveBeenCalled();
    });
  });
});