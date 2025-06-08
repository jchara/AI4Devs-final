import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseType } from '../../../shared/enums/database-type.enum';

export class CreateDatabaseDto {
  @ApiProperty({ description: 'Nombre de la base de datos' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción de la base de datos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Tipo de base de datos', enum: DatabaseType })
  @IsEnum(DatabaseType)
  type: DatabaseType;

  @ApiProperty({ description: 'Versión de la base de datos', required: false })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Indica si la base de datos está activa', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
} 