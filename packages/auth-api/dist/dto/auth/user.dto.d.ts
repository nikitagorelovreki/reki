export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roles?: string[];
}
export declare class UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roles?: string[];
}
export declare class UserCredentials {
    username: string;
    password: string;
}
export declare class UserResponseDto {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    roles: string[];
    permissions: string[];
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}
export declare class AuthResultDto {
    user: UserResponseDto;
    accessToken: string;
}
export declare class ValidateTokenDto {
    token: string;
}
export declare class TokenValidationResponseDto {
    valid: boolean;
    user?: UserResponseDto;
}
