// Service-level models (not domain, not API)
export interface ServiceForm {
  id: string;
  title: string;
  type: string;
  version: number;
  status: string;
  schema?: Record<string, any>;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateFormDto {
  title: string;
  type: string;
  version?: number;
  status?: string;
  schema?: Record<string, any>;
  description?: string;
}

export interface ServiceUpdateFormDto {
  title?: string;
  type?: string;
  version?: number;
  status?: string;
  schema?: Record<string, any>;
  description?: string;
}
