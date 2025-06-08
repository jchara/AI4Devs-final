import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DatabaseChangeType } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateDevelopmentDatabaseDto extends BaseDto {
  @IsNumber()
  developmentId: number;

  @IsNumber()
  databaseId: number;

  @IsEnum(DatabaseChangeType)
  changeType: DatabaseChangeType;

  @IsString()
  scriptDescription: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDevelopmentDatabaseDto extends BaseDto {
  @IsNumber()
  @IsOptional()
  developmentId?: number;

  @IsNumber()
  @IsOptional()
  databaseId?: number;

  @IsEnum(DatabaseChangeType)
  @IsOptional()
  changeType?: DatabaseChangeType;

  @IsString()
  @IsOptional()
  scriptDescription?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DevelopmentDatabaseResponseDto extends BaseDto {
  id: number;
  developmentId: number;
  databaseId: number;
  changeType: DatabaseChangeType;
  scriptDescription: string;
  notes?: string;
}
