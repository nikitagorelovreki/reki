import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'
}

export class CreatePermissionDto {
  @ApiProperty({ description: 'Название разрешения' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Описание разрешения', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Действие разрешения', enum: PermissionAction })
  @IsEnum(PermissionAction)
  action!: PermissionAction;

  @ApiProperty({ description: 'Ресурс разрешения' })
  @IsString()
  resource!: string;
}

export class UpdatePermissionDto {
  @ApiProperty({ description: 'Название разрешения', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Описание разрешения', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Действие разрешения', enum: PermissionAction, required: false })
  @IsOptional()
  @IsEnum(PermissionAction)
  action?: PermissionAction;

  @ApiProperty({ description: 'Ресурс разрешения', required: false })
  @IsOptional()
  @IsString()
  resource?: string;
}

export class PermissionResponseDto {
  @ApiProperty({ description: 'ID разрешения' })
  id!: string;

  @ApiProperty({ description: 'Название разрешения' })
  name!: string;

  @ApiProperty({ description: 'Описание разрешения', required: false })
  description?: string;

  @ApiProperty({ description: 'Действие разрешения', enum: PermissionAction })
  action!: PermissionAction;

  @ApiProperty({ description: 'Ресурс разрешения' })
  resource!: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt!: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt!: Date;
}
