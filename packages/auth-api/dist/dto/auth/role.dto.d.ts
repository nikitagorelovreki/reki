export declare class CreateRoleDto {
    name: string;
    description?: string;
    permissions?: string[];
}
export declare class UpdateRoleDto {
    name?: string;
    description?: string;
    permissions?: string[];
}
export declare class RoleResponseDto {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
