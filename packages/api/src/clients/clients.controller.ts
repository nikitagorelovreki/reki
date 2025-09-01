import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import {
  ClientResponseDto,
  CreateClientDto,
  PaginatedClientsResponseDto,
  UpdateClientDto,
} from './dto';

@Controller('clients')
@ApiTags('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client created successfully',
    type: ClientResponseDto,
  })
  async create(
    @Body() createClientDto: CreateClientDto
  ): Promise<ClientResponseDto> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients retrieved successfully',
    type: PaginatedClientsResponseDto,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedClientsResponseDto> {
    return this.clientsService.findAll({ page, limit, sortBy, sortOrder });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search clients' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients search results',
    type: PaginatedClientsResponseDto,
  })
  async search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<PaginatedClientsResponseDto> {
    return this.clientsService.search(query, { page, limit });
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Get clients by clinic' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients by clinic retrieved successfully',
    type: PaginatedClientsResponseDto,
  })
  async findByClinic(
    @Param('clinicId') clinicId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedClientsResponseDto> {
    return this.clientsService.findByClinic(clinicId, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get clients by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients by status retrieved successfully',
    type: PaginatedClientsResponseDto,
  })
  async findByStatus(
    @Param('status') status: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedClientsResponseDto> {
    return this.clientsService.findByStatus(status, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client retrieved successfully',
    type: ClientResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    return this.clientsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client updated successfully',
    type: ClientResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<ClientResponseDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update client status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client status updated successfully',
    type: ClientResponseDto,
  })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: string
  ): Promise<ClientResponseDto> {
    return this.clientsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.delete(id);
  }
}
