import { Module } from '@nestjs/common';
import { CoreServiceModule } from '@reki/core-service';
import { DevicesModule } from './devices/devices.module';
import { ClientsModule } from './clients/clients.module';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [CoreServiceModule, DevicesModule, ClientsModule, FormsModule],
  exports: [DevicesModule, ClientsModule, FormsModule],
})
export class CoreApiModule {}
