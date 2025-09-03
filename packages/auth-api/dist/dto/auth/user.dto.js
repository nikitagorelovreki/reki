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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidationResponseDto = exports.ValidateTokenDto = exports.AuthResultDto = exports.UserResponseDto = exports.UserCredentials = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя пользователя' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email пользователя' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Пароль пользователя' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Фамилия', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активен ли пользователь', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Роли пользователя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roles", void 0);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя пользователя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email пользователя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Пароль пользователя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Фамилия', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активен ли пользователь', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Роли пользователя', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "roles", void 0);
class UserCredentials {
}
exports.UserCredentials = UserCredentials;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя пользователя' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserCredentials.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Пароль пользователя' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserCredentials.prototype, "password", void 0);
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя', required: false }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Фамилия', required: false }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активен ли пользователь' }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Роли пользователя' }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Разрешения пользователя' }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата обновления' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата последнего входа', required: false }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastLoginAt", void 0);
class AuthResultDto {
}
exports.AuthResultDto = AuthResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Данные пользователя' }),
    __metadata("design:type", UserResponseDto)
], AuthResultDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Токен доступа' }),
    __metadata("design:type", String)
], AuthResultDto.prototype, "accessToken", void 0);
class ValidateTokenDto {
}
exports.ValidateTokenDto = ValidateTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Токен для проверки' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateTokenDto.prototype, "token", void 0);
class TokenValidationResponseDto {
}
exports.TokenValidationResponseDto = TokenValidationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Валиден ли токен' }),
    __metadata("design:type", Boolean)
], TokenValidationResponseDto.prototype, "valid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Данные пользователя', required: false }),
    __metadata("design:type", UserResponseDto)
], TokenValidationResponseDto.prototype, "user", void 0);
