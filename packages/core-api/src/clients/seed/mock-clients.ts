// Локальный enum для статусов клиентов в API слое
export enum ClientStatus {
  INTAKE = 'intake',
  DIAGNOSTICS = 'diagnostics',
  ACTIVE_THERAPY = 'active_therapy',
  FOLLOWUP = 'followup',
  DISCHARGED = 'discharged',
}

export const mockClients = [
  {
    id: 'mock-client-1',
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
    status: ClientStatus.ACTIVE_THERAPY,
    clinicId: null,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-09-01T10:00:00.000Z'
  },
  {
    id: 'mock-client-2',
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
    status: ClientStatus.DIAGNOSTICS,
    clinicId: null,
    createdAt: '2025-02-20T14:30:00.000Z',
    updatedAt: '2025-09-01T14:30:00.000Z'
  },
  {
    id: 'mock-client-3',
    fullName: 'Сидоров Петр Николаевич',
    firstName: 'Петр',
    lastName: 'Сидоров',
    middleName: 'Николаевич',
    dob: '1992-11-08',
    diagnosis: 'Травма коленного сустава',
    contacts: {
      phone: '+7 (900) 345-67-89',
      email: 'sidorov@example.com',
      address: 'г. Москва, ул. Гагарина, д. 5, кв. 8'
    },
    status: ClientStatus.INTAKE,
    clinicId: null,
    createdAt: '2025-03-10T09:15:00.000Z',
    updatedAt: '2025-09-01T09:15:00.000Z'
  },
  {
    id: 'mock-client-4',
    fullName: 'Козлова Елена Александровна',
    firstName: 'Елена',
    lastName: 'Козлова',
    middleName: 'Александровна',
    dob: '1980-04-12',
    diagnosis: 'Артрит тазобедренного сустава',
    contacts: {
      phone: '+7 (900) 456-78-90',
      email: 'kozlova@example.com',
      address: 'г. Москва, ул. Королева, д. 20, кв. 15'
    },
    status: ClientStatus.FOLLOWUP,
    clinicId: null,
    createdAt: '2025-01-05T16:45:00.000Z',
    updatedAt: '2025-09-01T16:45:00.000Z'
  },
  {
    id: 'mock-client-5',
    fullName: 'Морозов Дмитрий Владимирович',
    firstName: 'Дмитрий',
    lastName: 'Морозов',
    middleName: 'Владимирович',
    dob: '1975-09-30',
    diagnosis: 'Грыжа межпозвонкового диска',
    contacts: {
      phone: '+7 (900) 567-89-01',
      email: 'morozov@example.com',
      address: 'г. Москва, ул. Мира, д. 30, кв. 22'
    },
    status: ClientStatus.DISCHARGED,
    clinicId: null,
    createdAt: '2025-02-12T11:20:00.000Z',
    updatedAt: '2025-09-01T11:20:00.000Z'
  }
];
