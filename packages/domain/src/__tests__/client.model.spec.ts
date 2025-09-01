import { Client, ClientStatus } from '../models/client.model';

describe('Client Model', () => {
  let client: Client;
  const mockClientData = {
    id: 'client-123',
    fullName: 'Иван Иванов',
    firstName: 'Иван',
    lastName: 'Иванов',
    status: ClientStatus.INTAKE,
  };

  beforeEach(() => {
    client = new Client(mockClientData);
  });

  describe('Constructor', () => {
    it('should create client with provided data', () => {
      expect(client.id).toBe('client-123');
      expect(client.fullName).toBe('Иван Иванов');
      expect(client.firstName).toBe('Иван');
      expect(client.lastName).toBe('Иванов');
      expect(client.status).toBe(ClientStatus.INTAKE);
    });

    it('should set default values for timestamps', () => {
      const newClient = new Client({ fullName: 'Петр Петров' });
      expect(newClient.createdAt).toBeInstanceOf(Date);
      expect(newClient.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default status to INTAKE', () => {
      const newClient = new Client({ fullName: 'Анна Сидорова' });
      expect(newClient.status).toBe(ClientStatus.INTAKE);
    });

    it('should preserve provided timestamps', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      const newClient = new Client({
        fullName: 'Мария Козлова',
        createdAt,
        updatedAt,
      });
      expect(newClient.createdAt).toBe(createdAt);
      expect(newClient.updatedAt).toBe(updatedAt);
    });
  });

  describe('updateStatus', () => {
    it('should update client status', () => {
      const originalUpdatedAt = client.updatedAt;
      
      client.updateStatus(ClientStatus.ACTIVE_THERAPY);
      
      expect(client.status).toBe(ClientStatus.ACTIVE_THERAPY);
      expect(client.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should update timestamp when status changes', () => {
      const originalUpdatedAt = client.updatedAt;
      
      client.updateStatus(ClientStatus.DIAGNOSTICS);
      
      expect(client.updatedAt).not.toBe(originalUpdatedAt);
      expect(client.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('isActive', () => {
    it('should return true when client is in active therapy', () => {
      client.updateStatus(ClientStatus.ACTIVE_THERAPY);
      expect(client.isActive()).toBe(true);
    });

    it('should return true when client is in diagnostics', () => {
      client.updateStatus(ClientStatus.DIAGNOSTICS);
      expect(client.isActive()).toBe(true);
    });

    it('should return false when client is in intake', () => {
      client.updateStatus(ClientStatus.INTAKE);
      expect(client.isActive()).toBe(false);
    });

    it('should return false when client is discharged', () => {
      client.updateStatus(ClientStatus.DISCHARGED);
      expect(client.isActive()).toBe(false);
    });

    it('should return false when client is paused', () => {
      client.updateStatus(ClientStatus.PAUSED);
      expect(client.isActive()).toBe(false);
    });
  });

  describe('Optional Properties', () => {
    it('should handle optional properties correctly', () => {
      const clientWithOptional = new Client({
        fullName: 'Елена Волкова',
        firstName: 'Елена',
        lastName: 'Волкова',
        middleName: 'Александровна',
        dob: new Date('1985-05-15'),
        diagnosis: 'Реабилитация после травмы',
        contacts: {
          phone: '+7 (900) 123-45-67',
          email: 'elena.volkova@example.com',
        },
        clinicId: 'clinic-1',
      });

      expect(clientWithOptional.middleName).toBe('Александровна');
      expect(clientWithOptional.dob).toBeInstanceOf(Date);
      expect(clientWithOptional.diagnosis).toBe('Реабилитация после травмы');
      expect(clientWithOptional.contacts).toEqual({
        phone: '+7 (900) 123-45-67',
        email: 'elena.volkova@example.com',
      });
      expect(clientWithOptional.clinicId).toBe('clinic-1');
    });

    it('should handle undefined optional properties', () => {
      const minimalClient = new Client({ fullName: 'Минимальный Клиент' });
      
      expect(minimalClient.firstName).toBeUndefined();
      expect(minimalClient.lastName).toBeUndefined();
      expect(minimalClient.middleName).toBeUndefined();
      expect(minimalClient.dob).toBeUndefined();
      expect(minimalClient.diagnosis).toBeUndefined();
      expect(minimalClient.contacts).toBeUndefined();
      expect(minimalClient.clinicId).toBeUndefined();
    });
  });
});