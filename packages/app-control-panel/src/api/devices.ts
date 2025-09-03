import { apiClient } from './client';
import { CreateDeviceDto, Device, DeviceStatus, PaginatedResponse } from '../types';

export const devicesApi = {
  // Get all devices with pagination
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Device>> => {
    const response = await apiClient.get('/devices', { params });
    return response.data;
  },

  // Get device by ID
  getById: async (id: string): Promise<Device> => {
    const response = await apiClient.get(`/devices/${id}`);
    return response.data;
  },

  // Get device by serial
  getBySerial: async (serial: string): Promise<Device> => {
    const response = await apiClient.get(`/devices/serial/${serial}`);
    return response.data;
  },

  // Get devices by clinic
  getByClinic: async (clinicId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Device>> => {
    const response = await apiClient.get(`/devices/clinic/${clinicId}`, { params });
    return response.data;
  },

  // Get devices by status
  getByStatus: async (status: DeviceStatus, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Device>> => {
    const response = await apiClient.get(`/devices/status/${status}`, { params });
    return response.data;
  },

  // Create device
  create: async (data: CreateDeviceDto): Promise<Device> => {
    const response = await apiClient.post('/devices', data);
    return response.data;
  },

  // Update device
  update: async (id: string, data: Partial<CreateDeviceDto>): Promise<Device> => {
    const response = await apiClient.patch(`/devices/${id}`, data);
    return response.data;
  },

  // Delete device
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/devices/${id}`);
  },

  // Assign patient to device
  assignPatient: async (deviceId: string, patientId: string): Promise<Device> => {
    const response = await apiClient.patch(`/devices/${deviceId}/assign-patient/${patientId}`);
    return response.data;
  },

  // Unassign patient from device
  unassignPatient: async (deviceId: string): Promise<Device> => {
    const response = await apiClient.patch(`/devices/${deviceId}/unassign-patient`);
    return response.data;
  },

  // Update device status
  updateStatus: async (deviceId: string, status: DeviceStatus): Promise<Device> => {
    const response = await apiClient.patch(`/devices/${deviceId}/status/${status}`);
    return response.data;
  },
};
