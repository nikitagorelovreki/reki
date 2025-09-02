// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require('dotenv');

// Загружаем переменные окружения для тестов
config({ path: '.env.test' });

// Глобальные настройки для тестов
global.testTimeout = 30000;

// Настройка логирования для тестов
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Уменьшаем логирование в тестах

// Глобальные утилиты для тестов
global.testUtils = {
  // Генерация тестовых данных
  generateTestClient: (overrides = {}) => ({
    fullName: 'Тестовый Пациент',
    firstName: 'Тестовый',
    lastName: 'Пациент',
    middleName: 'Тестович',
    contacts: JSON.stringify({
      phone: '+79001234567',
      email: 'test@example.com',
      address: 'Тестовый адрес',
    }),
    dob: new Date('1990-01-01'),
    status: 'active_therapy',
    diagnosis: 'Тестовый диагноз',
    ...overrides,
  }),

  // Генерация тестового устройства
  generateTestDevice: (overrides = {}) => ({
    serial: `TEST-${Date.now()}`,
    model: 'Тестовое устройство',
    status: 'IN_STOCK',
    lastSeenAt: new Date(),
    maintenanceNotes: JSON.stringify({
      notes: 'Тестовые заметки',
    }),
    ...overrides,
  }),

  // Генерация тестовой формы
  generateTestForm: (overrides = {}) => ({
    title: 'Тестовая форма',
    type: 'test',
    status: 'active',
    version: 1,
    schema: {
      sections: [
        {
          title: 'Тестовая секция',
          fields: [
            {
              name: 'testField',
              type: 'text',
              label: 'Тестовое поле',
              required: true,
            },
          ],
        },
      ],
    },
    ...overrides,
  }),

  // Ожидание асинхронных операций
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),

  // Очистка тестовых данных
  cleanupTestData: async db => {
    try {
      await db('form_entries').del();
      await db('form_templates').del();
      await db('devices').del();
      await db('clients').del();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Ошибка при очистке тестовых данных:', error);
    }
  },
};
