import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormEntriesController } from './form-entries.controller';

@Module({
  controllers: [FormsController, FormEntriesController],
})
export class FormsModule {}