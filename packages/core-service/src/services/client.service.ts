import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@reki/core-persistence';
import { ServiceClient, ServiceCreateClientDto, ServiceUpdateClientDto } from '../models/client.model';
import { ClientMapper } from '../mappers/client.mapper';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientMapper?: ClientMapper,
  ) {}

  async create(createClientDto: ServiceCreateClientDto): Promise<ServiceClient> {
    // Validate required fields
    if (!createClientDto.firstName || createClientDto.firstName.trim() === '') {
      throw new Error('First name is required');
    }
    
    if (!createClientDto.lastName || createClientDto.lastName.trim() === '') {
      throw new Error('Last name is required');
    }
    
    // Validate email format if provided
    if (createClientDto.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createClientDto.email)) {
        throw new Error('Invalid email format');
      }
      
      // Check email uniqueness
      const existingClient = await this.clientRepository.findByEmail(createClientDto.email);
      if (existingClient) {
        throw new Error(`Client with email ${createClientDto.email} already exists`);
      }
    }

    // Create mapper if not provided (for test compatibility)
    const mapper = this.clientMapper || new ClientMapper();
    
    const domainDto = mapper.mapServiceToDomainCreate(createClientDto);
    const client = await this.clientRepository.create(domainDto);
    return mapper.mapDomainToService(client);
  }

  // Alias for test compatibility
  async createClient(clientData: any): Promise<ServiceClient> {
    return this.create(clientData);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ServiceClient[]> {
    const clients = await this.clientRepository.findAll(page, limit);
    const mapper = this.clientMapper || new ClientMapper();
    return clients.map(client => mapper.mapDomainToService(client));
  }

  async findById(id: string): Promise<ServiceClient | null> {
    const client = await this.clientRepository.findById(id);
    const mapper = this.clientMapper || new ClientMapper();
    return client ? mapper.mapDomainToService(client) : null;
  }

  async update(id: string, updateData: ServiceUpdateClientDto): Promise<ServiceClient | null> {
    const mapper = this.clientMapper || new ClientMapper();
    const domainDto = mapper.mapServiceToDomainUpdate(updateData);
    const client = await this.clientRepository.update(id, domainDto);
    if (!client) {
      return null;
    }
    return mapper.mapDomainToService(client);
  }

  async delete(id: string): Promise<void> {
    return this.clientRepository.delete(id);
  }
}
