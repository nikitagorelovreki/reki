import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryPort, User } from '@reki/auth-domain';
import { USER_REPOSITORY } from '@reki/auth-persistence';

export interface JwtPayload {
  sub: string; // user ID
  username: string;
  roles: string[];
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(credentials: UserCredentials): Promise<User | null> {
    const { username, password } = credentials;
    
    const isValid = await this.userRepository.validateCredentials(username, password);
    if (!isValid) return null;

    const user = await this.userRepository.findByUsername(username);
    if (!user || !user.isActive) return null;

    // Обновляем время последнего входа
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return user;
  }

  async login(user: User): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return this.userRepository.findById(payload.sub);
    } catch {
      return null;
    }
  }

  async hasPermission(user: User, permission: string): Promise<boolean> {
    // Администратор имеет все права
    if (user.roles.includes('ADMIN')) {
      return true;
    }

    // Проверяем наличие конкретного разрешения в разрешениях пользователя
    return user.permissions.includes(permission);
  }

  async hasRole(user: User, role: string): Promise<boolean> {
    return user.roles.includes(role);
  }
}
