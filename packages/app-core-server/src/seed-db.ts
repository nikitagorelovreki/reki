import { v4 as uuidv4 } from 'uuid';
import { defaultForms } from '../../api/src/forms/seed/default-forms';
import knexConfig from '../../core-persistence/src/database/knex-config';

async function seed(): Promise<void> {
  console.log('Starting database seed...');
  // Динамически импортируем Knex
  const { default: knex } = await import('knex');
  const db = knex(knexConfig);

  try {
    // Очищаем все таблицы в обратном порядке зависимостей
    console.log('Clearing all tables...');
    await db('form_entries').del();
    await db('form_templates').del();
    await db('devices').del();
    await db('clients').del();
    console.log('All tables cleared successfully');

    // Создаем клиентов
    console.log('Creating clients...');
    const clients = [];
    for (let i = 1; i <= 5; i++) {
      const id = uuidv4();
      await db('clients').insert({
        id,
        full_name: `Петров${i} Иван${i} Сергеевич${i}`,
        first_name: `Иван${i}`,
        last_name: `Петров${i}`,
        middle_name: `Сергеевич${i}`,
        contacts: JSON.stringify({
          phone: `+7900${i}000000`,
          email: `client${i}@example.com`,
          address: `Улица Примерная, дом ${i}`,
        }),
        dob: new Date(1980 + i, 0, i),
        status: i % 2 === 0 ? 'active' : 'intake',
        diagnosis: `Тестовый диагноз #${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
      clients.push({
        id,
        firstName: `Иван${i}`,
        lastName: `Петров${i}`,
      });
      console.log(
        `Created client: ${clients[clients.length - 1].firstName} ${clients[clients.length - 1].lastName}`
      );
    }

    // Создаем устройства
    console.log('Creating devices...');
    const devices = [];
    for (let i = 1; i <= 8; i++) {
      const id = uuidv4();
      await db('devices').insert({
        id,
        serial: `SN${i}00${i}`,
        model: `Устройство ${i}`,
        status: i % 2 === 0 ? 'AT_CLINIC' : 'REGISTERED',
        last_seen_at: new Date(),
        maintenance_notes: JSON.stringify({
          notes: `Тестовое устройство #${i}`,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });
      devices.push({
        id,
        model: `Устройство ${i}`,
      });
      console.log(`Created device: ${devices[devices.length - 1].model}`);
    }

    // Создаем формы
    console.log('Creating forms...');
    const forms = [];
    for (const formData of defaultForms) {
      // Проверяем, существует ли уже форма с таким типом
      const existingForm = await db('form_templates')
        .where('type', formData.type)
        .first();

      if (existingForm) {
        console.log(`Form ${formData.title} already exists, skipping...`);
        forms.push({
          id: existingForm.id,
          title: formData.title,
          type: formData.type,
        });
        continue;
      }

      const id = uuidv4();
      await db('form_templates').insert({
        id,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        is_active: true,
        schema: JSON.stringify(formData.schema),
        created_at: new Date(),
        updated_at: new Date(),
      });
      forms.push({
        id,
        title: formData.title,
        type: formData.type,
      });
      console.log(`Created form: ${formData.title}`);
    }

    // Создаем заполнения форм
    console.log('Creating form entries...');
    if (forms.length > 0 && clients.length > 0) {
      const lfkForm = forms.find(f => f.type === 'lfk');
      const fimForm = forms.find(f => f.type === 'fim');

      if (lfkForm) {
        for (let i = 0; i < 3; i++) {
          const client = clients[i % clients.length];

          const id = uuidv4();
          await db('form_entries').insert({
            id,
            form_template_id: lfkForm.id,
            client_id: client.id,
            status: 'completed',
            data: JSON.stringify({
              therapistName: 'Доктор Иванов',
              examinationDate: new Date().toISOString().split('T')[0],
              diagnosis: 'Тестовый диагноз',
              complaints: 'Тестовые жалобы',
              anamnesis: 'Тестовый анамнез',
              generalCondition: 'Удовлетворительное',
              consciousness: 'Ясное',
              position: 'Активное',
              mobility: 'Самостоятельно',
              muscleStrength: 4,
              jointMobility: 3,
              balance: 4,
              coordination: 3,
              conclusion: 'Тестовое заключение',
              recommendations: 'Тестовые рекомендации',
            }),
            created_at: new Date(),
            updated_at: new Date(),
            completed_at: new Date(),
          });
          console.log(
            `Created LFK form entry for client: ${client.firstName} ${client.lastName}`
          );
        }
      }

      if (fimForm) {
        for (let i = 0; i < 3; i++) {
          const client = clients[i % clients.length];

          const id = uuidv4();
          await db('form_entries').insert({
            id,
            form_template_id: fimForm.id,
            client_id: client.id,
            status: 'completed',
            data: JSON.stringify({
              therapistName: 'Доктор Петров',
              examinationDate: new Date().toISOString().split('T')[0],
              // Самообслуживание (ADL)
              eatingScoreBefore: 4,
              eatingScoreAfter: 6,
              swallowingScoreBefore: 5,
              swallowingScoreAfter: 7,
              groomingScoreBefore: 3,
              groomingScoreAfter: 5,
              bathingScoreBefore: 2,
              bathingScoreAfter: 4,
              dressUpperScoreBefore: 4,
              dressUpperScoreAfter: 6,
              dressLowerScoreBefore: 3,
              dressLowerScoreAfter: 5,
              toiletingScoreBefore: 4,
              toiletingScoreAfter: 6,
              bladderScoreBefore: 5,
              bladderScoreAfter: 6,
              bowelScoreBefore: 4,
              bowelScoreAfter: 5,
              // Перемещения и мобильность
              bedTransferScoreBefore: 3,
              bedTransferScoreAfter: 5,
              toiletTransferScoreBefore: 2,
              toiletTransferScoreAfter: 4,
              bathTransferScoreBefore: 1,
              bathTransferScoreAfter: 3,
              carTransferScoreBefore: 2,
              carTransferScoreAfter: 4,
              locomotionScoreBefore: 2,
              locomotionScoreAfter: 4,
              stairsScoreBefore: 1,
              stairsScoreAfter: 3,
              mobilityScoreBefore: 2,
              mobilityScoreAfter: 4,
              // Коммуникация и когнитивные навыки
              comprehensionScoreBefore: 6,
              comprehensionScoreAfter: 7,
              expressionScoreBefore: 5,
              expressionScoreAfter: 6,
              readingScoreBefore: 5,
              readingScoreAfter: 6,
              writingScoreBefore: 4,
              writingScoreAfter: 5,
              speechScoreBefore: 5,
              speechScoreAfter: 6,
              socialInteractionScoreBefore: 5,
              socialInteractionScoreAfter: 6,
              emotionalStatusScoreBefore: 4,
              emotionalStatusScoreAfter: 5,
              adjustmentScoreBefore: 4,
              adjustmentScoreAfter: 5,
              leisureActivitiesScoreBefore: 3,
              leisureActivitiesScoreAfter: 4,
              problemSolvingScoreBefore: 4,
              problemSolvingScoreAfter: 5,
              memoryScoreBefore: 5,
              memoryScoreAfter: 6,
              orientationScoreBefore: 5,
              orientationScoreAfter: 6,
              concentrationScoreBefore: 4,
              concentrationScoreAfter: 5,
              safetyAwarenessScoreBefore: 4,
              safetyAwarenessScoreAfter: 5,
              conclusion:
                'Пациент демонстрирует значительное улучшение функциональной независимости',
              recommendations:
                'Продолжить реабилитационные мероприятия, уделить внимание координации движений',
            }),
            created_at: new Date(),
            updated_at: new Date(),
            completed_at: new Date(),
          });
          console.log(
            `Created FIM form entry for client: ${client.firstName} ${client.lastName}`
          );
        }
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await db.destroy();
  }
}

// Экспортируем функцию для использования в тестах
export const seedDatabase = seed;

// Запускаем сид только если файл запущен напрямую
if (require.main === module) {
  seed();
}
