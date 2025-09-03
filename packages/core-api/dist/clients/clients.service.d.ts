import { ClientResponseDto, CreateClientDto, PaginatedClientsResponseDto, UpdateClientDto } from './dto';
import { ClientService } from '@reki/core-service';
export declare class ClientsService {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createClientDto: CreateClientDto): Promise<ClientResponseDto>;
    findAll(params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedClientsResponseDto>;
    search(query: string, params: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedClientsResponseDto>;
    findByClinic(clinicId: string, params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedClientsResponseDto>;
    findByStatus(status: string, params: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedClientsResponseDto>;
    findById(id: string): Promise<ClientResponseDto>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponseDto>;
    updateStatus(id: string, status: string): Promise<ClientResponseDto>;
    delete(id: string): Promise<void>;
    private mapToResponseDto;
}
