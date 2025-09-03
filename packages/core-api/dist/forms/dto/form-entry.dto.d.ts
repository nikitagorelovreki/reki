export declare enum FormEntryStatus {
    DRAFT = "draft",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    REVIEWED = "reviewed",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed"
}
export declare class CreateFormEntryDto {
    formId: string;
    patientId?: string;
    deviceId?: string;
    clinicId?: string;
    status?: FormEntryStatus;
    data?: Record<string, unknown>;
    score?: number;
}
export declare class UpdateFormEntryDto {
    status?: FormEntryStatus;
    data?: Record<string, unknown>;
    score?: number;
}
export declare class SaveFormDataDto {
    data: Record<string, unknown>;
}
export declare class FormEntryResponseDto {
    id: string;
    formId: string;
    patientId?: string;
    deviceId?: string;
    clinicId?: string;
    status: FormEntryStatus;
    data: Record<string, unknown>;
    score?: number;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
}
