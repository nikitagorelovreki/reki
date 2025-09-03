import { FormEntryService } from '@reki/core-service';
import { mockFormEntries } from './mock-form-entries';

export class FormEntriesSeedService {
  constructor(private readonly formEntryService: FormEntryService) {}

  async seedFormEntries(): Promise<void> {
    console.log('🌱 Seeding form entries...');

    for (const mockEntry of mockFormEntries) {
      try {
        // Проверяем, существует ли уже такая запись
        const existingEntries = await this.formEntryService.getAllFormEntries({ 
          page: 1, 
          limit: 100 
        });
        
        const exists = existingEntries.data.some(entry => 
          entry.formId === mockEntry.formId && 
          entry.patientId === mockEntry.patientId
        );

        if (!exists) {
          await this.formEntryService.createFormEntry({
            formId: mockEntry.formId,
            patientId: mockEntry.patientId,
            status: mockEntry.status,
            data: mockEntry.data,
            score: mockEntry.score,
          });
          console.log(`✅ Created form entry for patient ${mockEntry.patientId}`);
        } else {
          console.log(`⏭️ Form entry for patient ${mockEntry.patientId} already exists`);
        }
      } catch (error) {
        console.error(`❌ Error creating form entry for patient ${mockEntry.patientId}:`, error);
      }
    }

    console.log('🎉 Form entries seeding completed!');
  }

  async clearFormEntries(): Promise<void> {
    console.log('🗑️ Clearing form entries...');
    
    try {
      const entries = await this.formEntryService.getAllFormEntries({ 
        page: 1, 
        limit: 1000 
      });
      
      for (const entry of entries.data) {
        await this.formEntryService.deleteFormEntry(entry.id);
      }
      
      console.log('✅ Form entries cleared!');
    } catch (error) {
      console.error('❌ Error clearing form entries:', error);
    }
  }
}
