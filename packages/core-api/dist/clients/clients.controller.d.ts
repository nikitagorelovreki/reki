import { ClientsService } from './clients.service';
import { ClientResponseDto, CreateClientDto, PaginatedClientsResponseDto, UpdateClientDto } from './dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): Promise<ClientResponseDto>;
    findAll(page?: number, limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<PaginatedClientsResponseDto>;
    search(query: string, page?: number, limit?: number): Promise<PaginatedClientsResponseDto>;
    findByClinic(clinicId: string, page?: number, limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<PaginatedClientsResponseDto>;
    findByStatus(status: string, page?: number, limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<PaginatedClientsResponseDto>;
    findOne(id: string): Promise<ClientResponseDto>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponseDto>;
    updateStatus(id: string, status: string): Promise<ClientResponseDto>;
    remove(id: string): Promise<void>;
}
