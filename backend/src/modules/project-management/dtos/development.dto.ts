import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsUrl, Min, Max } from 'class-validator';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { BaseDto } from './base.dto';

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
  @IsOptional()
  estimatedDate?: Date;

  @ApiProperty({ description: 'URL of the development repository', required: false })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;
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

  @ApiProperty({ description: 'ID of the project this development belongs to', required: false })
  @IsNumber()
  @IsOptional()
  projectId?: number;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsDate()
  @IsOptional()
  estimatedDate?: Date;

  @ApiProperty({ description: 'URL of the development repository', required: false })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;
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