import { Injectable } from '@nestjs/common';
import { Form, CreateFormDto, UpdateFormDto } from '@reki/core-domain';
import { ServiceForm, ServiceCreateFormDto, ServiceUpdateFormDto } from '../models/form.model';

@Injectable()
export class FormMapper {
  mapDomainToService(form: Form): ServiceForm {
    return {
      id: form.id,
      title: form.title,
      type: form.type,
      version: form.version,
      status: form.status,
      schema: form.schema,
      description: form.description,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    };
  }

  mapServiceToDomainCreate(serviceDto: ServiceCreateFormDto): CreateFormDto {
    return {
      title: serviceDto.title,
      type: serviceDto.type as any, // Map to domain enum
      version: serviceDto.version,
      status: serviceDto.status as any, // Map to domain enum
      schema: serviceDto.schema || {},
      description: serviceDto.description,
    };
  }

  mapServiceToDomainUpdate(serviceDto: ServiceUpdateFormDto): UpdateFormDto {
    return {
      title: serviceDto.title,
      type: serviceDto.type as any, // Map to domain enum
      version: serviceDto.version,
      status: serviceDto.status as any, // Map to domain enum
      schema: serviceDto.schema,
      description: serviceDto.description,
    };
  }
}
