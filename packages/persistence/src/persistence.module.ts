import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { DeviceRepository } from './repositories/device.repository';
import { ClientRepository } from './repositories/client.repository';
import { FormRepository } from './repositories/form.repository';
import { FormEntryRepository } from './repositories/form-entry.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    DeviceRepository,
    ClientRepository,
    FormRepository,
    FormEntryRepository,
  ],
  exports: [
    DatabaseService,
    DeviceRepository,
    ClientRepository,
    FormRepository,
    FormEntryRepository,
  ],
})
export class PersistenceModule {}
