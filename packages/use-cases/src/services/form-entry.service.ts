import { Injectable, NotFoundException } from '@nestjs/common';
import { IFormEntryRepository, FormEntryModel, FormEntryStatus, PaginationOptions, PaginatedResult } from '@cuis/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormEntryService {
  constructor(private readonly formEntryRepository: IFormEntryRepository) {}

  async createFormEntry(formEntryData: Partial<FormEntryModel>): Promise<FormEntryModel> {
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

  async getAllFormEntries(options: PaginationOptions = {}): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findAll(options);
  }

  async updateFormEntry(id: string, updateData: Partial<FormEntryModel>): Promise<FormEntryModel> {
    const existingFormEntry = await this.getFormEntryById(id);
    existingFormEntry.update(updateData);
    return this.formEntryRepository.update(id, existingFormEntry);
  }

  async deleteFormEntry(id: string): Promise<boolean> {
    return this.formEntryRepository.delete(id);
  }

  async getFormEntriesByFormId(formId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByFormId(formId, options);
  }

  async getFormEntriesByPatientId(patientId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByPatientId(patientId, options);
  }

  async getFormEntriesByDeviceId(deviceId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByDeviceId(deviceId, options);
  }

  async getFormEntriesByClinicId(clinicId: string, options: PaginationOptions = {}): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByClinicId(clinicId, options);
  }

  async getFormEntriesByStatus(status: FormEntryStatus, options: PaginationOptions = {}): Promise<PaginatedResult<FormEntryModel>> {
    return this.formEntryRepository.findByStatus(status, options);
  }

  async completeFormEntry(id: string, score?: number): Promise<FormEntryModel> {
    const formEntry = await this.getFormEntryById(id);
    formEntry.complete(score);
    return this.formEntryRepository.update(id, formEntry);
  }

  async cancelFormEntry(id: string): Promise<FormEntryModel> {
    const formEntry = await this.getFormEntryById(id);
    formEntry.cancel();
    return this.formEntryRepository.update(id, formEntry);
  }

  async saveFormData(id: string, data: Record<string, any>): Promise<FormEntryModel> {
    const formEntry = await this.getFormEntryById(id);
    formEntry.data = data;
    formEntry.updatedAt = new Date();
    return this.formEntryRepository.update(id, formEntry);
  }
}
