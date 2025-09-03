import { FormEntriesSeedService } from './seed/form-entries-seed.service';
export declare class FormEntriesSeedController {
    private readonly formEntriesSeedService;
    constructor(formEntriesSeedService: FormEntriesSeedService);
    seedFormEntries(): Promise<{
        message: string;
    }>;
    clearFormEntries(): Promise<{
        message: string;
    }>;
}
