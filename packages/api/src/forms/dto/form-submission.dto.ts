import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFormSubmissionDto {
  @ApiProperty({ description: 'Form ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  formId: string;

  @ApiProperty({ description: 'Client ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiPropertyOptional({ description: 'Therapist ID', example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsUUID()
  @IsOptional()
  therapistId?: string;

  @ApiPropertyOptional({ description: 'Therapist name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  therapistName?: string;

  @ApiPropertyOptional({ description: 'Submission date', example: '2023-01-01T12:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  submissionDate?: string;

  @ApiProperty({ 
    description: 'Form data', 
    example: {
      head_hold: ['Удерживает', 'С наклоном вправо'],
      rollover: ['Со спины на живот', 'Вправо'],
      notes: 'Patient shows improvement in head control'
    }
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class UpdateFormSubmissionDto {
  @ApiPropertyOptional({ description: 'Therapist ID', example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsUUID()
  @IsOptional()
  therapistId?: string;

  @ApiPropertyOptional({ description: 'Therapist name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  therapistName?: string;

  @ApiPropertyOptional({ description: 'Submission date', example: '2023-01-01T12:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  submissionDate?: string;

  @ApiPropertyOptional({ 
    description: 'Form data', 
    example: {
      head_hold: ['Удерживает', 'С наклоном вправо'],
      rollover: ['Со спины на живот', 'Вправо'],
      notes: 'Patient shows significant improvement in head control'
    }
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class FormSubmissionResponseDto {
  @ApiProperty({ description: 'Submission ID', example: '123e4567-e89b-12d3-a456-426614174003' })
  id: string;

  @ApiProperty({ description: 'Form ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  formId: string;

  @ApiProperty({ description: 'Client ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  clientId: string;

  @ApiPropertyOptional({ description: 'Therapist ID', example: '123e4567-e89b-12d3-a456-426614174002' })
  therapistId?: string;

  @ApiPropertyOptional({ description: 'Therapist name', example: 'John Doe' })
  therapistName?: string;

  @ApiProperty({ description: 'Submission date', example: '2023-01-01T12:00:00.000Z' })
  submissionDate: Date;

  @ApiProperty({ 
    description: 'Form data', 
    example: {
      head_hold: ['Удерживает', 'С наклоном вправо'],
      rollover: ['Со спины на живот', 'Вправо'],
      notes: 'Patient shows improvement in head control'
    }
  })
  data: Record<string, any>;

  @ApiProperty({ description: 'Creation date', example: '2023-01-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2023-01-01T12:00:00.000Z' })
  updatedAt: Date;
}

export class ImportFlowerFormDto {
  @ApiProperty({ description: 'Client ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Form ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  formId: string;

  @ApiPropertyOptional({ description: 'Therapist name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  therapistName?: string;

  @ApiProperty({ 
    description: 'Form data from Flower Form', 
    example: {
      type: 'lfk',
      head_hold: ['Удерживает', 'С наклоном вправо'],
      rollover: ['Со спины на живот', 'Вправо'],
      therapist_name: 'John Doe',
      exam_date: '2023-01-01'
    }
  })
  @IsObject()
  @IsNotEmpty()
  formData: Record<string, any>;
}
