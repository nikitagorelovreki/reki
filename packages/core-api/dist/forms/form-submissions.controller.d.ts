import { FormEntryService } from '@reki/core-service';
import { CreateFormSubmissionDto, ImportFlowerFormDto, UpdateFormSubmissionDto } from './dto/form-submission.dto';
interface FormEntryModel {
    id: string;
    formId: string;
    patientId?: string;
    data: Record<string, any>;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    status?: string;
    score?: number;
    completedAt?: Date;
}
export declare class FormSubmissionsController {
    private readonly submissionService;
    constructor(submissionService: FormEntryService);
    create(createSubmissionDto: CreateFormSubmissionDto): Promise<FormEntryModel>;
    importFlowerForm(_importDto: ImportFlowerFormDto): Promise<unknown>;
    findAll(page?: number, limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findByClient(clientId: string, page?: number, limit?: number): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findByForm(formId: string, page?: number, limit?: number): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findByClientAndForm(clientId: string, _formId: string, page?: number, limit?: number): Promise<import("@reki/core-domain").PaginatedResult<import("@reki/core-domain").FormEntryModel>>;
    findLatestByClientAndForm(clientId: string, formId: string): Promise<FormEntryModel | null>;
    findOne(id: string): Promise<FormEntryModel>;
    update(id: string, updateSubmissionDto: UpdateFormSubmissionDto): Promise<FormEntryModel>;
    remove(id: string): Promise<void>;
}
export {};
