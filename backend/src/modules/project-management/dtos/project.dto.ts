import { IsString, IsEnum, IsOptional, Length, IsUrl } from 'class-validator';
import { BaseDto } from './base.dto';
import { ProjectType } from '../../../shared/enums/project-type.enum';

export class CreateProjectDto extends BaseDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsUrl()
  @Length(1, 255)
  repositoryUrl: string;

  @IsEnum(ProjectType)
  type: ProjectType;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProjectDto extends BaseDto {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsUrl()
  @Length(1, 255)
  @IsOptional()
  repositoryUrl?: string;

  @IsEnum(ProjectType)
  @IsOptional()
  type?: ProjectType;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ProjectResponseDto extends BaseDto {
  id: number;
  name: string;
  repositoryUrl: string;
  type: ProjectType;
  description?: string;
} 