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
import { ClientService } from '@reki/use-cases';
import { ClientStatus } from '@reki/domain';
import {
  ClientResponseDto,
  CreateClientDto,
  UpdateClientDto,
} from './dto/client.dto';
import { convertDtoTypes } from '../common/dto-converter';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createClientDto: CreateClientDto
  ): Promise<ClientResponseDto> {
    const convertedDto = convertDtoTypes(createClientDto);
    const client = await this.clientService.createClient(
      convertedDto as Parameters<typeof this.clientService.createClient>[0]
    );
    return client as unknown as ClientResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort field',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ClientResponseDto' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('desc')) sortOrder: 'asc' | 'desc'
  ): Promise<{
    data: ClientResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return this.clientService.getAllClients({ page, limit, sortBy, sortOrder });
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Get clients by clinic' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  async findByClinic(
    @Param('clinicId') clinicId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<{
    data: ClientResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return this.clientService.getClientsByClinic(clinicId, { page, limit });
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get clients by status' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  async findByStatus(
    @Param('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<{
    data: ClientResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return this.clientService.getClientsByStatus(status as ClientStatus, {
      page,
      limit,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search clients by query' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
    example: 'John',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'Clients found successfully' })
  async search(
    @Query('q') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<{
    data: ClientResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return this.clientService.searchClients(query, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Client retrieved successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    const client = await this.clientService.getClientById(id);
    return client as unknown as ClientResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<ClientResponseDto> {
    const convertedDto = convertDtoTypes(updateClientDto);
    const client = await this.clientService.updateClient(
      id,
      convertedDto as Parameters<typeof this.clientService.updateClient>[1]
    );
    return client as unknown as ClientResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.clientService.deleteClient(id);
    return { message: 'Client deleted successfully' };
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update client status' })
  @ApiResponse({
    status: 200,
    description: 'Client status updated successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async updateStatus(
    @Param('id') clientId: string,
    @Param('status') status: string
  ): Promise<ClientResponseDto> {
    const client = await this.clientService.updateClientStatus(
      clientId,
      status as ClientStatus
    );
    return client as unknown as ClientResponseDto;
  }
}
