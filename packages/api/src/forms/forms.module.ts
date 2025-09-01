import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormEntriesController } from './form-entries.controller';
import { UseCasesModule } from '@reki/use-cases';

@Module({
  imports: [UseCasesModule],
  controllers: [FormsController, FormEntriesController],
})
export class FormsModule {}
