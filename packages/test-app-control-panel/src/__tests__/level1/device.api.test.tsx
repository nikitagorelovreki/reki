/**
 * Level 1: Frontend Functional Tests - Device API Integration
 * Tests device management with mocked APIs
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock device management component
const DeviceManagement = () => {
  const [devices, setDevices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const loadDevices = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await global.apiMocks.getMock('devicesGetAll')(filters);
      setDevices(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDevice = async (deviceData) => {
    setLoading(true);
    try {
      const newDevice = await global.apiMocks.getMock('devicesCreate')(deviceData);
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDeviceStatus = async (id, status) => {
    setLoading(true);
    try {
      const updatedDevice = await global.apiMocks.getMock('devicesUpdate')(id, { status });
      setDevices(prev => prev.map(d => d.id === id ? updatedDevice : d));
      return updatedDevice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDevices();
  }, []);

  if (loading && devices.length === 0) {
    return <div data-testid="loading">Loading devices...</div>;
  }

  return (
    <div>
      <h1>Device Management</h1>
      {error && <div data-testid="error">{error}</div>}
      
      <div data-testid="device-count">Total: {devices.length}</div>
      
      <div data-testid="filter-buttons">
        <button 
          data-testid="filter-in-stock"
          onClick={() => loadDevices({ status: 'IN_STOCK' })}
        >
          In Stock
        </button>
        <button 
          data-testid="filter-at-clinic"
          onClick={() => loadDevices({ status: 'AT_CLINIC' })}
        >
          At Clinic
        </button>
        <button 
          data-testid="filter-all"
          onClick={() => loadDevices()}
        >
          All
        </button>
      </div>

      <div data-testid="device-list">
        {devices.map(device => (
          <div key={device.id} data-testid={`device-${device.id}`}>
            <span>{device.model} ({device.serialNumber})</span>
            <span data-testid={`status-${device.id}`}>{device.status}</span>
            <button 
              data-testid={`move-to-clinic-${device.id}`}
              onClick={() => updateDeviceStatus(device.id, 'AT_CLINIC')}
              disabled={device.status !== 'IN_STOCK'}
            >
              Move to Clinic
            </button>
            <button 
              data-testid={`maintenance-${device.id}`}
              onClick={() => updateDeviceStatus(device.id, 'MAINTENANCE')}
            >
              Maintenance
            </button>
          </div>
        ))}
      </div>

      <button data-testid="create-device" onClick={() => createDevice({
        model: 'New Device Model',
        serialNumber: `NEW-${Date.now()}`,
        status: 'IN_STOCK'
      })}>
        Register Device
      </button>
    </div>
  );
};

describe('Device API Integration - Level 1 Functional Tests', () => {
  beforeEach(() => {
    global.apiMocks.reset();
  });

  describe('Device Loading', () => {
    it('should load and display devices', async () => {
      const mockDevices = [
        global.testUtils.generateTestDevice({
          id: 'device-1',
          model: 'RehabDevice Pro',
          serialNumber: 'RD-001',
          status: 'IN_STOCK'
        }),
        global.testUtils.generateTestDevice({
          id: 'device-2',
          model: 'TherapyBot 3000',
          serialNumber: 'TB-002',
          status: 'AT_CLINIC'
        })
      ];

      global.apiMocks.mockDevicesGetAll({
        data: mockDevices,
        total: 2
      });

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 2');
        expect(screen.getByTestId('device-device-1')).toBeInTheDocument();
        expect(screen.getByTestId('device-device-2')).toBeInTheDocument();
      });

      expect(screen.getByText('RehabDevice Pro (RD-001)')).toBeInTheDocument();
      expect(screen.getByText('TherapyBot 3000 (TB-002)')).toBeInTheDocument();
      expect(screen.getByTestId('status-device-1')).toHaveTextContent('IN_STOCK');
      expect(screen.getByTestId('status-device-2')).toHaveTextContent('AT_CLINIC');

      global.apiMocks.expectCalled('devicesGetAll');
    });

    it('should handle loading errors', async () => {
      global.apiMocks.mockDevicesGetAll(null, new Error('Failed to load devices'));

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load devices');
      });
    });
  });

  describe('Device Filtering', () => {
    it('should filter devices by status', async () => {
      const inStockDevices = [
        global.testUtils.generateTestDevice({
          id: 'stock-1',
          status: 'IN_STOCK'
        })
      ];

      const atClinicDevices = [
        global.testUtils.generateTestDevice({
          id: 'clinic-1',
          status: 'AT_CLINIC'
        })
      ];

      // Mock different responses for different filters
      global.apiMocks.getMock('devicesGetAll')
        .mockImplementation((filters) => {
          if (filters?.status === 'IN_STOCK') {
            return Promise.resolve({ data: inStockDevices, total: 1 });
          } else if (filters?.status === 'AT_CLINIC') {
            return Promise.resolve({ data: atClinicDevices, total: 1 });
          } else {
            return Promise.resolve({ 
              data: [...inStockDevices, ...atClinicDevices], 
              total: 2 
            });
          }
        });

      render(<DeviceManagement />);

      // Initial load should show all devices
      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 2');
      });

      // Filter by IN_STOCK
      fireEvent.click(screen.getByTestId('filter-in-stock'));

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 1');
        expect(screen.getByTestId('device-stock-1')).toBeInTheDocument();
        expect(screen.queryByTestId('device-clinic-1')).not.toBeInTheDocument();
      });

      // Filter by AT_CLINIC
      fireEvent.click(screen.getByTestId('filter-at-clinic'));

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 1');
        expect(screen.getByTestId('device-clinic-1')).toBeInTheDocument();
        expect(screen.queryByTestId('device-stock-1')).not.toBeInTheDocument();
      });

      // Show all
      fireEvent.click(screen.getByTestId('filter-all'));

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 2');
      });
    });
  });

  describe('Device Creation', () => {
    it('should create new device and update list', async () => {
      global.apiMocks.mockDevicesGetAll({ data: [], total: 0 });

      const newDevice = global.testUtils.generateTestDevice({
        id: 'new-device-123',
        model: 'New Device Model',
        status: 'IN_STOCK'
      });

      global.apiMocks.mockDevicesCreate(newDevice);

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 0');
      });

      fireEvent.click(screen.getByTestId('create-device'));

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 1');
        expect(screen.getByTestId('device-new-device-123')).toBeInTheDocument();
      });

      global.apiMocks.expectCalled('devicesCreate');
    });

    it('should handle creation errors', async () => {
      global.apiMocks.mockDevicesGetAll({ data: [], total: 0 });
      global.apiMocks.mockDevicesCreate(null, new Error('Serial number already exists'));

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 0');
      });

      fireEvent.click(screen.getByTestId('create-device'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Serial number already exists');
        expect(screen.getByTestId('device-count')).toHaveTextContent('Total: 0');
      });
    });
  });

  describe('Device Status Updates', () => {
    it('should update device status to AT_CLINIC', async () => {
      const mockDevice = global.testUtils.generateTestDevice({
        id: 'update-device',
        status: 'IN_STOCK'
      });

      global.apiMocks.mockDevicesGetAll({
        data: [mockDevice],
        total: 1
      });

      const updatedDevice = { ...mockDevice, status: 'AT_CLINIC' };
      global.apiMocks.mockDevicesUpdate(updatedDevice);

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('status-update-device')).toHaveTextContent('IN_STOCK');
      });

      fireEvent.click(screen.getByTestId('move-to-clinic-update-device'));

      await waitFor(() => {
        expect(screen.getByTestId('status-update-device')).toHaveTextContent('AT_CLINIC');
      });

      global.apiMocks.expectCalled('devicesUpdate');
    });

    it('should handle status update errors', async () => {
      const mockDevice = global.testUtils.generateTestDevice({
        id: 'error-device',
        status: 'IN_STOCK'
      });

      global.apiMocks.mockDevicesGetAll({
        data: [mockDevice],
        total: 1
      });
      global.apiMocks.mockDevicesUpdate(null, new Error('Device not available'));

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('status-error-device')).toHaveTextContent('IN_STOCK');
      });

      fireEvent.click(screen.getByTestId('move-to-clinic-error-device'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Device not available');
        expect(screen.getByTestId('status-error-device')).toHaveTextContent('IN_STOCK');
      });
    });

    it('should disable move to clinic button for non-stock devices', async () => {
      const atClinicDevice = global.testUtils.generateTestDevice({
        id: 'clinic-device',
        status: 'AT_CLINIC'
      });

      global.apiMocks.mockDevicesGetAll({
        data: [atClinicDevice],
        total: 1
      });

      render(<DeviceManagement />);

      await waitFor(() => {
        const moveButton = screen.getByTestId('move-to-clinic-clinic-device');
        expect(moveButton).toBeDisabled();
      });
    });
  });

  describe('Maintenance Operations', () => {
    it('should set device to maintenance status', async () => {
      const mockDevice = global.testUtils.generateTestDevice({
        id: 'maintenance-device',
        status: 'AT_CLINIC'
      });

      global.apiMocks.mockDevicesGetAll({
        data: [mockDevice],
        total: 1
      });

      const maintenanceDevice = { ...mockDevice, status: 'MAINTENANCE' };
      global.apiMocks.mockDevicesUpdate(maintenanceDevice);

      render(<DeviceManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('status-maintenance-device')).toHaveTextContent('AT_CLINIC');
      });

      fireEvent.click(screen.getByTestId('maintenance-maintenance-device'));

      await waitFor(() => {
        expect(screen.getByTestId('status-maintenance-device')).toHaveTextContent('MAINTENANCE');
      });
    });
  });
});
