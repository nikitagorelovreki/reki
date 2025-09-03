"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("@reki/auth-service");
const auth_1 = require("../dto/auth");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto);
        if (!user) {
            throw new common_1.UnauthorizedException('Неверные учетные данные');
        }
        const result = await this.authService.login(user);
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
    async getProfile(req) {
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
    async validateToken(tokenDto) {
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
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Вход в систему' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Успешный вход', type: auth_1.AuthResultDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Неверные учетные данные' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.UserCredentials]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить профиль текущего пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Профиль пользователя', type: auth_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Проверить токен доступа' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Результат проверки токена', type: auth_1.TokenValidationResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.ValidateTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
