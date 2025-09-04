import { Module } from '@nestjs/common';
import { PersistenceCommonsModule } from '@reki/persistence-commons';
import { DeviceRepository } from './repositories/device.repository';
import { ClientRepository } from './repositories/client.repository';
import { FormRepository } from './repositories/form.repository';
import { FormEntryRepository } from './repositories/form-entry.repository';
import { FormSubmissionRepository } from './repositories/form-submission.repository';
import { DEVICE_REPOSITORY_TOKEN } from './ports/device-repository.port';

@Module({
  imports: [PersistenceCommonsModule],
  providers: [
    {
      provide: DEVICE_REPOSITORY_TOKEN,
      useClass: DeviceRepository,
    },
    ClientRepository,
    FormRepository,
    FormEntryRepository,
    FormSubmissionRepository,
  ],
  exports: [
    DEVICE_REPOSITORY_TOKEN,
    ClientRepository,
    FormRepository,
    FormEntryRepository,
    FormSubmissionRepository,
  ],
})
export class CorePersistenceModule {}
