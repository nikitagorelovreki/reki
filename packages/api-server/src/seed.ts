import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ClientService, DeviceService, FormEntryService, FormService } from '@cuis/use-cases';
import { ClientStatus, DeviceStatus, FormEntryStatus, FormStatus, FormType } from '@cuis/domain';
import { defaultForms } from '../../../packages/api/src/forms/seed/default-forms';

async function bootstrap() {
  const logger = new Logger('Seed');
  logger.log('Starting database seed...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Получаем сервисы
    const clientService = app.get(ClientService);
    const deviceService = app.get(DeviceService);
    const formService = app.get(FormService);
    const formEntryService = app.get(FormEntryService);

    // Создаем клиентов
    logger.log('Creating clients...');
    const clients = [];
    for (let i = 1; i <= 5; i++) {
      const client = await clientService.createClient({
        firstName: `Иван${i}`,
        lastName: `Петров${i}`,
        middleName: `Сергеевич${i}`,
        fullName: `Петров${i} Иван${i} Сергеевич${i}`,
        contacts: {
          phone: `+7900${i}000000`,
          email: `client${i}@example.com`,
          address: `Улица Примерная, дом ${i}`
        },
        dob: new Date(1980 + i, 0, i),
        status: i % 2 === 0 ? ClientStatus.ACTIVE_THERAPY : ClientStatus.INTAKE,
        diagnosis: `Тестовый диагноз #${i}`,
      });
      clients.push(client);
      logger.log(`Created client: ${client.firstName} ${client.lastName}`);
    }

    // Создаем устройства
    logger.log('Creating devices...');
    const devices = [];
    for (let i = 1; i <= 8; i++) {
      const device = await deviceService.createDevice({
        model: `Устройство ${i}`,
        serial: `SN${i}00${i}`,
        status: i % 2 === 0 ? DeviceStatus.AT_CLINIC : DeviceStatus.IN_STOCK,
        lastSeenAt: new Date(),
        maintenanceNotes: { notes: `Тестовое устройство #${i}` },
      });
      devices.push(device);
      logger.log(`Created device: ${device.model}`);
    }

    // Создаем формы
    logger.log('Creating forms...');
    const forms = [];
    for (const formData of defaultForms) {
      try {
        const form = await formService.createForm({
          title: formData.title,
          type: formData.type as FormType,
          description: formData.description,
          status: FormStatus.ACTIVE,
          schema: formData.schema,
        });
        forms.push(form);
        logger.log(`Created form: ${form.title}`);
      } catch (error) {
        logger.error(`Error creating form ${formData.title}:`, error);
      }
    }

    // Создаем заполнения форм
    logger.log('Creating form entries...');
    if (forms.length > 0 && clients.length > 0) {
      const lfkForm = forms.find(f => f.type === 'lfk');
      const fimForm = forms.find(f => f.type === 'fim');

      if (lfkForm) {
        for (let i = 0; i < 3; i++) {
          const client = clients[i % clients.length];
          const entry = await formEntryService.createFormEntry({
            formId: lfkForm.id,
            patientId: client.id,
            createdBy: 'Доктор Иванов',
            data: {
              therapistName: 'Доктор Иванов', // Это поле будет в JSON данных
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
            },
          });
          logger.log(`Created LFK form entry for client: ${client.firstName} ${client.lastName}`);
        }
      }

      if (fimForm) {
        for (let i = 0; i < 3; i++) {
          const client = clients[i % clients.length];
          const entry = await formEntryService.createFormEntry({
            formId: fimForm.id,
            patientId: client.id,
            createdBy: 'Доктор Петров',
            data: {
              therapistName: 'Доктор Петров', // Это поле будет в JSON данных
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
            },
          });
          logger.log(`Created FIM form entry for client: ${client.firstName} ${client.lastName}`);
        }
      }
    }

    logger.log('Seed completed successfully!');
  } catch (error) {
    logger.error('Error during seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
