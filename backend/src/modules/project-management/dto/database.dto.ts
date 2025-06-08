import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseType } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateDatabaseDto extends BaseDto {
  @ApiProperty({ description: 'Tipo de base de datos', enum: DatabaseType })
  @IsEnum(DatabaseType)
  type: DatabaseType;

  @ApiProperty({ description: 'ID del entorno al que pertenece' })
  @IsNumber()
  environmentId: number;

  @ApiProperty({ description: 'Versión de la base de datos', required: false })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Configuración de la base de datos', required: false })
  @IsString()
  @IsOptional()
  configuration?: string;
}

export class UpdateDatabaseDto extends BaseDto {
  @ApiProperty({ description: 'Tipo de base de datos', enum: DatabaseType, required: false })
  @IsEnum(DatabaseType)
  @IsOptional()
  type?: DatabaseType;

  @ApiProperty({ description: 'ID del entorno al que pertenece', required: false })
  @IsNumber()
  @IsOptional()
  environmentId?: number;

  @ApiProperty({ description: 'Versión de la base de datos', required: false })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Configuración de la base de datos', required: false })
  @IsString()
  @IsOptional()
  configuration?: string;
} 