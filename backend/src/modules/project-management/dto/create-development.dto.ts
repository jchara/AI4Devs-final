import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DevelopmentStatus, DevelopmentPriority } from '../../../shared/enums';
import { Type } from 'class-transformer';

export class CreateDevelopmentDto {
  @ApiProperty({ description: 'Título del desarrollo' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción del desarrollo' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Estado del desarrollo', enum: DevelopmentStatus })
  @IsEnum(DevelopmentStatus)
  status: DevelopmentStatus;

  @ApiProperty({ description: 'Prioridad del desarrollo', enum: DevelopmentPriority })
  @IsEnum(DevelopmentPriority)
  priority: DevelopmentPriority;



  @ApiProperty({ description: 'ID del ambiente', required: false })
  @IsNumber()
  @IsOptional()
  environmentId?: number;

  @ApiProperty({ description: 'ID del usuario asignado', required: false })
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiProperty({ description: 'ID del equipo', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ description: 'Fecha de inicio', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Fecha estimada de finalización', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  estimatedDate?: Date;

  @ApiProperty({ description: 'Fecha de finalización', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'URL de Jira', required: false })
  @IsString()
  @IsOptional()
  jiraUrl?: string;

  @ApiProperty({ description: 'Rama de desarrollo', required: false })
  @IsString()
  @IsOptional()
  branch?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Progreso del desarrollo', required: false })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty({ description: 'Estado activo', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'IDs de los componentes', type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  componentIds?: number[];

  @ApiProperty({ description: 'IDs de las bases de datos', type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  databaseIds?: number[];
} 