import { FormStatus, FormType } from '../dto/form.dto';
interface Form {
    id: string;
    title: string;
    description?: string;
    type: FormType;
    status: FormStatus;
    version?: number;
    schema?: any;
    createdAt: Date;
    updatedAt: Date;
}
export declare const defaultForms: Form[];
export {};
