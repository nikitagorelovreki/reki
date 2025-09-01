import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsObject, IsOptional, IsUUID } from 'class-validator';
import { FormEntryStatus } from '@reki/domain';

/**
 * DTO для создания заполнения формы
 */
export class CreateFormEntryDto {
  @ApiProperty({
    description: 'ID формы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  formId!: string;

  @ApiPropertyOptional({
    description: 'ID пациента',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({
    description: 'ID устройства',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'ID клиники',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @ApiPropertyOptional({
    description: 'Статус заполнения формы',
    enum: FormEntryStatus,
    default: FormEntryStatus.IN_PROGRESS,
    example: FormEntryStatus.IN_PROGRESS,
  })
  @IsEnum(FormEntryStatus)
  @IsOptional()
  status?: FormEntryStatus;

  @ApiPropertyOptional({
    description: 'Данные заполнения формы',
    example: {
      name: 'Иванов Иван Иванович',
      painLevel: 3,
      symptoms: ['головная боль', 'тошнота'],
    },
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Оценка/баллы',
    example: 85,
  })
  @IsNumber()
  @IsOptional()
  score?: number;
}

/**
 * DTO для обновления заполнения формы
 */
export class UpdateFormEntryDto {
  @ApiPropertyOptional({
    description: 'Статус заполнения формы',
    enum: FormEntryStatus,
    example: FormEntryStatus.COMPLETED,
  })
  @IsEnum(FormEntryStatus)
  @IsOptional()
  status?: FormEntryStatus;

  @ApiPropertyOptional({
    description: 'Данные заполнения формы',
    example: {
      name: 'Иванов Иван Иванович',
      painLevel: 5,
      symptoms: ['головная боль', 'тошнота', 'головокружение'],
    },
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Оценка/баллы',
    example: 75,
  })
  @IsNumber()
  @IsOptional()
  score?: number;
}

/**
 * DTO для сохранения данных формы
 */
export class SaveFormDataDto {
  @ApiProperty({
    description: 'Данные заполнения формы',
    example: {
      name: 'Иванов Иван Иванович',
      painLevel: 5,
      symptoms: ['головная боль', 'тошнота', 'головокружение'],
    },
  })
  @IsObject()
  data!: Record<string, unknown>;
}

/**
 * DTO для ответа с данными заполнения формы
 */
export class FormEntryResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор заполнения формы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID формы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  formId!: string;

  @ApiPropertyOptional({
    description: 'ID пациента',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  patientId?: string;

  @ApiPropertyOptional({
    description: 'ID устройства',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'ID клиники',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  clinicId?: string;

  @ApiProperty({
    description: 'Статус заполнения формы',
    enum: FormEntryStatus,
    example: FormEntryStatus.COMPLETED,
  })
  status!: FormEntryStatus;

  @ApiProperty({
    description: 'Данные заполнения формы',
    example: {
      name: 'Иванов Иван Иванович',
      painLevel: 5,
      symptoms: ['головная боль', 'тошнота', 'головокружение'],
    },
  })
  data!: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Оценка/баллы',
    example: 75,
  })
  score?: number;

  @ApiPropertyOptional({
    description: 'Дата завершения',
    example: '2023-01-02T15:30:00Z',
  })
  completedAt?: Date;

  @ApiProperty({
    description: 'Дата создания',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2023-01-02T15:30:00Z',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'ID пользователя, создавшего запись',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'ID пользователя, обновившего запись',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy?: string;
}
