import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FormEntryModel,
  FormEntryStatus,
  PaginatedResult,
  PaginationOptions,
} from '@reki/core-domain';
import { FormEntryRepository } from '@reki/core-persistence';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormEntryService {
  constructor(
    private readonly formEntryRepository: FormEntryRepository
  ) {}

  async createFormEntry(
    formEntryData: Partial<FormEntryModel>
  ): Promise<FormEntryModel> {
    if (!formEntryData.formId) {
      throw new Error('formId is required');
    }
    
    const formEntry = new FormEntryModel({
      id: uuidv4(),
      status: FormEntryStatus.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...formEntryData,
    });
    return this.formEntryRepository.create(formEntry);
  }

  async getFormEntryById(id: string): Promise<FormEntryModel> {
    const formEntry = await this.formEntryRepository.findById(id);
    if (!formEntry) {
      throw new NotFoundException(`Form entry with ID ${id} not found`);
    }
    return formEntry;
  }

  async getAllFormEntries(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findAll(options);
  }

  async updateFormEntry(
    id: string,
    updateData: Partial<FormEntryModel>
  ): Promise<FormEntryModel> {
    const existingFormEntry = await this.getFormEntryById(id);
    const updatedFormEntry = { ...existingFormEntry, ...updateData, updatedAt: new Date() };
    const result = await this.formEntryRepository.update(id, updatedFormEntry);
    if (!result) {
      throw new NotFoundException(`Form entry with ID ${id} not found`);
    }
    return result;
  }

  async deleteFormEntry(id: string): Promise<boolean> {
    return this.formEntryRepository.delete(id);
  }

  async getFormEntriesByFormId(
    formId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByFormId(formId, options);
  }

  async getFormEntriesByPatientId(
    patientId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByPatientId(patientId, options);
  }

  async completeFormEntry(id: string, score?: number): Promise<FormEntryModel> {
    const formEntry = await this.getFormEntryById(id);
    const updatedFormEntry = {
      ...formEntry,
      status: FormEntryStatus.COMPLETED,
      completedAt: new Date(),
      score: score !== undefined ? score : formEntry.score,
      updatedAt: new Date(),
    };
    const result = await this.formEntryRepository.update(id, updatedFormEntry);
    if (!result) {
      throw new NotFoundException(`Form entry with ID ${id} not found`);
    }
    return result;
  }

  async cancelFormEntry(id: string): Promise<FormEntryModel> {
    const formEntry = await this.getFormEntryById(id);
    const updatedFormEntry = {
      ...formEntry,
      status: FormEntryStatus.CANCELLED,
      updatedAt: new Date(),
    };
    const result = await this.formEntryRepository.update(id, updatedFormEntry);
    if (!result) {
      throw new NotFoundException(`Form entry with ID ${id} not found`);
    }
    return result;
  }

  async saveFormData(
    id: string,
    data: Record<string, unknown>
  ): Promise<FormEntryModel> {
    const formEntry = await this.getFormEntryById(id);
    const updatedFormEntry = {
      ...formEntry,
      data,
      updatedAt: new Date(),
    };
    const result = await this.formEntryRepository.update(id, updatedFormEntry);
    if (!result) {
      throw new NotFoundException(`Form entry with ID ${id} not found`);
    }
    return result;
  }
}
