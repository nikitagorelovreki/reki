import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormEntriesController } from './form-entries.controller';
import { FormEntriesSeedController } from './form-entries-seed.controller';
import { FormEntriesSeedService } from './seed/form-entries-seed.service';
import { UseCasesModule } from '@reki/use-cases';

@Module({
  imports: [UseCasesModule],
  controllers: [FormsController, FormEntriesController, FormEntriesSeedController],
  providers: [FormEntriesSeedService],
})
export class FormsModule {}
