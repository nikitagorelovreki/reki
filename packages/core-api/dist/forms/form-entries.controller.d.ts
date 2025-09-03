import { FormEntryService } from '@reki/core-service';
import { FormEntryStatus } from '@reki/core-domain';
import { CreateFormEntryDto, FormEntryResponseDto, SaveFormDataDto, UpdateFormEntryDto } from './dto/form-entry.dto';
export declare class FormEntriesController {
    private readonly formEntryService;
    constructor(formEntryService: FormEntryService);
    create(createFormEntryDto: CreateFormEntryDto): Promise<FormEntryResponseDto>;
    findAll(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc'): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findByFormId(formId: string, page: number, limit: number): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findByPatientId(patientId: string, page: number, limit: number): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findByStatus(status: FormEntryStatus, page: number, limit: number): Promise<{
        data: import("@reki/core-domain").FormEntryModel[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<FormEntryResponseDto>;
    update(id: string, updateFormEntryDto: UpdateFormEntryDto): Promise<FormEntryResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    complete(id: string, score?: number): Promise<FormEntryResponseDto>;
    cancel(id: string): Promise<FormEntryResponseDto>;
    saveData(id: string, saveFormDataDto: SaveFormDataDto): Promise<FormEntryResponseDto>;
}
