import { v4 as uuidv4 } from 'uuid';
import { defaultForms } from '../../api/src/forms/seed/default-forms';
import knexConfig from '../../persistence/src/database/knex-config';

async function seed(): Promise<void> {
  console.log('Starting database seed...');
  // Динамически импортируем Knex
  const { default: knex } = await import('knex');
  const db = knex(knexConfig);

  try {
    // Создаем клиентов
    console.log('Creating clients...');
    const clients = [];
    for (let i = 1; i <= 5; i++) {
      // Проверяем, существует ли уже клиент с таким именем
      const existingClient = await db('clients')
        .where('first_name', `Иван${i}`)
        .where('last_name', `Петров${i}`)
        .first();
      
      if (existingClient) {
        console.log(`Client Иван${i} Петров${i} already exists, skipping...`);
        clients.push({
          id: existingClient.id,
          firstName: `Иван${i}`,
          lastName: `Петров${i}`,
        });
        continue;
      }

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
        status: i % 2 === 0 ? 'active_therapy' : 'intake',
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
      // Проверяем, существует ли уже устройство с таким серийным номером
      const existingDevice = await db('devices')
        .where('serial', `SN${i}00${i}`)
        .first();
      
      if (existingDevice) {
        console.log(`Device with serial SN${i}00${i} already exists, skipping...`);
        devices.push({
          id: existingDevice.id,
          model: `Устройство ${i}`,
        });
        continue;
      }

      const id = uuidv4();
      await db('devices').insert({
        id,
        serial: `SN${i}00${i}`,
        model: `Устройство ${i}`,
        status: i % 2 === 0 ? 'AT_CLINIC' : 'IN_STOCK',
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
        status: 'active',
        version: 1,
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
          
          // Проверяем, существует ли уже form entry для этого клиента и формы
          const existingEntry = await db('form_entries')
            .where('form_id', lfkForm.id)
            .where('patient_id', client.id)
            .first();
          
          if (existingEntry) {
            console.log(`LFK form entry for client ${client.firstName} ${client.lastName} already exists, skipping...`);
            continue;
          }

          const id = uuidv4();
          await db('form_entries').insert({
            id,
            form_id: lfkForm.id,
            patient_id: client.id,
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
          
          // Проверяем, существует ли уже form entry для этого клиента и формы
          const existingEntry = await db('form_entries')
            .where('form_id', fimForm.id)
            .where('patient_id', client.id)
            .first();
          
          if (existingEntry) {
            console.log(`FIM form entry for client ${client.firstName} ${client.lastName} already exists, skipping...`);
            continue;
          }

          const id = uuidv4();
          await db('form_entries').insert({
            id,
            form_id: fimForm.id,
            patient_id: client.id,
            status: 'completed',
            data: JSON.stringify({
              therapistName: 'Доктор Петров',
              fim_date: new Date().toISOString().split('T')[0],
              fim_eating_adm: '5',
              fim_grooming_adm: '4',
              fim_bathing_adm: '3',
              fim_dress_upper_adm: '4',
              fim_dress_lower_adm: '3',
              fim_toileting_adm: '4',
              fim_bladder_adm: '5',
              fim_bowel_adm: '5',
              fim_bed_transfer_adm: '4',
              fim_toilet_transfer_adm: '4',
              fim_bath_transfer_adm: '3',
              fim_locomotion_adm: '4',
              fim_stairs_adm: '3',
              fim_comprehension_adm: '6',
              fim_expression_adm: '5',
              fim_social_interaction_adm: '6',
              fim_problem_solving_adm: '5',
              fim_memory_adm: '5',
              fim_eating_dis: '6',
              fim_grooming_dis: '5',
              fim_bathing_dis: '4',
              fim_dress_upper_dis: '5',
              fim_dress_lower_dis: '4',
              fim_toileting_dis: '5',
              fim_bladder_dis: '6',
              fim_bowel_dis: '6',
              fim_bed_transfer_dis: '5',
              fim_toilet_transfer_dis: '5',
              fim_bath_transfer_dis: '4',
              fim_locomotion_dis: '5',
              fim_stairs_dis: '4',
              fim_comprehension_dis: '7',
              fim_expression_dis: '6',
              fim_social_interaction_dis: '7',
              fim_problem_solving_dis: '6',
              fim_memory_dis: '6',
              fim_notes: 'Тестовые заметки по FIM',
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

seed();
