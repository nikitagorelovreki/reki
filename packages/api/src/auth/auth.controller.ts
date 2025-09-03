import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '@reki/auth-service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getProfile(@Request() req: any) {
    // Здесь нужно будет добавить guard для извлечения пользователя из токена
    throw new Error('Not implemented');
  }

  @Post('validate')
  @ApiOperation({ summary: 'Проверить токен доступа' })
  @ApiResponse({ status: 200, description: 'Токен валиден' })
  @ApiResponse({ status: 401, description: 'Токен недействителен' })
  async validateToken(@Body() tokenDto: { token: string }) {
    const user = await this.authService.validateToken(tokenDto.token);
    return { valid: !!user, user };
  }
}
