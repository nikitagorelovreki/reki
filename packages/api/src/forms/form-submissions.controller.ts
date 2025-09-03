import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormEntryService } from '@reki/core-service';
import { 
  CreateFormSubmissionDto, 
  FormSubmissionResponseDto, 
  ImportFlowerFormDto,
  UpdateFormSubmissionDto
} from './dto/form-submission.dto';

// Локальные интерфейсы для API слоя
interface FormEntryModel {
  id: string;
  formId: string;
  patientId?: string;
  data: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  score?: number;
  completedAt?: Date;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@ApiTags('form-submissions')
@Controller('form-submissions')
export class FormSubmissionsController {
  constructor(private readonly submissionService: FormEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form submission' })
  @ApiResponse({ status: 201, description: 'The form submission has been successfully created.', type: FormSubmissionResponseDto })
  async create(@Body() createSubmissionDto: CreateFormSubmissionDto): Promise<FormEntryModel> {
    const result = await this.submissionService.createFormEntry({
      formId: createSubmissionDto.formId,
      patientId: createSubmissionDto.clientId,
      data: createSubmissionDto.data || {},
      createdBy: createSubmissionDto.therapistName
    });
    return result;
  }

  @Post('import')
  @ApiOperation({ summary: 'Import form data from Flower Form' })
  @ApiResponse({ status: 201, description: 'The form data has been successfully imported.', type: FormSubmissionResponseDto })
  async importFlowerForm(@Body() _importDto: ImportFlowerFormDto): Promise<unknown> {
    // TODO: Fix this method - temporarily simplified
    return { message: 'Method under development' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all form submissions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Return all form submissions', type: [FormSubmissionResponseDto] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const options: PaginationOptions = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sortBy,
      sortOrder,
    };
    return this.submissionService.getAllFormEntries(options);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get form submissions by client' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return form submissions by client', type: [FormSubmissionResponseDto] })
  async findByClient(
    @Param('clientId') clientId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: PaginationOptions = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };
    return this.submissionService.getFormEntriesByPatientId(clientId, options);
  }

  @Get('form/:formId')
  @ApiOperation({ summary: 'Get form submissions by form' })
  @ApiParam({ name: 'formId', description: 'Form ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return form submissions by form', type: [FormSubmissionResponseDto] })
  async findByForm(
    @Param('formId') formId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: PaginationOptions = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };
    return this.submissionService.getFormEntriesByFormId(formId, options);
  }

  @Get('client/:clientId/form/:formId')
  @ApiOperation({ summary: 'Get form submissions by client and form' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiParam({ name: 'formId', description: 'Form ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return form submissions by client and form', type: [FormSubmissionResponseDto] })
  async findByClientAndForm(
    @Param('clientId') clientId: string,
    @Param('_formId') _formId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: PaginationOptions = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };
    // TODO: Implement combined query - for now get by patient
    return this.submissionService.getFormEntriesByPatientId(clientId, options);
  }

  @Get('client/:clientId/form/:formId/latest')
  @ApiOperation({ summary: 'Get latest form submission by client and form' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiParam({ name: 'formId', description: 'Form ID' })
  @ApiResponse({ status: 200, description: 'Return latest form submission by client and form', type: FormSubmissionResponseDto })
  @ApiResponse({ status: 404, description: 'Form submission not found' })
  async findLatestByClientAndForm(
    @Param('clientId') clientId: string,
    @Param('formId') formId: string,
  ): Promise<FormEntryModel | null> {
    // TODO: Implement latest query - for now get by patient
    const entries = await this.submissionService.getFormEntriesByPatientId(clientId, { limit: 1, sortOrder: 'desc' });
    return (entries.data[0] as FormEntryModel) || null;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form submission by id' })
  @ApiParam({ name: 'id', description: 'Form Submission ID' })
  @ApiResponse({ status: 200, description: 'Return the form submission', type: FormSubmissionResponseDto })
  @ApiResponse({ status: 404, description: 'Form submission not found' })
  async findOne(@Param('id') id: string): Promise<FormEntryModel> {
    const result = await this.submissionService.getFormEntryById(id);
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a form submission' })
  @ApiParam({ name: 'id', description: 'Form Submission ID' })
  @ApiResponse({ status: 200, description: 'The form submission has been successfully updated.', type: FormSubmissionResponseDto })
  @ApiResponse({ status: 404, description: 'Form submission not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateFormSubmissionDto,
  ): Promise<FormEntryModel> {
    const updateData: any = {
      ...updateSubmissionDto
    };
    
    const result = await this.submissionService.updateFormEntry(id, updateData);
    return result as FormEntryModel;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a form submission' })
  @ApiParam({ name: 'id', description: 'Form Submission ID' })
  @ApiResponse({ status: 204, description: 'The form submission has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Form submission not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.submissionService.deleteFormEntry(id);
  }
}
