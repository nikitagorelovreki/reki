import { apiClient } from './client';
import { Client, ClientStatus, CreateClientDto, PaginatedResponse } from '../types';

export const clientsApi = {
  // Get all clients with pagination
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Client>> => {
    const response = await apiClient.get('/clients', { params });
    return response.data;
  },

  // Get client by ID
  getById: async (id: string): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  // Search clients
  search: async (query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Client>> => {
    const response = await apiClient.get('/clients/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Get clients by clinic
  getByClinic: async (clinicId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Client>> => {
    const response = await apiClient.get(`/clients/clinic/${clinicId}`, { params });
    return response.data;
  },

  // Get clients by status
  getByStatus: async (status: ClientStatus, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Client>> => {
    const response = await apiClient.get(`/clients/status/${status}`, { params });
    return response.data;
  },

  // Create client
  create: async (data: CreateClientDto): Promise<Client> => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  },

  // Update client
  update: async (id: string, data: Partial<CreateClientDto>): Promise<Client> => {
    const response = await apiClient.patch(`/clients/${id}`, data);
    return response.data;
  },

  // Delete client
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },

  // Update client status
  updateStatus: async (clientId: string, status: ClientStatus): Promise<Client> => {
    const response = await apiClient.patch(`/clients/${clientId}/status/${status}`);
    return response.data;
  },
};
