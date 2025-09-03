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
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_service_1 = require("@reki/core-service");
const form_dto_1 = require("./dto/form.dto");
const dto_converter_1 = require("../common/dto-converter");
let FormsController = class FormsController {
    constructor(formService) {
        this.formService = formService;
    }
    async create(createFormDto) {
        const convertedDto = (0, dto_converter_1.convertDtoTypes)(createFormDto);
        const form = await this.formService.create(convertedDto);
        return form;
    }
    async findAll(page, limit, sortBy, sortOrder) {
        const forms = await this.formService.findAll(page, limit);
        return {
            data: forms,
            pagination: { page, limit, total: forms.length, totalPages: Math.ceil(forms.length / limit) }
        };
    }
    async findOne(id) {
        const form = await this.formService.findById(id);
        if (!form) {
            throw new common_1.NotFoundException(`Форма с ID ${id} не найдена`);
        }
        return form;
    }
    async update(id, updateFormDto) {
        const convertedDto = (0, dto_converter_1.convertDtoTypes)(updateFormDto);
        const form = await this.formService.update(id, convertedDto);
        if (!form) {
            throw new common_1.NotFoundException(`Форма с ID ${id} не найдена`);
        }
        return form;
    }
    async remove(id) {
        await this.formService.delete(id);
        return { message: 'Форма успешно удалена' };
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новую форму' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Форма успешно создана', type: form_dto_1.FormResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверный запрос' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_dto_1.CreateFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все формы с пагинацией' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Поле для сортировки', example: 'createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Порядок сортировки', example: 'desc' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Формы успешно получены',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/FormResponseDto' } },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('sortBy', new common_1.DefaultValuePipe('createdAt'))),
    __param(3, (0, common_1.Query)('sortOrder', new common_1.DefaultValuePipe('desc'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить форму по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Форма успешно получена', type: form_dto_1.FormResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Форма не найдена' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить форму' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Форма успешно обновлена', type: form_dto_1.FormResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Форма не найдена' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_dto_1.UpdateFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить форму' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Форма успешно удалена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Форма не найдена' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "remove", null);
exports.FormsController = FormsController = __decorate([
    (0, swagger_1.ApiTags)('forms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('forms'),
    __metadata("design:paramtypes", [core_service_1.FormService])
], FormsController);
