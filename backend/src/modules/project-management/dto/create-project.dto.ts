import { IsString, IsEnum, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectType } from '../../../shared/enums';

export class CreateProjectDto {
  @ApiProperty({ description: 'Nombre del proyecto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del proyecto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Tipo de proyecto', enum: ProjectType })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({ description: 'URL del repositorio' })
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty({ description: 'ID del equipo asignado', required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;
} 