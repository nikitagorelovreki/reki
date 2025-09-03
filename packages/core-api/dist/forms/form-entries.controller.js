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
exports.FormEntriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_service_1 = require("@reki/core-service");
const core_domain_1 = require("@reki/core-domain");
const form_entry_dto_1 = require("./dto/form-entry.dto");
const dto_converter_1 = require("../common/dto-converter");
let FormEntriesController = class FormEntriesController {
    constructor(formEntryService) {
        this.formEntryService = formEntryService;
    }
    async create(createFormEntryDto) {
        const convertedDto = (0, dto_converter_1.convertDtoTypes)(createFormEntryDto);
        const formEntry = await this.formEntryService.createFormEntry(convertedDto);
        return formEntry;
    }
    async findAll(page, limit, sortBy, sortOrder) {
        return this.formEntryService.getAllFormEntries({ page, limit, sortBy, sortOrder });
    }
    async findByFormId(formId, page, limit) {
        return this.formEntryService.getFormEntriesByFormId(formId, { page, limit });
    }
    async findByPatientId(patientId, page, limit) {
        return this.formEntryService.getFormEntriesByPatientId(patientId, { page, limit });
    }
    async findByStatus(status, page, limit) {
        const allEntries = await this.formEntryService.getAllFormEntries({ page, limit });
        const filteredEntries = allEntries.data.filter(entry => entry.status === status);
        return {
            data: filteredEntries,
            pagination: { page, limit, total: filteredEntries.length, totalPages: Math.ceil(filteredEntries.length / limit) }
        };
    }
    async findOne(id) {
        const formEntry = await this.formEntryService.getFormEntryById(id);
        return formEntry;
    }
    async update(id, updateFormEntryDto) {
        const convertedDto = (0, dto_converter_1.convertDtoTypes)(updateFormEntryDto);
        const formEntry = await this.formEntryService.updateFormEntry(id, convertedDto);
        return formEntry;
    }
    async remove(id) {
        await this.formEntryService.deleteFormEntry(id);
        return { message: 'Заполнение формы успешно удалено' };
    }
    async complete(id, score) {
        const formEntry = await this.formEntryService.completeFormEntry(id, score);
        return formEntry;
    }
    async cancel(id) {
        const formEntry = await this.formEntryService.cancelFormEntry(id);
        return formEntry;
    }
    async saveData(id, saveFormDataDto) {
        const formEntry = await this.formEntryService.saveFormData(id, saveFormDataDto.data);
        return formEntry;
    }
};
exports.FormEntriesController = FormEntriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новое заполнение формы' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Заполнение формы успешно создано', type: form_entry_dto_1.FormEntryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверный запрос' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_entry_dto_1.CreateFormEntryDto]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все заполнения форм с пагинацией' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Поле для сортировки', example: 'createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Порядок сортировки', example: 'desc' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заполнения форм успешно получены',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
], FormEntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('form/:formId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить заполнения форм по ID формы' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заполнения форм успешно получены',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "findByFormId", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить заполнения форм по ID пациента' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заполнения форм успешно получены',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить заполнения форм по статусу' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заполнения форм успешно получены',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
    __param(0, (0, common_1.Param)('status')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить заполнение формы по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заполнение формы успешно получено', type: form_entry_dto_1.FormEntryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заполнение формы не найдено' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить заполнение формы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заполнение формы успешно обновлено', type: form_entry_dto_1.FormEntryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заполнение формы не найдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_entry_dto_1.UpdateFormEntryDto]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить заполнение формы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заполнение формы успешно удалено' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заполнение формы не найдено' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Завершить заполнение формы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заполнение формы успешно завершено', type: form_entry_dto_1.FormEntryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заполнение формы не найдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('score')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Отменить заполнение формы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заполнение формы успешно отменено', type: form_entry_dto_1.FormEntryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заполнение формы не найдено' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/data'),
    (0, swagger_1.ApiOperation)({ summary: 'Сохранить данные заполнения формы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Данные заполнения формы успешно сохранены', type: form_entry_dto_1.FormEntryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заполнение формы не найдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_entry_dto_1.SaveFormDataDto]),
    __metadata("design:returntype", Promise)
], FormEntriesController.prototype, "saveData", null);
exports.FormEntriesController = FormEntriesController = __decorate([
    (0, swagger_1.ApiTags)('form-entries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('form-entries'),
    __metadata("design:paramtypes", [core_service_1.FormEntryService])
], FormEntriesController);
