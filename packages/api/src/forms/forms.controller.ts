import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FormService } from '@cuis/use-cases';
import { FormStatus, FormType } from '@cuis/domain';
import { defaultForms } from './seed/default-forms';
import { CreateFormDto, UpdateFormDto, FormResponseDto } from './dto/form.dto';
import { convertDtoTypes } from '../common/dto-converter';

@ApiTags('forms')
@ApiBearerAuth()
@Controller('forms')
export class FormsController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую форму' })
  @ApiResponse({ status: 201, description: 'Форма успешно создана', type: FormResponseDto })
  @ApiResponse({ status: 400, description: 'Неверный запрос' })
  async create(@Body() createFormDto: CreateFormDto): Promise<FormResponseDto> {
    const convertedDto = convertDtoTypes(createFormDto);
    const form = await this.formService.createForm(convertedDto as any);
    return form as unknown as FormResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Получить все формы с пагинацией' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество элементов на странице', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Поле для сортировки', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Порядок сортировки', example: 'desc' })
  @ApiResponse({ 
    status: 200, 
    description: 'Формы успешно получены',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/FormResponseDto' } },
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
    return this.formService.getAllForms({ page, limit, sortBy, sortOrder });
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Получить формы по типу' })
  @ApiResponse({ status: 200, description: 'Формы успешно получены', type: [FormResponseDto] })
  async findByType(@Param('type') type: FormType): Promise<FormResponseDto[]> {
    const forms = await this.formService.getFormsByType(type as FormType);
    return forms as unknown as FormResponseDto[];
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Получить формы по статусу' })
  @ApiResponse({ status: 200, description: 'Формы успешно получены', type: [FormResponseDto] })
  async findByStatus(@Param('status') status: FormStatus): Promise<FormResponseDto[]> {
    const forms = await this.formService.getFormsByStatus(status as FormStatus);
    return forms as unknown as FormResponseDto[];
  }

  @Get('title/:title')
  @ApiOperation({ summary: 'Получить формы по названию' })
  @ApiResponse({ status: 200, description: 'Формы успешно получены', type: [FormResponseDto] })
  async findByTitle(@Param('title') title: string): Promise<FormResponseDto[]> {
    const forms = await this.formService.getFormsByTitle(title);
    return forms as unknown as FormResponseDto[];
  }

  @Get('title/:title/latest')
  @ApiOperation({ summary: 'Получить последнюю версию формы по названию' })
  @ApiResponse({ status: 200, description: 'Форма успешно получена', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async findLatestByTitle(@Param('title') title: string): Promise<FormResponseDto> {
    const form = await this.formService.getLatestVersionByTitle(title);
    if (!form) {
      throw new NotFoundException(`Форма с названием ${title} не найдена`);
    }
    return form as unknown as FormResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить форму по ID' })
  @ApiResponse({ status: 200, description: 'Форма успешно получена', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async findOne(@Param('id') id: string): Promise<FormResponseDto> {
    const form = await this.formService.getFormById(id);
    return form as unknown as FormResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить форму' })
  @ApiResponse({ status: 200, description: 'Форма успешно обновлена', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto): Promise<FormResponseDto> {
    const convertedDto = convertDtoTypes(updateFormDto);
    const form = await this.formService.updateForm(id, convertedDto as any);
    return form as unknown as FormResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить форму' })
  @ApiResponse({ status: 200, description: 'Форма успешно удалена' })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.formService.deleteForm(id);
    return { message: 'Форма успешно удалена' };
  }

  @Post(':id/new-version')
  @ApiOperation({ summary: 'Создать новую версию формы' })
  @ApiResponse({ status: 201, description: 'Новая версия формы успешно создана', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async createNewVersion(@Param('id') id: string): Promise<FormResponseDto> {
    const form = await this.formService.createNewVersion(id);
    return form as unknown as FormResponseDto;
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Опубликовать форму' })
  @ApiResponse({ status: 200, description: 'Форма успешно опубликована', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async publish(@Param('id') id: string): Promise<FormResponseDto> {
    const form = await this.formService.publishForm(id);
    return form as unknown as FormResponseDto;
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Архивировать форму' })
  @ApiResponse({ status: 200, description: 'Форма успешно архивирована', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async archive(@Param('id') id: string): Promise<FormResponseDto> {
    const form = await this.formService.archiveForm(id);
    return form as unknown as FormResponseDto;
  }

  @Post('/initialize')
  @ApiOperation({ summary: 'Инициализировать формы по умолчанию' })
  @ApiResponse({ status: 201, description: 'Формы успешно созданы' })
  @HttpCode(201)
  async initializeDefaultForms(): Promise<{ message: string; forms: FormResponseDto[] }> {
    const forms = [];
    
    for (const formData of defaultForms) {
      try {
        const form = await this.formService.createForm({
          title: formData.title,
          type: formData.type,
          description: formData.description,
          status: FormStatus.ACTIVE,
          schema: formData.schema,
        });
        forms.push(form);
      } catch (error) {
        console.error(`Error creating form ${formData.title}:`, error);
      }
    }

    return { 
      message: `Successfully initialized ${forms.length} default forms`, 
      forms: forms as unknown as FormResponseDto[] 
    };
  }
}