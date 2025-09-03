import { Module } from '@nestjs/common';
import { CoreServiceModule } from '@reki/core-service';
import { DevicesModule } from './devices/devices.module';
import { ClientsModule } from './clients/clients.module';
import { FormsModule } from './forms/forms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreServiceModule, DevicesModule, ClientsModule, FormsModule, AuthModule],
  exports: [DevicesModule, ClientsModule, FormsModule, AuthModule],
})
export class ApiModule {}
