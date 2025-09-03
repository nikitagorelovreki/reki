"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormEntriesSeedService = void 0;
const mock_form_entries_1 = require("./mock-form-entries");
class FormEntriesSeedService {
    constructor(formEntryService) {
        this.formEntryService = formEntryService;
    }
    async seedFormEntries() {
        console.log('🌱 Seeding form entries...');
        for (const mockEntry of mock_form_entries_1.mockFormEntries) {
            try {
                const existingEntries = await this.formEntryService.getAllFormEntries({
                    page: 1,
                    limit: 100
                });
                const exists = existingEntries.data.some(entry => entry.formId === mockEntry.formId &&
                    entry.patientId === mockEntry.patientId);
                if (!exists) {
                    await this.formEntryService.createFormEntry({
                        formId: mockEntry.formId,
                        patientId: mockEntry.patientId,
                        status: mockEntry.status,
                        data: mockEntry.data,
                        score: mockEntry.score,
                    });
                    console.log(`✅ Created form entry for patient ${mockEntry.patientId}`);
                }
                else {
                    console.log(`⏭️ Form entry for patient ${mockEntry.patientId} already exists`);
                }
            }
            catch (error) {
                console.error(`❌ Error creating form entry for patient ${mockEntry.patientId}:`, error);
            }
        }
        console.log('🎉 Form entries seeding completed!');
    }
    async clearFormEntries() {
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
        }
        catch (error) {
            console.error('❌ Error clearing form entries:', error);
        }
    }
}
exports.FormEntriesSeedService = FormEntriesSeedService;
