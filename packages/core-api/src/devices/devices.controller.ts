import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeviceService } from '@reki/core-service';
import { DevicesService } from './devices.service';
import { DeviceStatus } from '../dto/device.dto';
import { CreateDeviceDto, DeviceDto, UpdateDeviceDto, PaginatedDevicesResponseDto } from '../dto/device.dto';
import { convertDtoTypes } from '../common/dto-converter';

@ApiTags('devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly devicesService: DevicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device' })
  @ApiResponse({ status: 201, description: 'Device created successfully', type: DeviceDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<DeviceDto> {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order', example: 'desc' })
  @ApiResponse({ 
    status: 200, 
    description: 'Devices retrieved successfully',
    type: PaginatedDevicesResponseDto
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('desc')) sortOrder: 'asc' | 'desc',
  ): Promise<PaginatedDevicesResponseDto> {
    return this.devicesService.findAll({ page, limit, sortBy, sortOrder });
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Get devices by clinic' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Devices retrieved successfully', type: PaginatedDevicesResponseDto })
  async findByClinic(
    @Param('clinicId') clinicId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedDevicesResponseDto> {
    return this.devicesService.findByClinic(clinicId, { page, limit });
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get devices by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Devices retrieved successfully', type: PaginatedDevicesResponseDto })
  async findByStatus(
    @Param('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedDevicesResponseDto> {
    return this.devicesService.findByStatus(status, { page, limit });
  }

  @Get('serial/:serial')
  @ApiOperation({ summary: 'Get device by serial number' })
  @ApiResponse({ status: 200, description: 'Device retrieved successfully', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async findBySerial(@Param('serial') serial: string): Promise<DeviceDto | null> {
    return this.devicesService.findBySerial(serial);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device by ID' })
  @ApiResponse({ status: 200, description: 'Device retrieved successfully', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async findOne(@Param('id') id: string): Promise<DeviceDto> {
    const device = await this.devicesService.findById(id);
    if (!device) {
      throw new Error('Device not found');
    }
    return device;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update device' })
  @ApiResponse({ status: 200, description: 'Device updated successfully', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto): Promise<DeviceDto | null> {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete device' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.devicesService.delete(id);
  }

  @Patch(':id/assign-patient/:patientId')
  @ApiOperation({ summary: 'Assign device to patient' })
  @ApiResponse({ status: 200, description: 'Device assigned successfully', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async assignToPatient(
    @Param('id') deviceId: string,
    @Param('patientId') patientId: string,
  ): Promise<DeviceDto> {
    // TODO: Implement patient assignment
    throw new Error('Not implemented');
  }

  @Patch(':id/unassign-patient')
  @ApiOperation({ summary: 'Unassign device from patient' })
  @ApiResponse({ status: 200, description: 'Device unassigned successfully', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async unassignFromPatient(@Param('id') deviceId: string): Promise<DeviceDto> {
    // TODO: Implement patient unassignment
    throw new Error('Not implemented');
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update device status' })
  @ApiResponse({ status: 200, description: 'Device status updated successfully', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async updateStatus(
    @Param('id') deviceId: string,
    @Param('status') status: string,
  ): Promise<DeviceDto> {
    // TODO: Implement status update
    throw new Error('Not implemented');
  }
}
