import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevelopmentStatus, DevelopmentPriority } from '../entities/development.entity';

export class CreateDevelopmentDto {
  @ApiProperty({
    description: 'Título del desarrollo',
    example: 'Implementación de autenticación JWT',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del desarrollo',
    example: 'Sistema de autenticación basado en JWT con refresh tokens y roles de usuario',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'La descripción no puede exceder 1000 caracteres' })
  description: string;

  @ApiPropertyOptional({
    description: 'Estado del desarrollo',
    enum: DevelopmentStatus,
    example: DevelopmentStatus.PLANNING,
    default: DevelopmentStatus.PLANNING,
  })
  @IsOptional()
  @IsEnum(DevelopmentStatus, { message: 'Estado inválido' })
  status?: DevelopmentStatus;

  @ApiPropertyOptional({
    description: 'Prioridad del desarrollo',
    enum: DevelopmentPriority,
    example: DevelopmentPriority.HIGH,
    default: DevelopmentPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(DevelopmentPriority, { message: 'Prioridad inválida' })
  priority?: DevelopmentPriority;

  @ApiPropertyOptional({
    description: 'ID del ambiente donde se desplegará',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'El environmentId debe ser un número entero' })
  environmentId?: number;

  @ApiPropertyOptional({
    description: 'Progreso del desarrollo (0-100)',
    example: 25,
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'El progreso debe ser un número entero' })
  @Min(0, { message: 'El progreso mínimo es 0' })
  @Max(100, { message: 'El progreso máximo es 100' })
  progress?: number;

  @ApiPropertyOptional({
    description: 'ID del usuario asignado',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'El assignedToId debe ser un número entero' })
  assignedToId?: number;

  @ApiPropertyOptional({
    description: 'ID del equipo responsable',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'El teamId debe ser un número entero' })
  teamId?: number;

  @ApiPropertyOptional({
    description: 'URL del repositorio',
    example: 'https://github.com/empresa/proyecto-auth',
  })
  @IsOptional()
  @IsString()
  repository?: string;

  @ApiPropertyOptional({
    description: 'Rama de desarrollo',
    example: 'feature/jwt-authentication',
  })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del desarrollo',
    example: '2024-01-15T09:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha de inicio inválida' })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha estimada de finalización',
    example: '2024-02-15T17:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha estimada inválida' })
  estimatedDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha real de finalización',
    example: '2024-02-10T16:30:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha de fin inválida' })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Notas adicionales del desarrollo',
    example: 'Recordar actualizar la documentación de la API',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Las notas no pueden exceder 500 caracteres' })
  notes?: string;
} 