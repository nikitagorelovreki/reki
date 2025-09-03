import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Название роли' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Описание роли', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Разрешения роли', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UpdateRoleDto {
  @ApiProperty({ description: 'Название роли', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Описание роли', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Разрешения роли', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class RoleResponseDto {
  @ApiProperty({ description: 'ID роли' })
  id!: string;

  @ApiProperty({ description: 'Название роли' })
  name!: string;

  @ApiProperty({ description: 'Описание роли', required: false })
  description?: string;

  @ApiProperty({ description: 'Разрешения роли' })
  permissions!: string[];

  @ApiProperty({ description: 'Дата создания' })
  createdAt!: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt!: Date;
}
