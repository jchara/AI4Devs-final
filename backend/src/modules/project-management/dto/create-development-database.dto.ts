import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseChangeType } from '../../../shared/enums/database-change-type.enum';

export class CreateDevelopmentDatabaseDto {
  @ApiProperty({ description: 'ID del desarrollo' })
  @IsNumber()
  developmentId: number;

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