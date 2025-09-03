import { UserService } from '@reki/auth-service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(page?: number, limit?: number): Promise<import("@reki/auth-domain").User[]>;
    findOne(id: string): Promise<import("@reki/auth-domain").User | null>;
    create(createUserDto: {
        username: string;
        password: string;
        email: string;
        roles?: string[];
    }): Promise<import("@reki/auth-domain").User>;
    update(id: string, updateUserDto: {
        username?: string;
        email?: string;
        roles?: string[];
        isActive?: boolean;
    }): Promise<import("@reki/auth-domain").User>;
    remove(id: string): Promise<void>;
}
