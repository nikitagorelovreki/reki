import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from '@reki/persistence-commons';
import { Client, CreateClientDto, UpdateClientDto } from '@reki/core-domain';
import { ClientRepositoryPort } from '../ports/client-repository.port';

@Injectable()
export class ClientRepository implements ClientRepositoryPort {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(data: CreateClientDto): Promise<Client> {
    // Формируем fullName из firstName, lastName и middleName
    const nameParts = [
      data.lastName,
      data.firstName,
      data.middleName,
    ].filter(Boolean);
    const fullName = nameParts.join(' ');

    const [client] = await this.knex('clients')
      .insert({
        full_name: fullName,
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        dob: data.dob,
        diagnosis: data.diagnosis,
        contacts: data.contacts,
        status: data.status || 'intake',
        clinic_id: data.clinicId,
      })
      .returning('*');

    if (!client) {
      throw new Error('Failed to create client');
    }

    return this.mapToClient(client);
  }

  async findById(id: string): Promise<Client | null> {
    const result = await this.knex('clients')
      .where('id', id)
      .first();

    if (!result) return null;

    return this.mapToClient(result);
  }

  async findByFullName(fullName: string): Promise<Client | null> {
    const result = await this.knex('clients')
      .where('full_name', fullName)
      .first();

    if (!result) return null;

    return this.mapToClient(result);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const result = await this.knex('clients')
      .whereRaw("contacts->>'email' = ?", [email])
      .first();

    if (!result) return null;

    return this.mapToClient(result);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Client[]> {
    const offset = (page - 1) * limit;

    const results = await this.knex('clients')
      .orderBy('created_at', 'desc')
      .offset(offset)
      .limit(limit);

    return results.map(this.mapToClient);
  }

  async update(id: string, data: UpdateClientDto): Promise<Client | null> {
    const updateData: any = {};
    
    // Если обновляются имя, фамилия или отчество, пересчитываем fullName
    if (data.firstName !== undefined || data.lastName !== undefined || data.middleName !== undefined) {
      const nameParts = [
        data.lastName,
        data.firstName,
        data.middleName,
      ].filter(Boolean);
      updateData.full_name = nameParts.join(' ');
    }
    
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.middleName !== undefined) updateData.middle_name = data.middleName;
    if (data.dob !== undefined) updateData.dob = data.dob;
    if (data.diagnosis !== undefined) updateData.diagnosis = data.diagnosis;
    if (data.contacts !== undefined) updateData.contacts = data.contacts;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.clinicId !== undefined) updateData.clinic_id = data.clinicId;

    const [client] = await this.knex('clients')
      .where('id', id)
      .update(updateData)
      .returning('*');

    if (!client) return null;

    return this.mapToClient(client);
  }

  async delete(id: string): Promise<void> {
    await this.knex('clients')
      .where('id', id)
      .del();
  }

  private mapToClient(result: any): Client {
    return new Client({
      id: result.id,
      firstName: result.first_name,
      lastName: result.last_name,
      middleName: result.middle_name,
      dob: result.dob,
      diagnosis: result.diagnosis,
      contacts: result.contacts,
      status: result.status,
      clinicId: result.clinic_id,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
}
