import knex from 'knex';

const mockClients = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    fullName: 'Иванов Иван Иванович',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    dob: '1985-03-15',
    diagnosis: 'Состояние после инсульта',
    contacts: {
      phone: '+7 (900) 123-45-67',
      email: 'ivanov@example.com',
      address: 'г. Москва, ул. Ленина, д. 10, кв. 25'
    },
    status: 'active',
    clinicId: null,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-09-01T10:00:00.000Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    fullName: 'Петрова Анна Сергеевна',
    firstName: 'Анна',
    lastName: 'Петрова',
    middleName: 'Сергеевна',
    dob: '1978-07-22',
    diagnosis: 'Остеохондроз поясничного отдела',
    contacts: {
      phone: '+7 (900) 234-56-78',
      email: 'petrova@example.com',
      address: 'г. Москва, ул. Пушкина, д. 15, кв. 12'
    },
    status: 'intake',
    clinicId: null,
    createdAt: '2025-02-20T14:30:00.000Z',
    updatedAt: '2025-09-01T14:30:00.000Z'
  }
];

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'reki',
    password: 'reki',
    database: 'reki',
  },
});

async function seedClients() {
  try {
    console.log('Starting client seeding...');
    
    for (const client of mockClients) {
      await db('clients').insert({
        id: client.id,
        full_name: client.fullName,
        first_name: client.firstName,
        last_name: client.lastName,
        middle_name: client.middleName,
        dob: client.dob,
        diagnosis: client.diagnosis,
        contacts: client.contacts,
        status: client.status,
        clinic_id: client.clinicId,
        created_at: client.createdAt,
        updated_at: client.updatedAt,
      });
      console.log(`Inserted client: ${client.fullName}`);
    }
    
    console.log('Client seeding completed successfully!');
  } catch (error) {
    console.error('Client seeding failed:', error);
  } finally {
    await db.destroy();
  }
}

seedClients();
