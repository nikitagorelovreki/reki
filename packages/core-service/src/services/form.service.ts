import { Injectable } from '@nestjs/common';
import { FormRepository } from '@reki/core-persistence';
import { ServiceForm, ServiceCreateFormDto, ServiceUpdateFormDto } from '../models/form.model';
import { FormMapper } from '../mappers/form.mapper';

@Injectable()
export class FormService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly formMapper: FormMapper,
  ) {}

  async create(createFormDto: ServiceCreateFormDto): Promise<ServiceForm> {
    const domainDto = this.formMapper.mapServiceToDomainCreate(createFormDto);
    const form = await this.formRepository.create(domainDto);
    return this.formMapper.mapDomainToService(form);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ServiceForm[]> {
    const forms = await this.formRepository.findAll(page, limit);
    return forms.map(form => this.formMapper.mapDomainToService(form));
  }

  async findById(id: string): Promise<ServiceForm | null> {
    const form = await this.formRepository.findById(id);
    return form ? this.formMapper.mapDomainToService(form) : null;
  }

  async update(id: string, updateFormDto: ServiceUpdateFormDto): Promise<ServiceForm | null> {
    const domainDto = this.formMapper.mapServiceToDomainUpdate(updateFormDto);
    const form = await this.formRepository.update(id, domainDto);
    return form ? this.formMapper.mapDomainToService(form) : null;
  }

  async delete(id: string): Promise<void> {
    return this.formRepository.delete(id);
  }
}
