import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@reki/core-persistence';
import { ServiceClient, ServiceCreateClientDto, ServiceUpdateClientDto } from '../models/client.model';
import { ClientMapper } from '../mappers/client.mapper';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientMapper: ClientMapper,
  ) {}

  async create(createClientDto: ServiceCreateClientDto): Promise<ServiceClient> {
    const domainDto = this.clientMapper.mapServiceToDomainCreate(createClientDto);
    const client = await this.clientRepository.create(domainDto);
    return this.clientMapper.mapDomainToService(client);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ServiceClient[]> {
    const clients = await this.clientRepository.findAll(page, limit);
    return clients.map(client => this.clientMapper.mapDomainToService(client));
  }

  async findById(id: string): Promise<ServiceClient | null> {
    const client = await this.clientRepository.findById(id);
    return client ? this.clientMapper.mapDomainToService(client) : null;
  }

  async update(id: string, updateClientDto: ServiceUpdateClientDto): Promise<ServiceClient | null> {
    const domainDto = this.clientMapper.mapServiceToDomainUpdate(updateClientDto);
    const client = await this.clientRepository.update(id, domainDto);
    return client ? this.clientMapper.mapDomainToService(client) : null;
  }

  async delete(id: string): Promise<void> {
    return this.clientRepository.delete(id);
  }
}
