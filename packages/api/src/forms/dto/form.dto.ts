import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsInt, Min } from 'class-validator';
import { FormStatus, FormType } from '@cuis/domain';

/**
 * DTO для создания формы
 */
export class CreateFormDto {
  @ApiProperty({
    description: 'Название формы',
    example: 'Оценка состояния пациента',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Описание формы',
    example: 'Форма для оценки состояния пациента перед началом терапии',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Тип формы',
    enum: FormType,
    example: FormType.ASSESSMENT,
  })
  @IsEnum(FormType)
  type!: FormType;

  @ApiPropertyOptional({
    description: 'Статус формы',
    enum: FormStatus,
    default: FormStatus.DRAFT,
    example: FormStatus.DRAFT,
  })
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;

  @ApiPropertyOptional({
    description: 'Версия формы',
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  version?: number;

  @ApiProperty({
    description: 'JSON-схема формы',
    example: {
      fields: [
        { type: 'text', name: 'name', label: 'ФИО пациента', required: true },
        { type: 'select', name: 'painLevel', label: 'Уровень боли', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      ],
    },
  })
  @IsObject()
  schema!: Record<string, any>;
}

/**
 * DTO для обновления формы
 */
export class UpdateFormDto extends CreateFormDto {
  // Все поля наследуются от CreateFormDto и становятся опциональными
}

/**
 * DTO для ответа с данными формы
 */
export class FormResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор формы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Название формы',
    example: 'Оценка состояния пациента',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Описание формы',
    example: 'Форма для оценки состояния пациента перед началом терапии',
  })
  description?: string;

  @ApiProperty({
    description: 'Тип формы',
    enum: FormType,
    example: FormType.ASSESSMENT,
  })
  type!: FormType;

  @ApiProperty({
    description: 'Статус формы',
    enum: FormStatus,
    example: FormStatus.DRAFT,
  })
  status!: FormStatus;

  @ApiProperty({
    description: 'Версия формы',
    example: 1,
  })
  version!: number;

  @ApiProperty({
    description: 'JSON-схема формы',
    example: {
      fields: [
        { type: 'text', name: 'name', label: 'ФИО пациента', required: true },
        { type: 'select', name: 'painLevel', label: 'Уровень боли', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      ],
    },
  })
  schema!: Record<string, any>;

  @ApiProperty({
    description: 'Дата создания',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2023-01-01T12:30:00Z',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'ID пользователя, создавшего форму',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'ID пользователя, обновившего форму',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy?: string;
}