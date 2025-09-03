export declare enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    MANAGE = "manage"
}
export declare class CreatePermissionDto {
    name: string;
    description?: string;
    action: PermissionAction;
    resource: string;
}
export declare class UpdatePermissionDto {
    name?: string;
    description?: string;
    action?: PermissionAction;
    resource?: string;
}
export declare class PermissionResponseDto {
    id: string;
    name: string;
    description?: string;
    action: PermissionAction;
    resource: string;
    createdAt: Date;
    updatedAt: Date;
}
