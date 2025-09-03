export declare enum FormStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ARCHIVED = "archived"
}
export declare enum FormType {
    ASSESSMENT = "assessment",
    QUESTIONNAIRE = "questionnaire",
    SURVEY = "survey",
    LFK = "lfk",
    FIM = "fim"
}
export declare class CreateFormDto {
    title: string;
    description?: string;
    type: FormType;
    status?: FormStatus;
    version?: number;
    schema: Record<string, any>;
}
export declare class UpdateFormDto extends CreateFormDto {
}
export declare class FormResponseDto {
    id: string;
    title: string;
    description?: string;
    type: FormType;
    status: FormStatus;
    version: number;
    schema: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
}
