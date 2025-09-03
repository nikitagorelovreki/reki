import { FormService } from '@reki/core-service';
import { CreateFormDto, FormResponseDto, UpdateFormDto } from './dto/form.dto';
export declare class FormsController {
    private readonly formService;
    constructor(formService: FormService);
    create(createFormDto: CreateFormDto): Promise<FormResponseDto>;
    findAll(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc'): Promise<{
        data: import("@reki/core-service").ServiceForm[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<FormResponseDto>;
    update(id: string, updateFormDto: UpdateFormDto): Promise<FormResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
