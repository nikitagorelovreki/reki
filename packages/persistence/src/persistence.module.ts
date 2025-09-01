import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { DeviceRepository } from './repositories/device.repository';
import { ClientRepository } from './repositories/client.repository';
import { FormRepository } from './repositories/form.repository';
import { FormEntryRepository } from './repositories/form-entry.repository';
import {
  CLIENT_REPOSITORY,
  DEVICE_REPOSITORY,
  FORM_ENTRY_REPOSITORY,
  FORM_REPOSITORY,
} from '@reki/domain';

@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    DeviceRepository,
    ClientRepository,
    FormRepository,
    FormEntryRepository,
    // Провайдеры для связывания портов с реализациями
    {
      provide: DEVICE_REPOSITORY,
      useExisting: DeviceRepository,
    },
    {
      provide: CLIENT_REPOSITORY,
      useExisting: ClientRepository,
    },
    {
      provide: FORM_REPOSITORY,
      useExisting: FormRepository,
    },
    {
      provide: FORM_ENTRY_REPOSITORY,
      useExisting: FormEntryRepository,
    },
  ],
  exports: [
    DatabaseService,
    DeviceRepository,
    ClientRepository,
    FormRepository,
    FormEntryRepository,
    // Экспортируем провайдеры портов
    DEVICE_REPOSITORY,
    CLIENT_REPOSITORY,
    FORM_REPOSITORY,
    FORM_ENTRY_REPOSITORY,
  ],
})
export class PersistenceModule {}
