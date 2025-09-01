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
import { DeviceService } from '@reki/use-cases';
import { DeviceStatus } from '@reki/domain';
import { CreateDeviceDto, DeviceResponseDto, UpdateDeviceDto } from './dto/device.dto';
import { convertDtoTypes } from '../common/dto-converter';

@ApiTags('devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device' })
  @ApiResponse({ status: 201, description: 'Device created successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<DeviceResponseDto> {
    const convertedDto = convertDtoTypes(createDeviceDto);
    const device = await this.deviceService.createDevice(convertedDto as any);
    return device as unknown as DeviceResponseDto;
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
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/DeviceResponseDto' } },
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
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('desc')) sortOrder: 'asc' | 'desc',
  ) {
    return this.deviceService.getAllDevices({ page, limit, sortBy, sortOrder });
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Get devices by clinic' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Devices retrieved successfully' })
  async findByClinic(
    @Param('clinicId') clinicId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.deviceService.getDevicesByClinic(clinicId, { page, limit });
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get devices by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Devices retrieved successfully' })
  async findByStatus(
    @Param('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.deviceService.getDevicesByStatus(status as DeviceStatus, { page, limit });
  }

  @Get('serial/:serial')
  @ApiOperation({ summary: 'Get device by serial number' })
  @ApiResponse({ status: 200, description: 'Device retrieved successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async findBySerial(@Param('serial') serial: string): Promise<DeviceResponseDto | null> {
    const device = await this.deviceService.getDeviceBySerial(serial);
    return device as unknown as DeviceResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device by ID' })
  @ApiResponse({ status: 200, description: 'Device retrieved successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async findOne(@Param('id') id: string): Promise<DeviceResponseDto> {
    const device = await this.deviceService.getDeviceById(id);
    return device as unknown as DeviceResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update device' })
  @ApiResponse({ status: 200, description: 'Device updated successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto): Promise<DeviceResponseDto> {
    const convertedDto = convertDtoTypes(updateDeviceDto);
    const device = await this.deviceService.updateDevice(id, convertedDto as any);
    return device as unknown as DeviceResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete device' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.deviceService.deleteDevice(id);
    return { message: 'Device deleted successfully' };
  }

  @Patch(':id/assign-patient/:patientId')
  @ApiOperation({ summary: 'Assign device to patient' })
  @ApiResponse({ status: 200, description: 'Device assigned successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async assignToPatient(
    @Param('id') deviceId: string,
    @Param('patientId') patientId: string,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceService.assignDeviceToPatient(deviceId, patientId);
    return device as unknown as DeviceResponseDto;
  }

  @Patch(':id/unassign-patient')
  @ApiOperation({ summary: 'Unassign device from patient' })
  @ApiResponse({ status: 200, description: 'Device unassigned successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async unassignFromPatient(@Param('id') deviceId: string): Promise<DeviceResponseDto> {
    const device = await this.deviceService.unassignDeviceFromPatient(deviceId);
    return device as unknown as DeviceResponseDto;
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update device status' })
  @ApiResponse({ status: 200, description: 'Device status updated successfully', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async updateStatus(
    @Param('id') deviceId: string,
    @Param('status') status: string,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceService.updateDeviceStatus(deviceId, status as DeviceStatus);
    return device as unknown as DeviceResponseDto;
  }
}
