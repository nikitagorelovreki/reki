// Service-level models (not domain, not API)
export interface ServiceClient {
  id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: string;
  diagnosis?: string;
  contacts?: Record<string, any>;
  status: string;
  clinicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateClientDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
  status?: string;
  clinicId?: string;
}

export interface ServiceUpdateClientDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
  status?: string;
  clinicId?: string;
}
