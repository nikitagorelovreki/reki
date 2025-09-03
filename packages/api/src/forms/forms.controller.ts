import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
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
import { FormService } from '@reki/core-service';
import { FormStatus, FormType } from './dto/form.dto';
import { defaultForms } from './seed/default-forms';
import { CreateFormDto, FormResponseDto, UpdateFormDto } from './dto/form.dto';
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
    const form = await this.formService.create(convertedDto as any);
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
    const forms = await this.formService.findAll(page, limit);
    return {
      data: forms,
      pagination: { page, limit, total: forms.length, totalPages: Math.ceil(forms.length / limit) }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить форму по ID' })
  @ApiResponse({ status: 200, description: 'Форма успешно получена', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async findOne(@Param('id') id: string): Promise<FormResponseDto> {
    const form = await this.formService.findById(id);
    if (!form) {
      throw new NotFoundException(`Форма с ID ${id} не найдена`);
    }
    return form as unknown as FormResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить форму' })
  @ApiResponse({ status: 200, description: 'Форма успешно обновлена', type: FormResponseDto })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto): Promise<FormResponseDto> {
    const convertedDto = convertDtoTypes(updateFormDto);
    const form = await this.formService.update(id, convertedDto as any);
    if (!form) {
      throw new NotFoundException(`Форма с ID ${id} не найдена`);
    }
    return form as unknown as FormResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить форму' })
  @ApiResponse({ status: 200, description: 'Форма успешно удалена' })
  @ApiResponse({ status: 404, description: 'Форма не найдена' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.formService.delete(id);
    return { message: 'Форма успешно удалена' };
  }
}