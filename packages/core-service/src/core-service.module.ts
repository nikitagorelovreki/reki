import { Module } from '@nestjs/common';
import { CorePersistenceModule } from '@reki/core-persistence';
import { DeviceService } from './services/device.service';
import { ClientService } from './services/client.service';
import { FormService } from './services/form.service';
import { DeviceMapper } from './mappers/device.mapper';
import { ClientMapper } from './mappers/client.mapper';
import { FormEntryService } from './services/form-entry.service';
import { FormMapper } from './mappers/form.mapper';

@Module({
  imports: [CorePersistenceModule],
  providers: [
    DeviceService,
    ClientService,
    FormService,
    FormEntryService,
    DeviceMapper,
    ClientMapper,
    FormMapper,
  ],
  exports: [
    DeviceService,
    ClientService,
    FormService,
    FormEntryService,
    DeviceMapper,
    ClientMapper,
    FormMapper,
  ],
})
export class CoreServiceModule {}
