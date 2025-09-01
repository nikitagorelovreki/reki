import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { UseCasesModule } from '@reki/use-cases';

@Module({
  imports: [UseCasesModule],
  controllers: [DevicesController],
})
export class DevicesModule {}
