import { AuthService } from '@reki/auth-service';
import { UserCredentials, AuthResultDto, ValidateTokenDto, TokenValidationResponseDto, UserResponseDto } from '../dto/auth';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: UserCredentials): Promise<AuthResultDto>;
    getProfile(req: any): Promise<UserResponseDto>;
    validateToken(tokenDto: ValidateTokenDto): Promise<TokenValidationResponseDto>;
}
