export declare class CreateFormSubmissionDto {
    formId: string;
    clientId: string;
    therapistId?: string;
    therapistName?: string;
    submissionDate?: string;
    data: Record<string, any>;
}
export declare class UpdateFormSubmissionDto {
    therapistId?: string;
    therapistName?: string;
    submissionDate?: string;
    data?: Record<string, any>;
}
export declare class FormSubmissionResponseDto {
    id: string;
    formId: string;
    clientId: string;
    therapistId?: string;
    therapistName?: string;
    submissionDate: Date;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ImportFlowerFormDto {
    clientId: string;
    formId: string;
    therapistName?: string;
    formData: Record<string, any>;
}
