import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseChangeType } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateDevelopmentDatabaseDto extends BaseDto {
  @ApiProperty({ description: 'ID del desarrollo' })
  @IsNumber()
  developmentId: number;

  @ApiProperty({ description: 'ID de la base de datos' })
  @IsNumber()
  databaseId: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: DatabaseChangeType })
  @IsEnum(DatabaseChangeType)
  changeType: DatabaseChangeType;

  @ApiProperty({ description: 'Detalles del cambio', required: false })
  @IsString()
  @IsOptional()
  changeDetails?: string;

  @ApiProperty({ description: 'Script SQL del cambio', required: false })
  @IsString()
  @IsOptional()
  sqlScript?: string;

  @ApiProperty({ description: 'Versión de la base de datos', required: false })
  @IsString()
  @IsOptional()
  version?: string;
}

export class UpdateDevelopmentDatabaseDto extends BaseDto {
  @ApiProperty({ description: 'ID del desarrollo', required: false })
  @IsNumber()
  @IsOptional()
  developmentId?: number;

  @ApiProperty({ description: 'ID de la base de datos', required: false })
  @IsNumber()
  @IsOptional()
  databaseId?: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: DatabaseChangeType, required: false })
  @IsEnum(DatabaseChangeType)
  @IsOptional()
  changeType?: DatabaseChangeType;

  @ApiProperty({ description: 'Detalles del cambio', required: false })
  @IsString()
  @IsOptional()
  changeDetails?: string;

  @ApiProperty({ description: 'Script SQL del cambio', required: false })
  @IsString()
  @IsOptional()
  sqlScript?: string;

  @ApiProperty({ description: 'Versión de la base de datos', required: false })
  @IsString()
  @IsOptional()
  version?: string;
} 