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
exports.PermissionResponseDto = exports.UpdatePermissionDto = exports.CreatePermissionDto = exports.PermissionAction = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "create";
    PermissionAction["READ"] = "read";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["MANAGE"] = "manage";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
class CreatePermissionDto {
}
exports.CreatePermissionDto = CreatePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название разрешения' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание разрешения', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Действие разрешения', enum: PermissionAction }),
    (0, class_validator_1.IsEnum)(PermissionAction),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ресурс разрешения' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "resource", void 0);
class UpdatePermissionDto {
}
exports.UpdatePermissionDto = UpdatePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название разрешения', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePermissionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание разрешения', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePermissionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Действие разрешения', enum: PermissionAction, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PermissionAction),
    __metadata("design:type", String)
], UpdatePermissionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ресурс разрешения', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePermissionDto.prototype, "resource", void 0);
class PermissionResponseDto {
}
exports.PermissionResponseDto = PermissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID разрешения' }),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название разрешения' }),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание разрешения', required: false }),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Действие разрешения', enum: PermissionAction }),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ресурс разрешения' }),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "resource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", Date)
], PermissionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата обновления' }),
    __metadata("design:type", Date)
], PermissionResponseDto.prototype, "updatedAt", void 0);
