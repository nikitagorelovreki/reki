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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("@reki/auth-service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findAll(page = 1, limit = 10) {
        return this.userService.findAll(page, limit);
    }
    async findOne(id) {
        return this.userService.findById(id);
    }
    async create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async update(id, updateUserDto) {
        return this.userService.update(id, updateUserDto);
    }
    async remove(id) {
        return this.userService.delete(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список пользователей' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Номер страницы' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список пользователей' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить пользователя по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь найден' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Пользователь не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать нового пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Пользователь создан' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверные данные' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь обновлен' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Пользователь не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь удален' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Пользователь не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [auth_service_1.UserService])
], UserController);
