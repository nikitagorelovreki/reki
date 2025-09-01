import { Module } from '@nestjs/common';
import { DeviceService } from './services/device.service';
import { ClientService } from './services/client.service';
import { FormService } from './services/form.service';
import { FormEntryService } from './services/form-entry.service';

@Module({
  providers: [
    DeviceService,
    ClientService,
    FormService,
    FormEntryService,
  ],
  exports: [
    DeviceService,
    ClientService,
    FormService,
    FormEntryService,
  ],
})
export class UseCasesModule {}
