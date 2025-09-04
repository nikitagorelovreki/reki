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
      email: client.contacts?.email, // Extract email from contacts for service layer
      status: client.status,
      clinicId: client.clinicId,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }

  mapServiceToDomainCreate(serviceDto: ServiceCreateClientDto): CreateClientDto {
    // Handle contacts - can come from email field or contacts object
    let contacts = undefined;
    if (serviceDto.email) {
      contacts = { email: serviceDto.email };
    } else if ((serviceDto as any).contacts) {
      contacts = (serviceDto as any).contacts;
    }
    
    return {
      firstName: serviceDto.firstName,
      lastName: serviceDto.lastName,
      middleName: serviceDto.middleName,
      dob: serviceDto.dateOfBirth ? new Date(serviceDto.dateOfBirth) : undefined,
      diagnosis: serviceDto.diagnosis,
      contacts: contacts,
      status: serviceDto.status as any, // Map to domain enum
      clinicId: serviceDto.clinicId,
    };
  }

  mapServiceToDomainUpdate(serviceDto: ServiceUpdateClientDto): UpdateClientDto {
    // Handle contacts - can come from email field or contacts object
    let contacts = undefined;
    if (serviceDto.email) {
      contacts = { email: serviceDto.email };
    } else if ((serviceDto as any).contacts) {
      contacts = (serviceDto as any).contacts;
    }
    
    return {
      firstName: serviceDto.firstName,
      lastName: serviceDto.lastName,
      middleName: serviceDto.middleName,
      dob: serviceDto.dateOfBirth ? new Date(serviceDto.dateOfBirth) : undefined,
      diagnosis: serviceDto.diagnosis,
      contacts: contacts,
      status: serviceDto.status as any, // Map to domain enum
      clinicId: serviceDto.clinicId,
    };
  }
}
