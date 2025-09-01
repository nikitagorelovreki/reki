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
import { FormEntryService } from '@cuis/use-cases';
import { FormEntryStatus } from '@cuis/domain';
import { 
  CreateFormEntryDto, 
  FormEntryResponseDto, 
  SaveFormDataDto, 
  UpdateFormEntryDto 
} from './dto/form-entry.dto';
import { convertDtoTypes } from '../common/dto-converter';

@ApiTags('form-entries')
@ApiBearerAuth()
@Controller('form-entries')
export class FormEntriesController {
  constructor(private readonly formEntryService: FormEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое заполнение формы' })
  @ApiResponse({ status: 201, description: 'Заполнение формы успешно создано', type: FormEntryResponseDto })
  @ApiResponse({ status: 400, description: 'Неверный запрос' })
  async create(@Body() createFormEntryDto: CreateFormEntryDto): Promise<FormEntryResponseDto> {
    const convertedDto = convertDtoTypes(createFormEntryDto);
    const formEntry = await this.formEntryService.createFormEntry(convertedDto as any);
    return formEntry as unknown as FormEntryResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заполнения форм с пагинацией' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Поле для сортировки', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Порядок сортировки', example: 'desc' })
  @ApiResponse({ 
    status: 200, 
    description: 'Заполнения форм успешно получены',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
    return this.formEntryService.getAllFormEntries({ page, limit, sortBy, sortOrder });
  }

  @Get('form/:formId')
  @ApiOperation({ summary: 'Получить заполнения форм по ID формы' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Заполнения форм успешно получены',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
  async findByFormId(
    @Param('formId') formId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.formEntryService.getFormEntriesByFormId(formId, { page, limit });
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Получить заполнения форм по ID пациента' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Заполнения форм успешно получены',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
  async findByPatientId(
    @Param('patientId') patientId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.formEntryService.getFormEntriesByPatientId(patientId, { page, limit });
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Получить заполнения форм по статусу' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Заполнения форм успешно получены',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/FormEntryResponseDto' } },
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
  async findByStatus(
    @Param('status') status: FormEntryStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.formEntryService.getFormEntriesByStatus(status, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заполнение формы по ID' })
  @ApiResponse({ status: 200, description: 'Заполнение формы успешно получено', type: FormEntryResponseDto })
  @ApiResponse({ status: 404, description: 'Заполнение формы не найдено' })
  async findOne(@Param('id') id: string): Promise<FormEntryResponseDto> {
    const formEntry = await this.formEntryService.getFormEntryById(id);
    return formEntry as unknown as FormEntryResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить заполнение формы' })
  @ApiResponse({ status: 200, description: 'Заполнение формы успешно обновлено', type: FormEntryResponseDto })
  @ApiResponse({ status: 404, description: 'Заполнение формы не найдено' })
  async update(@Param('id') id: string, @Body() updateFormEntryDto: UpdateFormEntryDto): Promise<FormEntryResponseDto> {
    const convertedDto = convertDtoTypes(updateFormEntryDto);
    const formEntry = await this.formEntryService.updateFormEntry(id, convertedDto as any);
    return formEntry as unknown as FormEntryResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить заполнение формы' })
  @ApiResponse({ status: 200, description: 'Заполнение формы успешно удалено' })
  @ApiResponse({ status: 404, description: 'Заполнение формы не найдено' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.formEntryService.deleteFormEntry(id);
    return { message: 'Заполнение формы успешно удалено' };
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Завершить заполнение формы' })
  @ApiResponse({ status: 200, description: 'Заполнение формы успешно завершено', type: FormEntryResponseDto })
  @ApiResponse({ status: 404, description: 'Заполнение формы не найдено' })
  async complete(@Param('id') id: string, @Body('score') score?: number): Promise<FormEntryResponseDto> {
    const formEntry = await this.formEntryService.completeFormEntry(id, score);
    return formEntry as unknown as FormEntryResponseDto;
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Отменить заполнение формы' })
  @ApiResponse({ status: 200, description: 'Заполнение формы успешно отменено', type: FormEntryResponseDto })
  @ApiResponse({ status: 404, description: 'Заполнение формы не найдено' })
  async cancel(@Param('id') id: string): Promise<FormEntryResponseDto> {
    const formEntry = await this.formEntryService.cancelFormEntry(id);
    return formEntry as unknown as FormEntryResponseDto;
  }

  @Patch(':id/data')
  @ApiOperation({ summary: 'Сохранить данные заполнения формы' })
  @ApiResponse({ status: 200, description: 'Данные заполнения формы успешно сохранены', type: FormEntryResponseDto })
  @ApiResponse({ status: 404, description: 'Заполнение формы не найдено' })
  async saveData(@Param('id') id: string, @Body() saveFormDataDto: SaveFormDataDto): Promise<FormEntryResponseDto> {
    const formEntry = await this.formEntryService.saveFormData(id, saveFormDataDto.data);
    return formEntry as unknown as FormEntryResponseDto;
  }
}
