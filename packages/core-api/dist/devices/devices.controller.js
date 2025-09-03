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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_service_1 = require("@reki/core-service");
const devices_service_1 = require("./devices.service");
const device_dto_1 = require("../dto/device.dto");
let DevicesController = class DevicesController {
    constructor(deviceService, devicesService) {
        this.deviceService = deviceService;
        this.devicesService = devicesService;
    }
    async create(createDeviceDto) {
        return this.devicesService.create(createDeviceDto);
    }
    async findAll(page, limit, sortBy, sortOrder) {
        return this.devicesService.findAll({ page, limit, sortBy, sortOrder });
    }
    async findByClinic(clinicId, page, limit) {
        return this.devicesService.findByClinic(clinicId, { page, limit });
    }
    async findByStatus(status, page, limit) {
        return this.devicesService.findByStatus(status, { page, limit });
    }
    async findBySerial(serial) {
        return this.devicesService.findBySerial(serial);
    }
    async findOne(id) {
        const device = await this.devicesService.findById(id);
        if (!device) {
            throw new Error('Device not found');
        }
        return device;
    }
    async update(id, updateDeviceDto) {
        return this.devicesService.update(id, updateDeviceDto);
    }
    async remove(id) {
        return this.devicesService.delete(id);
    }
    async assignToPatient(deviceId, patientId) {
        throw new Error('Not implemented');
    }
    async unassignFromPatient(deviceId) {
        throw new Error('Not implemented');
    }
    async updateStatus(deviceId, status) {
        throw new Error('Not implemented');
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new device' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Device created successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [device_dto_1.CreateDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all devices with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Sort field', example: 'createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order', example: 'desc' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Devices retrieved successfully',
        type: device_dto_1.PaginatedDevicesResponseDto
    }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('sortBy', new common_1.DefaultValuePipe('createdAt'))),
    __param(3, (0, common_1.Query)('sortOrder', new common_1.DefaultValuePipe('desc'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('clinic/:clinicId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get devices by clinic' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devices retrieved successfully', type: device_dto_1.PaginatedDevicesResponseDto }),
    __param(0, (0, common_1.Param)('clinicId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findByClinic", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get devices by status' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devices retrieved successfully', type: device_dto_1.PaginatedDevicesResponseDto }),
    __param(0, (0, common_1.Param)('status')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('serial/:serial'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device by serial number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device retrieved successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('serial')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findBySerial", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device retrieved successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update device' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device updated successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, device_dto_1.UpdateDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete device' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/assign-patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign device to patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device assigned successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "assignToPatient", null);
__decorate([
    (0, common_1.Patch)(':id/unassign-patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Unassign device from patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device unassigned successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "unassignFromPatient", null);
__decorate([
    (0, common_1.Patch)(':id/status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update device status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device status updated successfully', type: device_dto_1.DeviceDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateStatus", null);
exports.DevicesController = DevicesController = __decorate([
    (0, swagger_1.ApiTags)('devices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [core_service_1.DeviceService,
        devices_service_1.DevicesService])
], DevicesController);
