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
exports.FormEntryResponseDto = exports.SaveFormDataDto = exports.UpdateFormEntryDto = exports.CreateFormEntryDto = exports.FormEntryStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var FormEntryStatus;
(function (FormEntryStatus) {
    FormEntryStatus["DRAFT"] = "draft";
    FormEntryStatus["IN_PROGRESS"] = "in_progress";
    FormEntryStatus["SUBMITTED"] = "submitted";
    FormEntryStatus["REVIEWED"] = "reviewed";
    FormEntryStatus["APPROVED"] = "approved";
    FormEntryStatus["REJECTED"] = "rejected";
    FormEntryStatus["COMPLETED"] = "completed";
})(FormEntryStatus || (exports.FormEntryStatus = FormEntryStatus = {}));
class CreateFormEntryDto {
}
exports.CreateFormEntryDto = CreateFormEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID формы',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFormEntryDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID пациента',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormEntryDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID устройства',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormEntryDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID клиники',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormEntryDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Статус заполнения формы',
        enum: FormEntryStatus,
        default: FormEntryStatus.IN_PROGRESS,
        example: FormEntryStatus.IN_PROGRESS,
    }),
    (0, class_validator_1.IsEnum)(FormEntryStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormEntryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Данные заполнения формы',
        example: {
            name: 'Иванов Иван Иванович',
            painLevel: 3,
            symptoms: ['головная боль', 'тошнота'],
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateFormEntryDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Оценка/баллы',
        example: 85,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFormEntryDto.prototype, "score", void 0);
class UpdateFormEntryDto {
}
exports.UpdateFormEntryDto = UpdateFormEntryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Статус заполнения формы',
        enum: FormEntryStatus,
        example: FormEntryStatus.COMPLETED,
    }),
    (0, class_validator_1.IsEnum)(FormEntryStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFormEntryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Данные заполнения формы',
        example: {
            name: 'Иванов Иван Иванович',
            painLevel: 5,
            symptoms: ['головная боль', 'тошнота', 'головокружение'],
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFormEntryDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Оценка/баллы',
        example: 75,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateFormEntryDto.prototype, "score", void 0);
class SaveFormDataDto {
}
exports.SaveFormDataDto = SaveFormDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные заполнения формы',
        example: {
            name: 'Иванов Иван Иванович',
            painLevel: 5,
            symptoms: ['головная боль', 'тошнота', 'головокружение'],
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SaveFormDataDto.prototype, "data", void 0);
class FormEntryResponseDto {
}
exports.FormEntryResponseDto = FormEntryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор заполнения формы',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID формы',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID пациента',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID устройства',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID клиники',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус заполнения формы',
        enum: FormEntryStatus,
        example: FormEntryStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные заполнения формы',
        example: {
            name: 'Иванов Иван Иванович',
            painLevel: 5,
            symptoms: ['головная боль', 'тошнота', 'головокружение'],
        },
    }),
    __metadata("design:type", Object)
], FormEntryResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Оценка/баллы',
        example: 75,
    }),
    __metadata("design:type", Number)
], FormEntryResponseDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Дата завершения',
        example: '2023-01-02T15:30:00Z',
    }),
    __metadata("design:type", Date)
], FormEntryResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], FormEntryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2023-01-02T15:30:00Z',
    }),
    __metadata("design:type", Date)
], FormEntryResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID пользователя, создавшего запись',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID пользователя, обновившего запись',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FormEntryResponseDto.prototype, "updatedBy", void 0);
