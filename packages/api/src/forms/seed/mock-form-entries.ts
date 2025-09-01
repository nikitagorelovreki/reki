import { FormEntryStatus } from '@reki/domain';

export const mockFormEntries = [
  {
    id: 'mock-entry-1',
    formId: '36541e76-d3cf-4618-93f2-b63f36f28660', // FIM форма
    patientId: '1a27c06b-a2fc-471b-9057-a369d0e669d0',
    status: FormEntryStatus.COMPLETED,
    data: {
      therapistName: 'Иванова Анна Петровна',
      examinationDate: '2025-09-01',
      eating: 6,
      grooming: 5,
      bathing: 4,
      dressing_upper: 6,
      dressing_lower: 5,
      toileting: 6,
      bladder: 6,
      bowel: 5,
      transfer_bed: 5,
      transfer_toilet: 4,
      transfer_bath: 3,
      locomotion_walk: 4,
      locomotion_stairs: 3,
      comprehension: 7,
      expression: 6,
      social_interaction: 6,
      problem_solving: 5,
      memory: 6,
      total_score: 95,
      conclusion: 'Пациент демонстрирует хороший уровень функциональной независимости',
      recommendations: 'Продолжить реабилитационные мероприятия, уделить внимание координации движений'
    },
    score: 95,
    completedAt: '2025-09-01T10:30:00.000Z',
    createdAt: '2025-09-01T09:00:00.000Z',
    updatedAt: '2025-09-01T10:30:00.000Z'
  },
  {
    id: 'mock-entry-2',
    formId: '1652b729-e2ec-4cd4-9489-d9ab38e16db8', // ЛФК форма
    patientId: 'c9cd7f5f-90cd-4b75-9996-94bc7dc9e211',
    status: FormEntryStatus.COMPLETED,
    data: {
      therapistName: 'Петров Сергей Александрович',
      examinationDate: '2025-09-01',
      diagnosis: 'Состояние после инсульта',
      complaints: 'Слабость в правой руке, нарушение координации',
      anamnesis: 'Инсульт 3 месяца назад, гемипарез справа',
      generalCondition: 'Удовлетворительное',
      consciousness: 'Ясное',
      position: 'Активное',
      mobility: 'С помощью вспомогательных средств',
      muscleStrength: 3,
      jointMobility: 4,
      balance: 2,
      coordination: 2,
      conclusion: 'Умеренные нарушения двигательных функций',
      recommendations: 'Индивидуальная программа ЛФК, тренировка равновесия'
    },
    score: 65,
    completedAt: '2025-09-01T14:15:00.000Z',
    createdAt: '2025-09-01T13:00:00.000Z',
    updatedAt: '2025-09-01T14:15:00.000Z'
  },
  {
    id: 'mock-entry-3',
    formId: '36541e76-d3cf-4618-93f2-b63f36f28660', // FIM форматить 
    patientId: '3c0298d1-3ef2-4623-a963-7005274afbbb',
    status: FormEntryStatus.IN_PROGRESS,
    data: {
      therapistName: 'Сидорова Мария Владимировна',
      examinationDate: '2025-09-01',
      eating: 4,
      grooming: 3,
      bathing: 2,
      dressing_upper: 3,
      dressing_lower: 2,
      toileting: 3,
      bladder: 4,
      bowel: 3,
      transfer_bed: 2,
      transfer_toilet: 2,
      transfer_bath: 1,
      locomotion_walk: 1,
      locomotion_stairs: 1,
      comprehension: 5,
      expression: 4,
      social_interaction: 4,
      problem_solving: 3,
      memory: 4
    },
    createdAt: '2025-09-01T16:00:00.000Z',
    updatedAt: '2025-09-01T16:00:00.000Z'
  },
  {
    id: 'mock-entry-4',
    formId: '1652b729-e2ec-4cd4-9489-d9ab38e16db8', // ЛФК форма
    patientId: '3dd12685-f1f2-4e7c-97e9-0128f64ab87f',
    status: FormEntryStatus.IN_PROGRESS,
    data: {
      therapistName: 'Козлов Дмитрий Игоревич',
      examinationDate: '2025-09-01',
      diagnosis: 'Остеохондроз поясничного отдела',
      complaints: 'Боль в пояснице, иррадиация в ногу',
      anamnesis: 'Хроническая боль в спине 2 года',
      generalCondition: 'Удовлетворительное',
      consciousness: 'Ясное',
      position: 'Активное',
      mobility: 'Самостоятельно',
      muscleStrength: 4,
      jointMobility: 3,
      balance: 4,
      coordination: 4
    },
    createdAt: '2025-09-01T11:30:00.000Z',
    updatedAt: '2025-09-01T11:30:00.000Z'
  },
  {
    id: 'mock-entry-5',
    formId: '36541e76-d3cf-4618-93f2-b63f36f28660', // FIM форма
    patientId: '0d776fd7-bea2-41ef-b9d0-706dd8024cd6',
    status: FormEntryStatus.CANCELLED,
    data: {},
    createdAt: '2025-09-01T08:00:00.000Z',
    updatedAt: '2025-09-01T08:30:00.000Z'
  }
];
