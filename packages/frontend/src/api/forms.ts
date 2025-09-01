import axios from 'axios';
import { API_BASE_URL } from './config';

// Types
export interface Form {
  id: string;
  name: string;
  type: 'lfk' | 'fim';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  clientId: string;
  therapistId?: string;
  therapistName?: string;
  submissionDate: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Client
const api = axios.create({
  baseURL: `${API_BASE_URL}/forms`,
});

// Forms API
export const getForms = async (page = 1, limit = 10): Promise<PaginatedResponse<Form>> => {
  const response = await api.get('', { params: { page, limit } });
  return response.data;
};

export const getFormsByType = async (type: 'lfk' | 'fim', page = 1, limit = 10): Promise<PaginatedResponse<Form>> => {
  const response = await api.get(`/type/${type}`, { params: { page, limit } });
  return response.data;
};

export const getFormById = async (id: string): Promise<Form> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createForm = async (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<Form> => {
  const response = await api.post('', formData);
  return response.data;
};

export const updateForm = async (id: string, formData: Partial<Form>): Promise<Form> => {
  const response = await api.put(`/${id}`, formData);
  return response.data;
};

export const deleteForm = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};

export const initializeDefaultForms = async (): Promise<{ message: string }> => {
  const response = await api.post('/initialize');
  return response.data;
};

// Form Submissions API
const submissionsApi = axios.create({
  baseURL: `${API_BASE_URL}/form-submissions`,
});

export const getFormSubmissions = async (page = 1, limit = 10): Promise<PaginatedResponse<FormSubmission>> => {
  const response = await submissionsApi.get('', { params: { page, limit } });
  return response.data;
};

export const getSubmissionsByClient = async (clientId: string, page = 1, limit = 10): Promise<PaginatedResponse<FormSubmission>> => {
  const response = await submissionsApi.get(`/client/${clientId}`, { params: { page, limit } });
  return response.data;
};

export const getSubmissionsByForm = async (formId: string, page = 1, limit = 10): Promise<PaginatedResponse<FormSubmission>> => {
  const response = await submissionsApi.get(`/form/${formId}`, { params: { page, limit } });
  return response.data;
};

export const getSubmissionsByClientAndForm = async (
  clientId: string, 
  formId: string, 
  page = 1, 
  limit = 10
): Promise<PaginatedResponse<FormSubmission>> => {
  const response = await submissionsApi.get(`/client/${clientId}/form/${formId}`, { params: { page, limit } });
  return response.data;
};

export const getLatestSubmissionByClientAndForm = async (clientId: string, formId: string): Promise<FormSubmission | null> => {
  try {
    const response = await submissionsApi.get(`/client/${clientId}/form/${formId}/latest`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getSubmissionById = async (id: string): Promise<FormSubmission> => {
  const response = await submissionsApi.get(`/${id}`);
  return response.data;
};

export const createFormSubmission = async (
  submissionData: {
    formId: string;
    clientId: string;
    therapistId?: string;
    therapistName?: string;
    submissionDate?: string;
    data: Record<string, any>;
  }
): Promise<FormSubmission> => {
  const response = await submissionsApi.post('', submissionData);
  return response.data;
};

export const updateFormSubmission = async (
  id: string, 
  submissionData: Partial<FormSubmission>
): Promise<FormSubmission> => {
  const response = await submissionsApi.put(`/${id}`, submissionData);
  return response.data;
};

export const deleteFormSubmission = async (id: string): Promise<void> => {
  await submissionsApi.delete(`/${id}`);
};

export const importFlowerFormData = async (
  clientId: string,
  formId: string,
  formData: Record<string, any>,
  therapistName?: string
): Promise<FormSubmission> => {
  const response = await submissionsApi.post('/import', {
    clientId,
    formId,
    formData,
    therapistName
  });
  return response.data;
};
