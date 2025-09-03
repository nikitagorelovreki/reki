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
exports.FormResponseDto = exports.UpdateFormDto = exports.CreateFormDto = exports.FormType = exports.FormStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var FormStatus;
(function (FormStatus) {
    FormStatus["DRAFT"] = "draft";
    FormStatus["ACTIVE"] = "active";
    FormStatus["ARCHIVED"] = "archived";
})(FormStatus || (exports.FormStatus = FormStatus = {}));
var FormType;
(function (FormType) {
    FormType["ASSESSMENT"] = "assessment";
    FormType["QUESTIONNAIRE"] = "questionnaire";
    FormType["SURVEY"] = "survey";
    FormType["LFK"] = "lfk";
    FormType["FIM"] = "fim";
})(FormType || (exports.FormType = FormType = {}));
class CreateFormDto {
}
exports.CreateFormDto = CreateFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название формы',
        example: 'Оценка состояния пациента',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание формы',
        example: 'Форма для оценки состояния пациента перед началом терапии',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип формы',
        enum: FormType,
        example: FormType.ASSESSMENT,
    }),
    (0, class_validator_1.IsEnum)(FormType),
    __metadata("design:type", String)
], CreateFormDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Статус формы',
        enum: FormStatus,
        default: FormStatus.DRAFT,
        example: FormStatus.DRAFT,
    }),
    (0, class_validator_1.IsEnum)(FormStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Версия формы',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFormDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JSON-схема формы',
        example: {
            fields: [
                { type: 'text', name: 'name', label: 'ФИО пациента', required: true },
                { type: 'select', name: 'painLevel', label: 'Уровень боли', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            ],
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFormDto.prototype, "schema", void 0);
class UpdateFormDto extends CreateFormDto {
}
exports.UpdateFormDto = UpdateFormDto;
class FormResponseDto {
}
exports.FormResponseDto = FormResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор формы',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название формы',
        example: 'Оценка состояния пациента',
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание формы',
        example: 'Форма для оценки состояния пациента перед началом терапии',
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип формы',
        enum: FormType,
        example: FormType.ASSESSMENT,
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус формы',
        enum: FormStatus,
        example: FormStatus.DRAFT,
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Версия формы',
        example: 1,
    }),
    __metadata("design:type", Number)
], FormResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JSON-схема формы',
        example: {
            fields: [
                { type: 'text', name: 'name', label: 'ФИО пациента', required: true },
                { type: 'select', name: 'painLevel', label: 'Уровень боли', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            ],
        },
    }),
    __metadata("design:type", Object)
], FormResponseDto.prototype, "schema", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], FormResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2023-01-01T12:30:00Z',
    }),
    __metadata("design:type", Date)
], FormResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID пользователя, создавшего форму',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID пользователя, обновившего форму',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormResponseDto.prototype, "updatedBy", void 0);
