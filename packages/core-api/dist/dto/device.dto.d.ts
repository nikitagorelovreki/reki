export declare enum DeviceStatus {
    REGISTERED = "REGISTERED",
    IN_STOCK = "IN_STOCK",
    AT_CLINIC = "AT_CLINIC",
    AT_PATIENT_HOME = "AT_PATIENT_HOME",
    UNDER_SERVICE = "UNDER_SERVICE",
    RMA = "RMA",
    DECOMMISSIONED = "DECOMMISSIONED"
}
export declare class CreateDeviceDto {
    serial: string;
    qrCode?: string;
    externalIds?: Record<string, string>;
    model: string;
    hardwareRevision?: string;
    firmwareVersion?: string;
    status?: DeviceStatus;
    currentLocation?: string;
    clinicId?: string;
    ownerId?: string;
    assignedPatientId?: string;
    responsibleUserId?: string;
    warrantyUntil?: string;
    purchaseOrder?: string;
    telemetryEndpoint?: string;
    maintenanceNotes?: Record<string, any>;
}
export declare class UpdateDeviceDto {
    qrCode?: string;
    externalIds?: Record<string, string>;
    model?: string;
    hardwareRevision?: string;
    firmwareVersion?: string;
    status?: DeviceStatus;
    currentLocation?: string;
    clinicId?: string;
    ownerId?: string;
    assignedPatientId?: string;
    responsibleUserId?: string;
    warrantyUntil?: string;
    purchaseOrder?: string;
    telemetryEndpoint?: string;
    maintenanceNotes?: Record<string, any>;
}
export declare class DeviceDto {
    id: string;
    serial: string;
    qrCode?: string;
    externalIds?: Record<string, string>;
    model: string;
    hardwareRevision?: string;
    firmwareVersion?: string;
    status: DeviceStatus;
    currentLocation?: string;
    clinicId?: string;
    ownerId?: string;
    assignedPatientId?: string;
    responsibleUserId?: string;
    warrantyUntil?: string;
    purchaseOrder?: string;
    lastSeenAt?: string;
    lastSyncAt?: string;
    telemetryEndpoint?: string;
    maintenanceNotes?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export declare class PaginatedDevicesResponseDto {
    devices: DeviceDto[];
    total: number;
    page: number;
    limit: number;
}
