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
exports.ImportFlowerFormDto = exports.FormSubmissionResponseDto = exports.UpdateFormSubmissionDto = exports.CreateFormSubmissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateFormSubmissionDto {
}
exports.CreateFormSubmissionDto = CreateFormSubmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFormSubmissionDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client ID', example: '123e4567-e89b-12d3-a456-426614174001' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFormSubmissionDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist ID', example: '123e4567-e89b-12d3-a456-426614174002' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormSubmissionDto.prototype, "therapistId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist name', example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormSubmissionDto.prototype, "therapistName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Submission date', example: '2023-01-01T12:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormSubmissionDto.prototype, "submissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Form data',
        example: {
            head_hold: ['Удерживает', 'С наклоном вправо'],
            rollover: ['Со спины на живот', 'Вправо'],
            notes: 'Patient shows improvement in head control'
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateFormSubmissionDto.prototype, "data", void 0);
class UpdateFormSubmissionDto {
}
exports.UpdateFormSubmissionDto = UpdateFormSubmissionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist ID', example: '123e4567-e89b-12d3-a456-426614174002' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFormSubmissionDto.prototype, "therapistId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist name', example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFormSubmissionDto.prototype, "therapistName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Submission date', example: '2023-01-01T12:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFormSubmissionDto.prototype, "submissionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Form data',
        example: {
            head_hold: ['Удерживает', 'С наклоном вправо'],
            rollover: ['Со спины на живот', 'Вправо'],
            notes: 'Patient shows significant improvement in head control'
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFormSubmissionDto.prototype, "data", void 0);
class FormSubmissionResponseDto {
}
exports.FormSubmissionResponseDto = FormSubmissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Submission ID', example: '123e4567-e89b-12d3-a456-426614174003' }),
    __metadata("design:type", String)
], FormSubmissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], FormSubmissionResponseDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client ID', example: '123e4567-e89b-12d3-a456-426614174001' }),
    __metadata("design:type", String)
], FormSubmissionResponseDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist ID', example: '123e4567-e89b-12d3-a456-426614174002' }),
    __metadata("design:type", String)
], FormSubmissionResponseDto.prototype, "therapistId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist name', example: 'John Doe' }),
    __metadata("design:type", String)
], FormSubmissionResponseDto.prototype, "therapistName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Submission date', example: '2023-01-01T12:00:00.000Z' }),
    __metadata("design:type", Date)
], FormSubmissionResponseDto.prototype, "submissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Form data',
        example: {
            head_hold: ['Удерживает', 'С наклоном вправо'],
            rollover: ['Со спины на живот', 'Вправо'],
            notes: 'Patient shows improvement in head control'
        }
    }),
    __metadata("design:type", Object)
], FormSubmissionResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date', example: '2023-01-01T12:00:00.000Z' }),
    __metadata("design:type", Date)
], FormSubmissionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date', example: '2023-01-01T12:00:00.000Z' }),
    __metadata("design:type", Date)
], FormSubmissionResponseDto.prototype, "updatedAt", void 0);
class ImportFlowerFormDto {
}
exports.ImportFlowerFormDto = ImportFlowerFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client ID', example: '123e4567-e89b-12d3-a456-426614174001' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportFlowerFormDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportFlowerFormDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapist name', example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportFlowerFormDto.prototype, "therapistName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Form data from Flower Form',
        example: {
            type: 'lfk',
            head_hold: ['Удерживает', 'С наклоном вправо'],
            rollover: ['Со спины на живот', 'Вправо'],
            therapist_name: 'John Doe',
            exam_date: '2023-01-01'
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ImportFlowerFormDto.prototype, "formData", void 0);
