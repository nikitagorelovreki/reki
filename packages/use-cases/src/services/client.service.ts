import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  Client, 
  ClientRepositoryPort, 
  ClientStatus, 
  PaginatedResult, 
  PaginationOptions 
} from '@reki/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepositoryPort) {}

  async createClient(clientData: Partial<Client>): Promise<Client> {
    const client = new Client({
      id: uuidv4(),
      status: ClientStatus.INTAKE,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...clientData,
    });

    return this.clientRepository.create(client);
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async getAllClients(options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    return this.clientRepository.findAll(options);
  }

  async updateClient(id: string, updateData: Partial<Client>): Promise<Client> {
    const existingClient = await this.getClientById(id);
    
    // Обновляем свойства клиента
    const updatedClient = new Client({
      ...existingClient,
      ...updateData,
      updatedAt: new Date()
    });
    
    return this.clientRepository.update(id, updatedClient);
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async getClientsByClinic(clinicId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    return this.clientRepository.findByClinic(clinicId, options);
  }

  async getClientsByStatus(status: ClientStatus, options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    return this.clientRepository.findByStatus(status, options);
  }

  async searchClients(query: string, options: PaginationOptions = {}): Promise<PaginatedResult<Client>> {
    return this.clientRepository.search(query, options);
  }

  async updateClientStatus(clientId: string, status: ClientStatus): Promise<Client> {
    const client = await this.getClientById(clientId);
    client.updateStatus(status);
    return this.clientRepository.update(clientId, client);
  }
}
