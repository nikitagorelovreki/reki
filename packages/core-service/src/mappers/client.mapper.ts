import { Injectable } from '@nestjs/common';
import { Client, CreateClientDto, UpdateClientDto } from '@reki/core-domain';
import { ServiceClient, ServiceCreateClientDto, ServiceUpdateClientDto } from '../models/client.model';

@Injectable()
export class ClientMapper {
  mapDomainToService(client: Client): ServiceClient {
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      middleName: client.middleName,
      dob: client.dob?.toISOString(),
      diagnosis: client.diagnosis,
      contacts: client.contacts,
      status: client.status,
      clinicId: client.clinicId,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }

  mapServiceToDomainCreate(serviceDto: ServiceCreateClientDto): CreateClientDto {
    return {
      firstName: serviceDto.firstName,
      lastName: serviceDto.lastName,
      middleName: serviceDto.middleName,
      dob: serviceDto.dateOfBirth ? new Date(serviceDto.dateOfBirth) : undefined,
      diagnosis: serviceDto.diagnosis,
      status: serviceDto.status as any, // Map to domain enum
      clinicId: serviceDto.clinicId,
    };
  }

  mapServiceToDomainUpdate(serviceDto: ServiceUpdateClientDto): UpdateClientDto {
    return {
      firstName: serviceDto.firstName,
      lastName: serviceDto.lastName,
      middleName: serviceDto.middleName,
      dob: serviceDto.dateOfBirth ? new Date(serviceDto.dateOfBirth) : undefined,
      diagnosis: serviceDto.diagnosis,
      status: serviceDto.status as any, // Map to domain enum
      clinicId: serviceDto.clinicId,
    };
  }
}
