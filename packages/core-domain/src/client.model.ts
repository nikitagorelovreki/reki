export enum ClientStatus {
  INTAKE = 'intake',
  DIAGNOSTICS = 'diagnostics',
  ACTIVE_THERAPY = 'active_therapy',
  PAUSED = 'paused',
  DISCHARGED = 'discharged',
  FOLLOWUP = 'followup',
  ARCHIVED = 'archived',
}

export class Client {
  id!: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: Date;
  diagnosis?: string;
  contacts?: Record<string, any>;
  status!: ClientStatus;
  clinicId?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Client>) {
    Object.assign(this, data);
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.status = data.status || ClientStatus.INTAKE;
  }

  updateStatus(status: ClientStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === ClientStatus.ACTIVE_THERAPY || 
           this.status === ClientStatus.DIAGNOSTICS;
  }
}

export interface CreateClientDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: Date;
  diagnosis?: string;
  contacts?: Record<string, any>;
  status?: ClientStatus;
  clinicId?: string;
}

export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dob?: Date;
  diagnosis?: string;
  contacts?: Record<string, any>;
  status?: ClientStatus;
  clinicId?: string;
}
