import { Module } from '@nestjs/common';
import { PersistenceModule } from '@reki/persistence';
import { DeviceService } from './services/device.service';
import { ClientService } from './services/client.service';
import { FormService } from './services/form.service';
import { FormEntryService } from './services/form-entry.service';

@Module({
  imports: [PersistenceModule],
  providers: [DeviceService, ClientService, FormService, FormEntryService],
  exports: [DeviceService, ClientService, FormService, FormEntryService],
})
export class UseCasesModule {}
