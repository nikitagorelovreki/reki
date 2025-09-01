import { Module } from '@nestjs/common';
import { UseCasesModule } from '@reki/use-cases';
import { DevicesModule } from './devices/devices.module';
// import { ClientsModule } from './clients/clients.module';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [
    UseCasesModule,
    DevicesModule,
    // ClientsModule,
    FormsModule,
  ],
  exports: [
    DevicesModule,
    // ClientsModule,
    FormsModule,
  ],
})
export class ApiModule {}
