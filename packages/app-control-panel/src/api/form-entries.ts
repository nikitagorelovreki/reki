import { apiClient } from './client';

export const formEntriesApi = {
  // Get all form entries with pagination
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get('/form-entries', { params });
    return response.data;
  },

  // Get form entry by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/form-entries/${id}`);
    return response.data;
  },

  // Get form entries by form ID
  getByForm: async (formId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/form-entries/form/${formId}`, { params });
    return response.data;
  },

  // Get form entries by patient ID
  getByPatient: async (patientId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/form-entries/patient/${patientId}`, { params });
    return response.data;
  },

  // Get form entries by status
  getByStatus: async (status: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/form-entries/status/${status}`, { params });
    return response.data;
  },

  // Create form entry
  create: async (data: {
    formId: string;
    patientId: string;
    data?: Record<string, any>;
    status?: 'in_progress' | 'completed' | 'cancelled';
  }) => {
    const response = await apiClient.post('/form-entries', data);
    return response.data;
  },

  // Update form entry
  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/form-entries/${id}`, data);
    return response.data;
  },

  // Update form entry data
  updateData: async (id: string, data: Record<string, any>) => {
    const response = await apiClient.patch(`/form-entries/${id}/data`, { data });
    return response.data;
  },

  // Complete form entry
  complete: async (id: string) => {
    const response = await apiClient.patch(`/form-entries/${id}/complete`);
    return response.data;
  },

  // Cancel form entry
  cancel: async (id: string) => {
    const response = await apiClient.patch(`/form-entries/${id}/cancel`);
    return response.data;
  },

  // Delete form entry
  delete: async (id: string) => {
    await apiClient.delete(`/form-entries/${id}`);
  },
};

// Export individual functions for backward compatibility
export const getAllFormEntries = formEntriesApi.getAll;
export const getFormEntryById = formEntriesApi.getById;
export const getFormEntriesByForm = formEntriesApi.getByForm;
export const getFormEntriesByPatient = formEntriesApi.getByPatient;
export const getFormEntriesByStatus = formEntriesApi.getByStatus;
export const createFormEntry = formEntriesApi.create;
export const updateFormEntry = formEntriesApi.update;
export const updateFormEntryData = formEntriesApi.updateData;
export const completeFormEntry = formEntriesApi.complete;
export const cancelFormEntry = formEntriesApi.cancel;
export const deleteFormEntry = formEntriesApi.delete;
