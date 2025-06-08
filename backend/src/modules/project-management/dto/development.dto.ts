import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { DevelopmentPriority, DevelopmentStatus } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateDevelopmentDto extends BaseDto {
  @ApiProperty({ description: 'Estado del desarrollo', enum: DevelopmentStatus })
  @IsEnum(DevelopmentStatus)
  status: DevelopmentStatus;

  @ApiProperty({ description: 'Prioridad del desarrollo', enum: DevelopmentPriority })
  @IsEnum(DevelopmentPriority)
  priority: DevelopmentPriority;

  @ApiProperty({ description: 'ID del proyecto al que pertenece' })
  @IsNumber()
  projectId: number;

  @ApiProperty({ description: 'ID del entorno de desarrollo' })
  @IsNumber()
  environmentId: number;

  @ApiProperty({ description: 'ID del usuario asignado', required: false })
  @IsNumber()
  @IsOptional()
  assignedTo?: number;

  @ApiProperty({ description: 'ID del equipo asignado', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ description: 'Fecha de inicio', required: false })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Fecha de finalización estimada', required: false })
  @IsDate()
  @IsOptional()
  estimatedEndDate?: Date;

  @ApiProperty({ description: 'Progreso del desarrollo (0-100)', required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
}

export class UpdateDevelopmentDto extends BaseDto {
  @ApiProperty({ description: 'Estado del desarrollo', enum: DevelopmentStatus, required: false })
  @IsEnum(DevelopmentStatus)
  @IsOptional()
  status?: DevelopmentStatus;

  @ApiProperty({ description: 'Prioridad del desarrollo', enum: DevelopmentPriority, required: false })
  @IsEnum(DevelopmentPriority)
  @IsOptional()
  priority?: DevelopmentPriority;

  @ApiProperty({ description: 'ID del proyecto al que pertenece', required: false })
  @IsNumber()
  @IsOptional()
  projectId?: number;

  @ApiProperty({ description: 'ID del entorno de desarrollo', required: false })
  @IsNumber()
  @IsOptional()
  environmentId?: number;

  @ApiProperty({ description: 'ID del usuario asignado', required: false })
  @IsNumber()
  @IsOptional()
  assignedTo?: number;

  @ApiProperty({ description: 'ID del equipo asignado', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ description: 'Fecha de inicio', required: false })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Fecha de finalización estimada', required: false })
  @IsDate()
  @IsOptional()
  estimatedEndDate?: Date;

  @ApiProperty({ description: 'Progreso del desarrollo (0-100)', required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
} 