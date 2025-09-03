import { apiClient } from './client';

export const formsApi = {
  // Get all forms with pagination
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/forms', { params });
    return response.data;
  },

  // Get form by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/forms/${id}`);
    return response.data;
  },

  // Get forms by type
  getByType: async (type: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/forms/type/${type}`, { params });
    return response.data;
  },

  // Get forms by status
  getByStatus: async (status: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/forms/status/${status}`, { params });
    return response.data;
  },

  // Create form
  create: async (data: any) => {
    const response = await apiClient.post('/forms', data);
    return response.data;
  },

  // Update form
  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/forms/${id}`, data);
    return response.data;
  },

  // Delete form
  delete: async (id: string) => {
    await apiClient.delete(`/forms/${id}`);
  },

  // Initialize default forms
  initialize: async () => {
    const response = await apiClient.post('/forms/initialize');
    return response.data;
  },
};

// Export individual functions for backward compatibility
export const getAllForms = formsApi.getAll;
export const getFormById = formsApi.getById;
export const getFormsByType = formsApi.getByType;
export const getFormsByStatus = formsApi.getByStatus;
export const createForm = formsApi.create;
export const updateForm = formsApi.update;
export const deleteForm = formsApi.delete;
export const initializeForms = formsApi.initialize;
