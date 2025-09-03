import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ClientResponseDto,
  CreateClientDto,
  PaginatedClientsResponseDto,
  UpdateClientDto,
  ClientStatus,
} from './dto';
import { ClientService } from '@reki/core-service';

@Injectable()
export class ClientsService {
  constructor(private readonly clientService: ClientService) {}

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    const serviceDto = {
      firstName: createClientDto.firstName,
      lastName: createClientDto.lastName,
      middleName: createClientDto.middleName,
      dateOfBirth: createClientDto.dateOfBirth,
      diagnosis: createClientDto.diagnosis,
      phone: createClientDto.phone,
      email: createClientDto.email,
      address: createClientDto.address,
      status: createClientDto.status || ClientStatus.INTAKE,
      clinicId: createClientDto.clinicId,
    };

    const savedClient = await this.clientService.create(serviceDto);
    return this.mapToResponseDto(savedClient);
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedClientsResponseDto> {
    const {
      page = 1,
      limit = 10,
    } = params;

    const clients = await this.clientService.findAll(page, limit);

    return {
      data: clients.map((client) => this.mapToResponseDto(client)),
      pagination: {
        page,
        limit,
        total: clients.length,
        totalPages: Math.ceil(clients.length / limit),
      },
    };
  }

  async search(
    query: string,
    params: { page?: number; limit?: number }
  ): Promise<PaginatedClientsResponseDto> {
    const { page = 1, limit = 10 } = params;

    // Получаем всех клиентов и фильтруем по поисковому запросу
    const clients = await this.clientService.findAll(page, limit);

    const filteredData = clients.filter(
      (client) =>
        client.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        client.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        (client.middleName &&
          client.middleName.toLowerCase().includes(query.toLowerCase()))
    );

    return {
      data: filteredData.map((client) => this.mapToResponseDto(client)),
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }

  async findByClinic(
    clinicId: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedClientsResponseDto> {
    const { page = 1, limit = 10 } = params;

    const clients = await this.clientService.findAll(page, limit);

    // Фильтруем по клинике
    const filteredData = clients.filter(
      (client) => client.clinicId === clinicId
    );

    return {
      data: filteredData.map((client) => this.mapToResponseDto(client)),
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }

  async findByStatus(
    status: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedClientsResponseDto> {
    const { page = 1, limit = 10 } = params;

    const clients = await this.clientService.findAll(page, limit);

    // Фильтруем по статусу
    const filteredData = clients.filter(
      (client) => client.status === status
    );

    return {
      data: filteredData.map((client) => this.mapToResponseDto(client)),
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }

  async findById(id: string): Promise<ClientResponseDto> {
    const client = await this.clientService.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.mapToResponseDto(client);
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto
  ): Promise<ClientResponseDto> {
    const serviceDto = {
      firstName: updateClientDto.firstName,
      lastName: updateClientDto.lastName,
      middleName: updateClientDto.middleName,
      dateOfBirth: updateClientDto.dateOfBirth,
      diagnosis: updateClientDto.diagnosis,
      phone: updateClientDto.phone,
      email: updateClientDto.email,
      address: updateClientDto.address,
      status: updateClientDto.status,
      clinicId: updateClientDto.clinicId,
    };

    const updatedClient = await this.clientService.update(id, serviceDto);
    if (!updatedClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.mapToResponseDto(updatedClient);
  }

  async updateStatus(id: string, status: string): Promise<ClientResponseDto> {
    const updatedClient = await this.clientService.update(id, {
      status: status as ClientStatus,
    });
    if (!updatedClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.mapToResponseDto(updatedClient);
  }

  async delete(id: string): Promise<void> {
    const client = await this.clientService.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    await this.clientService.delete(id);
  }

  private mapToResponseDto(client: any): ClientResponseDto {
    return {
      id: client.id,
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      middleName: client.middleName,
      dateOfBirth: client.dob?.split('T')[0] || client.dateOfBirth?.split('T')[0],
      phone: client.contacts?.phone || client.phone,
      email: client.contacts?.email || client.email,
      address: client.contacts?.address || client.address,
      diagnosis: client.diagnosis,
      status: client.status,
      clinicId: client.clinicId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
