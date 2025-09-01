import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FORM_REPOSITORY,
  FormModel,
  FormStatus,
  FormType,
  IFormRepository,
  PaginatedResult,
  PaginationOptions,
} from '@reki/domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormService {
  constructor(
    @Inject(FORM_REPOSITORY)
    private readonly formRepository: IFormRepository
  ) {}

  async createForm(formData: Partial<FormModel>): Promise<FormModel> {
    const form = new FormModel({
      id: uuidv4(),
      status: FormStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...formData,
    });
    return this.formRepository.create(form);
  }

  async getFormById(id: string): Promise<FormModel> {
    const form = await this.formRepository.findById(id);
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  async getAllForms(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<FormModel>> {
    return this.formRepository.findAll(options);
  }

  async updateForm(
    id: string,
    updateData: Partial<FormModel>
  ): Promise<FormModel> {
    const existingForm = await this.getFormById(id);
    existingForm.update(updateData);
    return this.formRepository.update(id, existingForm);
  }

  async deleteForm(id: string): Promise<boolean> {
    return this.formRepository.delete(id);
  }

  async getFormsByTitle(title: string): Promise<FormModel[]> {
    return this.formRepository.findByTitle(title);
  }

  async getFormsByType(type: FormType): Promise<FormModel[]> {
    return this.formRepository.findByType(type);
  }

  async getFormsByStatus(status: FormStatus): Promise<FormModel[]> {
    return this.formRepository.findByStatus(status);
  }

  async getLatestVersionByTitle(title: string): Promise<FormModel | null> {
    return this.formRepository.findLatestVersion(title);
  }

  async createNewVersion(id: string): Promise<FormModel> {
    const existingForm = await this.getFormById(id);
    const newVersion = existingForm.createNewVersion();
    return this.formRepository.create(newVersion);
  }

  async publishForm(id: string): Promise<FormModel> {
    const form = await this.getFormById(id);
    form.status = FormStatus.ACTIVE;
    form.updatedAt = new Date();
    return this.formRepository.update(id, form);
  }

  async archiveForm(id: string): Promise<FormModel> {
    const form = await this.getFormById(id);
    form.status = FormStatus.ARCHIVED;
    form.updatedAt = new Date();
    return this.formRepository.update(id, form);
  }
}
