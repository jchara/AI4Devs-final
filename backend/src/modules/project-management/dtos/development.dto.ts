import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsUrl, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { DatabaseChangeType } from '../../../shared/enums/database-change-type.enum';
import { BaseDto } from './base.dto';
import { DevelopmentComponentChangeType } from '../../../shared';

// DTOs para componentes dentro del desarrollo
export class DevelopmentComponentDto {
  @ApiProperty({ description: 'ID del componente' })
  @IsNumber()
  componentId: number;

  @ApiProperty({ description: 'Tipo de cambio', required: false })
  @IsString()
  @IsOptional()
  changeType?: DevelopmentComponentChangeType;

  @ApiProperty({ description: 'Descripción del cambio en el componente', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

// DTOs para bases de datos dentro del desarrollo
export class DevelopmentDatabaseDto {
  @ApiProperty({ description: 'ID de la base de datos' })
  @IsNumber()
  databaseId: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: DatabaseChangeType })
  @IsEnum(DatabaseChangeType)
  changeType: DatabaseChangeType;

  @ApiProperty({ description: 'Descripción del script/cambio' })
  @IsString()
  scriptDescription: string;

  @ApiProperty({ description: 'Script SQL del cambio', required: false })
  @IsString()
  @IsOptional()
  sqlScript?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateDevelopmentDto {
  @ApiProperty({ description: 'Title of the development' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the development' })
  @IsString()
  description: string;

  @ApiProperty({ enum: DevelopmentStatus, description: 'Status of the development' })
  @IsEnum(DevelopmentStatus)
  status: DevelopmentStatus;

  @ApiProperty({ enum: DevelopmentPriority, description: 'Priority of the development' })
  @IsEnum(DevelopmentPriority)
  priority: DevelopmentPriority;

  @ApiProperty({ description: 'Progress of the development (0-100)', required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  estimatedDate?: Date;

  @ApiProperty({ description: 'URL of the development repository', required: false })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;

  // Campos adicionales de la entidad
  @ApiProperty({ description: 'Start date of the development', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date of the development', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'JIRA URL', required: false })
  @IsUrl()
  @IsOptional()
  jiraUrl?: string;

  @ApiProperty({ description: 'Git branch', required: false })
  @IsString()
  @IsOptional()
  branch?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Environment ID' })
  @IsNumber()
  environmentId: number;

  @ApiProperty({ description: 'Assigned user ID', required: false })
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiProperty({ description: 'Team ID', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ description: 'Is active', required: false })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDevelopmentDto {
  @ApiProperty({ description: 'Title of the development', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Description of the development', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: DevelopmentStatus, description: 'Status of the development', required: false })
  @IsEnum(DevelopmentStatus)
  @IsOptional()
  status?: DevelopmentStatus;

  @ApiProperty({ enum: DevelopmentPriority, description: 'Priority of the development', required: false })
  @IsEnum(DevelopmentPriority)
  @IsOptional()
  priority?: DevelopmentPriority;

  @ApiProperty({ description: 'Progress of the development (0-100)', required: false })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  estimatedDate?: Date;

  @ApiProperty({ description: 'URL of the development repository', required: false })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;

  // Campos adicionales de la entidad
  @ApiProperty({ description: 'Start date of the development', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date of the development', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'JIRA URL', required: false })
  @IsUrl()
  @IsOptional()
  jiraUrl?: string;

  @ApiProperty({ description: 'Git branch', required: false })
  @IsString()
  @IsOptional()
  branch?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Environment ID', required: false })
  @IsNumber()
  @IsOptional()
  environmentId?: number;

  @ApiProperty({ description: 'Assigned user ID', required: false })
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiProperty({ description: 'Team ID', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ description: 'Is active', required: false })
  @IsOptional()
  isActive?: boolean;
}

// DTO Unificado para crear desarrollo con componentes y bases de datos
export class CreateDevelopmentWithRelationsDto extends CreateDevelopmentDto {
  @ApiProperty({ 
    description: 'Componentes asociados al desarrollo', 
    type: [DevelopmentComponentDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentComponentDto)
  @IsOptional()
  components?: DevelopmentComponentDto[];

  @ApiProperty({ 
    description: 'Bases de datos asociadas al desarrollo', 
    type: [DevelopmentDatabaseDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentDatabaseDto)
  @IsOptional()
  databases?: DevelopmentDatabaseDto[];
}

// DTO Unificado para actualizar desarrollo con componentes y bases de datos
export class UpdateDevelopmentWithRelationsDto extends UpdateDevelopmentDto {
  @ApiProperty({ 
    description: 'Componentes asociados al desarrollo', 
    type: [DevelopmentComponentDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentComponentDto)
  @IsOptional()
  components?: DevelopmentComponentDto[];

  @ApiProperty({ 
    description: 'Bases de datos asociadas al desarrollo', 
    type: [DevelopmentDatabaseDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentDatabaseDto)
  @IsOptional()
  databases?: DevelopmentDatabaseDto[];
}

export class DevelopmentResponseDto extends BaseDto {
  id: number;
  title: string;
  description?: string;
  status: DevelopmentStatus;
  priority: DevelopmentPriority;
  startDate?: Date;
  endDate?: Date;
  estimatedDate?: Date;
  progress: number;
  jiraUrl?: string;
  branch?: string;
  notes?: string;
  environmentId: number;
  assignedToId?: number;
  teamId?: number;
} 