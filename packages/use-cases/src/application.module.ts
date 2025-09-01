import { Module } from '@nestjs/common';
import { DeviceService } from './services/device.service';
import { ClientService } from './services/client.service';

@Module({
  providers: [
    DeviceService,
    ClientService,
  ],
  exports: [
    DeviceService,
    ClientService,
  ],
})
export class UseCasesModule {}
