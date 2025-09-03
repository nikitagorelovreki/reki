"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const core_service_1 = require("@reki/core-service");
let ClientsService = class ClientsService {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async create(createClientDto) {
        const serviceDto = {
            firstName: createClientDto.firstName,
            lastName: createClientDto.lastName,
            middleName: createClientDto.middleName,
            dateOfBirth: createClientDto.dateOfBirth,
            diagnosis: createClientDto.diagnosis,
            phone: createClientDto.phone,
            email: createClientDto.email,
            address: createClientDto.address,
            status: createClientDto.status || dto_1.ClientStatus.INTAKE,
            clinicId: createClientDto.clinicId,
        };
        const savedClient = await this.clientService.create(serviceDto);
        return this.mapToResponseDto(savedClient);
    }
    async findAll(params) {
        const { page = 1, limit = 10, } = params;
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
    async search(query, params) {
        const { page = 1, limit = 10 } = params;
        const clients = await this.clientService.findAll(page, limit);
        const filteredData = clients.filter((client) => client.firstName?.toLowerCase().includes(query.toLowerCase()) ||
            client.lastName?.toLowerCase().includes(query.toLowerCase()) ||
            (client.middleName &&
                client.middleName.toLowerCase().includes(query.toLowerCase())));
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
    async findByClinic(clinicId, params) {
        const { page = 1, limit = 10 } = params;
        const clients = await this.clientService.findAll(page, limit);
        const filteredData = clients.filter((client) => client.clinicId === clinicId);
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
    async findByStatus(status, params) {
        const { page = 1, limit = 10 } = params;
        const clients = await this.clientService.findAll(page, limit);
        const filteredData = clients.filter((client) => client.status === status);
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
    async findById(id) {
        const client = await this.clientService.findById(id);
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return this.mapToResponseDto(client);
    }
    async update(id, updateClientDto) {
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
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return this.mapToResponseDto(updatedClient);
    }
    async updateStatus(id, status) {
        const updatedClient = await this.clientService.update(id, {
            status: status,
        });
        if (!updatedClient) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return this.mapToResponseDto(updatedClient);
    }
    async delete(id) {
        const client = await this.clientService.findById(id);
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        await this.clientService.delete(id);
    }
    mapToResponseDto(client) {
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
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_service_1.ClientService])
], ClientsService);
