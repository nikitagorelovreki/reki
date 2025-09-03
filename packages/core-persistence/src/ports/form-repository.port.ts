import { Form } from '@reki/core-domain';

export interface FormRepositoryPort {
  create(data: any): Promise<Form>;
  findById(id: string): Promise<Form | null>;
  findByTitle(title: string): Promise<Form | null>;
  findAll(page?: number, limit?: number): Promise<Form[]>;
  update(id: string, data: any): Promise<Form | null>;
  delete(id: string): Promise<void>;
}
