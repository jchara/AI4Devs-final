import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectType } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateProjectDto extends BaseDto {
  @ApiProperty({ description: 'Tipo de proyecto', enum: ProjectType })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({ description: 'Código del proyecto', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'ID del equipo responsable', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;
}

export class UpdateProjectDto extends BaseDto {
  @ApiProperty({ description: 'Tipo de proyecto', enum: ProjectType, required: false })
  @IsEnum(ProjectType)
  @IsOptional()
  type?: ProjectType;

  @ApiProperty({ description: 'Código del proyecto', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'ID del equipo responsable', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;
} 