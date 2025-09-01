import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FormEntryService } from '@cuis/use-cases';
import { 
  CreateFormSubmissionDto, 
  UpdateFormSubmissionDto, 
  FormSubmissionResponseDto,
  ImportFlowerFormDto
} from './dto/form-submission.dto';
import { FormSubmission, PaginationOptions } from '@cuis/domain';

@ApiTags('form-submissions')
@Controller('form-submissions')
export class FormSubmissionsController {
  constructor(private readonly submissionService: FormEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form submission' })
  @ApiResponse({ status: 201, description: 'The form submission has been successfully created.', type: FormSubmissionResponseDto })
  async create(@Body() createSubmissionDto: CreateFormSubmissionDto): Promise<FormSubmission> {
    const result = await this.submissionService.createFormEntry({
      formId: createSubmissionDto.formId,
      patientId: createSubmissionDto.clientId,
      data: createSubmissionDto.data || {},
      createdBy: createSubmissionDto.therapistName
    });
    return result as any;
  }

  @Post('import')
  @ApiOperation({ summary: 'Import form data from Flower Form' })
  @ApiResponse({ status: 201, description: 'The form data has been successfully imported.', type: FormSubmissionResponseDto })
  async importFlowerForm(@Body() importDto: ImportFlowerFormDto): Promise<any> {
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
    @Param('formId') formId: string,
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
  ): Promise<FormSubmission | null> {
    // TODO: Implement latest query - for now get by patient
    const entries = await this.submissionService.getFormEntriesByPatientId(clientId, { limit: 1, sortOrder: 'desc' });
    return (entries.data[0] as any) || null;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form submission by id' })
  @ApiParam({ name: 'id', description: 'Form Submission ID' })
  @ApiResponse({ status: 200, description: 'Return the form submission', type: FormSubmissionResponseDto })
  @ApiResponse({ status: 404, description: 'Form submission not found' })
  async findOne(@Param('id') id: string): Promise<FormSubmission> {
    const result = await this.submissionService.getFormEntryById(id);
    return result as any;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a form submission' })
  @ApiParam({ name: 'id', description: 'Form Submission ID' })
  @ApiResponse({ status: 200, description: 'The form submission has been successfully updated.', type: FormSubmissionResponseDto })
  @ApiResponse({ status: 404, description: 'Form submission not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateFormSubmissionDto,
  ): Promise<FormSubmission> {
    const updateData: Partial<FormSubmission> = {
      ...updateSubmissionDto,
      submissionDate: updateSubmissionDto.submissionDate ? new Date(updateSubmissionDto.submissionDate) : undefined
    };
    
    const result = await this.submissionService.updateFormEntry(id, updateData);
    return result as any;
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
