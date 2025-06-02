import { IsEmail, IsString, IsOptional, IsBoolean, IsInt, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email único del usuario',
    example: 'juan.perez@empresa.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Contraseña del usuario',
    example: 'MiPassword123!',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'ID del rol asignado',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'El roleId debe ser un número entero' })
  roleId?: number;

  @ApiPropertyOptional({
    description: 'ID del equipo asignado',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'El teamId debe ser un número entero' })
  teamId?: number;

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
} 