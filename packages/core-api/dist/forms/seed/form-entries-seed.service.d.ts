import { FormEntryService } from '@reki/core-service';
export declare class FormEntriesSeedService {
    private readonly formEntryService;
    constructor(formEntryService: FormEntryService);
    seedFormEntries(): Promise<void>;
    clearFormEntries(): Promise<void>;
}
