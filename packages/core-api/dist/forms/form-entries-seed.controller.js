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
exports.FormEntriesSeedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const form_entries_seed_service_1 = require("./seed/form-entries-seed.service");
let FormEntriesSeedController = class FormEntriesSeedController {
    constructor(formEntriesSeedService) {
        this.formEntriesSeedService = formEntriesSeedService;
    }
    async seedFormEntries() {
        await this.formEntriesSeedService.seedFormEntries();
        return { message: 'Form entries seeded successfully' };
    }
    async clearFormEntries() {
        await this.formEntriesSeedService.clearFormEntries();
        return { message: 'Form entries cleared successfully' };
    }
};
exports.FormEntriesSeedController = FormEntriesSeedController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({ summary: 'Seed form entries with mock data' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Form entries seeded successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormEntriesSeedController.prototype, "seedFormEntries", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all form entries' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Form entries cleared successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormEntriesSeedController.prototype, "clearFormEntries", null);
exports.FormEntriesSeedController = FormEntriesSeedController = __decorate([
    (0, common_1.Controller)('form-entries'),
    (0, swagger_1.ApiTags)('form-entries'),
    __metadata("design:paramtypes", [form_entries_seed_service_1.FormEntriesSeedService])
], FormEntriesSeedController);
