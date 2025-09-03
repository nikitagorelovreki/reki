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
exports.FormSubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_service_1 = require("@reki/core-service");
const form_submission_dto_1 = require("./dto/form-submission.dto");
let FormSubmissionsController = class FormSubmissionsController {
    constructor(submissionService) {
        this.submissionService = submissionService;
    }
    async create(createSubmissionDto) {
        const result = await this.submissionService.createFormEntry({
            formId: createSubmissionDto.formId,
            patientId: createSubmissionDto.clientId,
            data: createSubmissionDto.data || {},
            createdBy: createSubmissionDto.therapistName
        });
        return result;
    }
    async importFlowerForm(_importDto) {
        return { message: 'Method under development' };
    }
    async findAll(page, limit, sortBy, sortOrder) {
        const options = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            sortBy,
            sortOrder,
        };
        return this.submissionService.getAllFormEntries(options);
    }
    async findByClient(clientId, page, limit) {
        const options = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        };
        return this.submissionService.getFormEntriesByPatientId(clientId, options);
    }
    async findByForm(formId, page, limit) {
        const options = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        };
        return this.submissionService.getFormEntriesByFormId(formId, options);
    }
    async findByClientAndForm(clientId, _formId, page, limit) {
        const options = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        };
        return this.submissionService.getFormEntriesByPatientId(clientId, options);
    }
    async findLatestByClientAndForm(clientId, formId) {
        const entries = await this.submissionService.getFormEntriesByPatientId(clientId, { limit: 1, sortOrder: 'desc' });
        return entries.data[0] || null;
    }
    async findOne(id) {
        const result = await this.submissionService.getFormEntryById(id);
        return result;
    }
    async update(id, updateSubmissionDto) {
        const updateData = {
            ...updateSubmissionDto
        };
        const result = await this.submissionService.updateFormEntry(id, updateData);
        return result;
    }
    async remove(id) {
        await this.submissionService.deleteFormEntry(id);
    }
};
exports.FormSubmissionsController = FormSubmissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new form submission' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The form submission has been successfully created.', type: form_submission_dto_1.FormSubmissionResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_submission_dto_1.CreateFormSubmissionDto]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import form data from Flower Form' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The form data has been successfully imported.', type: form_submission_dto_1.FormSubmissionResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_submission_dto_1.ImportFlowerFormDto]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "importFlowerForm", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all form submissions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all form submissions', type: [form_submission_dto_1.FormSubmissionResponseDto] }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get form submissions by client' }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return form submissions by client', type: [form_submission_dto_1.FormSubmissionResponseDto] }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "findByClient", null);
__decorate([
    (0, common_1.Get)('form/:formId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get form submissions by form' }),
    (0, swagger_1.ApiParam)({ name: 'formId', description: 'Form ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return form submissions by form', type: [form_submission_dto_1.FormSubmissionResponseDto] }),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "findByForm", null);
__decorate([
    (0, common_1.Get)('client/:clientId/form/:formId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get form submissions by client and form' }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client ID' }),
    (0, swagger_1.ApiParam)({ name: 'formId', description: 'Form ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return form submissions by client and form', type: [form_submission_dto_1.FormSubmissionResponseDto] }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('_formId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "findByClientAndForm", null);
__decorate([
    (0, common_1.Get)('client/:clientId/form/:formId/latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest form submission by client and form' }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client ID' }),
    (0, swagger_1.ApiParam)({ name: 'formId', description: 'Form ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return latest form submission by client and form', type: form_submission_dto_1.FormSubmissionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form submission not found' }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "findLatestByClientAndForm", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a form submission by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Form Submission ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the form submission', type: form_submission_dto_1.FormSubmissionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form submission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a form submission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Form Submission ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The form submission has been successfully updated.', type: form_submission_dto_1.FormSubmissionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form submission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_submission_dto_1.UpdateFormSubmissionDto]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a form submission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Form Submission ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'The form submission has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form submission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormSubmissionsController.prototype, "remove", null);
exports.FormSubmissionsController = FormSubmissionsController = __decorate([
    (0, swagger_1.ApiTags)('form-submissions'),
    (0, common_1.Controller)('form-submissions'),
    __metadata("design:paramtypes", [core_service_1.FormEntryService])
], FormSubmissionsController);
