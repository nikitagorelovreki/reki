import { IsString, IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  username!: string;

  @ApiProperty({ description: 'Email пользователя' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString()
  password!: string;

  @ApiProperty({ description: 'Имя', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Фамилия', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Активен ли пользователь', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Роли пользователя', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Email пользователя', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Пароль пользователя', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'Имя', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Фамилия', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Активен ли пользователь', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Роли пользователя', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

export class UserCredentials {
  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  username!: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString()
  password!: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя' })
  id!: string;

  @ApiProperty({ description: 'Имя пользователя' })
  username!: string;

  @ApiProperty({ description: 'Email пользователя' })
  email!: string;

  @ApiProperty({ description: 'Имя', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Фамилия', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Активен ли пользователь' })
  isActive!: boolean;

  @ApiProperty({ description: 'Роли пользователя' })
  roles!: string[];

  @ApiProperty({ description: 'Разрешения пользователя' })
  permissions!: string[];

  @ApiProperty({ description: 'Дата создания' })
  createdAt!: string;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt!: string;

  @ApiProperty({ description: 'Дата последнего входа', required: false })
  lastLoginAt?: string;
}

export class AuthResultDto {
  @ApiProperty({ description: 'Данные пользователя' })
  user!: UserResponseDto;

  @ApiProperty({ description: 'Токен доступа' })
  accessToken!: string;
}

export class ValidateTokenDto {
  @ApiProperty({ description: 'Токен для проверки' })
  @IsString()
  token!: string;
}

export class TokenValidationResponseDto {
  @ApiProperty({ description: 'Валиден ли токен' })
  valid!: boolean;

  @ApiProperty({ description: 'Данные пользователя', required: false })
  user?: UserResponseDto;
}
