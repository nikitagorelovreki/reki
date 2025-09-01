import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Client,
  CLIENT_REPOSITORY,
  ClientRepositoryPort,
  ClientStatus,
} from '@reki/domain';
import {
  ClientResponseDto,
  CreateClientDto,
  PaginatedClientsResponseDto,
  UpdateClientDto,
} from './dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepositoryPort
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    const client = new Client({
      firstName: createClientDto.firstName,
      lastName: createClientDto.lastName,
      middleName: createClientDto.middleName,
      dob: createClientDto.dateOfBirth
        ? new Date(createClientDto.dateOfBirth)
        : undefined,
      diagnosis: createClientDto.diagnosis,
      contacts: {
        phone: createClientDto.phone,
        email: createClientDto.email,
        address: createClientDto.address,
      },
      status: createClientDto.status || ClientStatus.INTAKE,
      clinicId: createClientDto.clinicId,
    });

    const savedClient = await this.clientRepository.create(client);
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
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const result = await this.clientRepository.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      data: result.data.map((client: Client) => this.mapToResponseDto(client)),
      pagination: result.pagination,
    };
  }

  async search(
    query: string,
    params: { page?: number; limit?: number }
  ): Promise<PaginatedClientsResponseDto> {
    const { page = 1, limit = 10 } = params;

    // Простой поиск по имени и фамилии
    const result = await this.clientRepository.findAll({
      page,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    // Фильтруем результаты по поисковому запросу
    const filteredData = result.data.filter(
      (client: Client) =>
        client.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        false ||
        client.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        false ||
        (client.middleName &&
          client.middleName.toLowerCase().includes(query.toLowerCase()))
    );

    return {
      data: filteredData.map((client: Client) => this.mapToResponseDto(client)),
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
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const result = await this.clientRepository.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
    });

    // Фильтруем по клинике
    const filteredData = result.data.filter(
      (client: Client) => client.clinicId === clinicId
    );

    return {
      data: filteredData.map((client: Client) => this.mapToResponseDto(client)),
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
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const result = await this.clientRepository.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
    });

    // Фильтруем по статусу
    const filteredData = result.data.filter(
      (client: Client) => client.status === status
    );

    return {
      data: filteredData.map((client: Client) => this.mapToResponseDto(client)),
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }

  async findById(id: string): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.mapToResponseDto(client);
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto
  ): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Подготавливаем данные для обновления
    const updateData: Partial<Client> = {};

    if (updateClientDto.firstName !== undefined)
      updateData.firstName = updateClientDto.firstName;
    if (updateClientDto.lastName !== undefined)
      updateData.lastName = updateClientDto.lastName;
    if (updateClientDto.middleName !== undefined)
      updateData.middleName = updateClientDto.middleName;
    if (updateClientDto.dateOfBirth !== undefined)
      updateData.dob = new Date(updateClientDto.dateOfBirth);
    if (updateClientDto.diagnosis !== undefined)
      updateData.diagnosis = updateClientDto.diagnosis;
    if (updateClientDto.status !== undefined)
      updateData.status = updateClientDto.status;
    if (updateClientDto.clinicId !== undefined)
      updateData.clinicId = updateClientDto.clinicId;

    // Обновляем контакты
    if (
      updateClientDto.phone !== undefined ||
      updateClientDto.email !== undefined ||
      updateClientDto.address !== undefined
    ) {
      updateData.contacts = {
        ...client.contacts,
        ...(updateClientDto.phone !== undefined && {
          phone: updateClientDto.phone,
        }),
        ...(updateClientDto.email !== undefined && {
          email: updateClientDto.email,
        }),
        ...(updateClientDto.address !== undefined && {
          address: updateClientDto.address,
        }),
      };
    }

    const updatedClient = await this.clientRepository.update(id, updateData);
    return this.mapToResponseDto(updatedClient);
  }

  async updateStatus(id: string, status: string): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    const updatedClient = await this.clientRepository.update(id, {
      status: status as ClientStatus,
    });
    return this.mapToResponseDto(updatedClient);
  }

  async delete(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    await this.clientRepository.delete(id);
  }

  private mapToResponseDto(client: Client): ClientResponseDto {
    return {
      id: client.id,
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      middleName: client.middleName,
      dateOfBirth: client.dob?.toISOString().split('T')[0],
      phone: client.contacts?.phone,
      email: client.contacts?.email,
      address: client.contacts?.address,
      diagnosis: client.diagnosis,
      status: client.status,
      clinicId: client.clinicId,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }
}
