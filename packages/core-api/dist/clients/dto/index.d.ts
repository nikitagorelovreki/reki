export declare enum ClientStatus {
    INTAKE = "intake",
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCHARGED = "discharged"
}
export declare class CreateClientDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    address?: string;
    diagnosis?: string;
    status?: ClientStatus;
    clinicId?: string;
}
export declare class UpdateClientDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    address?: string;
    diagnosis?: string;
    status?: ClientStatus;
    clinicId?: string;
}
export declare class ClientResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    address?: string;
    diagnosis?: string;
    status: ClientStatus;
    clinicId?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class PaginatedClientsResponseDto {
    data: ClientResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
