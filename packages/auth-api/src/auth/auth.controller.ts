import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '@reki/auth-service';
import { 
  UserCredentials, 
  AuthResultDto, 
  ValidateTokenDto, 
  TokenValidationResponseDto,
  UserResponseDto 
} from '../dto/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'Успешный вход', type: AuthResultDto })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: UserCredentials): Promise<AuthResultDto> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    const result = await this.authService.login(user);
    
    // Transform domain model to DTO
    return {
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        isActive: result.user.isActive,
        roles: result.user.roles,
        permissions: result.user.permissions,
        createdAt: result.user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: result.user.updatedAt?.toISOString() || new Date().toISOString(),
        lastLoginAt: result.user.lastLoginAt?.toISOString(),
      },
      accessToken: result.accessToken,
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getProfile(@Request() req: any): Promise<UserResponseDto> {
    // For now, return a mock admin user - in real implementation this would use JWT guard
    return {
      id: '1',
      username: 'reki_admin',
      email: 'admin@reki.com',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      roles: ['ADMIN'],
      permissions: ['READ_ALL', 'WRITE_ALL'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Проверить токен доступа' })
  @ApiResponse({ status: 200, description: 'Результат проверки токена', type: TokenValidationResponseDto })
  async validateToken(@Body() tokenDto: ValidateTokenDto): Promise<TokenValidationResponseDto> {
    const user = await this.authService.validateToken(tokenDto.token);
    
    if (!user) {
      return { valid: false, user: undefined };
    }
    
    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        roles: user.roles,
        permissions: user.permissions,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString(),
      },
    };
  }
}
