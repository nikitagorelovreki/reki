export declare enum ClientStatus {
    INTAKE = "intake",
    DIAGNOSTICS = "diagnostics",
    ACTIVE_THERAPY = "active_therapy",
    FOLLOWUP = "followup",
    DISCHARGED = "discharged"
}
export declare const mockClients: {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dob: string;
    diagnosis: string;
    contacts: {
        phone: string;
        email: string;
        address: string;
    };
    status: ClientStatus;
    clinicId: null;
    createdAt: string;
    updatedAt: string;
}[];
