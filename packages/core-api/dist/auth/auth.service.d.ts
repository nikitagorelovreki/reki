import { AuthService as CoreAuthService } from '@reki/core-service';
import { LoginDto, LoginResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly coreAuthService;
    constructor(coreAuthService: CoreAuthService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
}
