import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';
import { BaseDto } from './base.dto';

export class CreateDevelopmentComponentDto {
  @ApiProperty({ description: 'ID del desarrollo' })
  @IsNumber()
  developmentId: number;

  @ApiProperty({ description: 'ID del componente' })
  @IsNumber()
  componentId: number;

  @ApiProperty({
    description: 'Tipo de cambio',
    enum: DevelopmentComponentChangeType,
  })
  @IsEnum(DevelopmentComponentChangeType)
  changeType: DevelopmentComponentChangeType;

  @ApiProperty({ description: 'Progreso del componente', required: false })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty({ description: 'Notas del componente', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Versión del componente', required: false })
  @IsString()
  @IsOptional()
  version?: string;
}

export class UpdateDevelopmentComponentDto {
  @ApiProperty({
    description: 'Tipo de cambio',
    enum: DevelopmentComponentChangeType,
    required: false,
  })
  @IsEnum(DevelopmentComponentChangeType)
  @IsOptional()
  changeType?: DevelopmentComponentChangeType;

  @ApiProperty({ description: 'Progreso del componente', required: false })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty({ description: 'Notas del componente', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Versión del componente', required: false })
  @IsString()
  @IsOptional()
  version?: string;
}

export class DevelopmentComponentResponseDto extends BaseDto {
  id: number;
  developmentId: number;
  componentId: number;
  changeType: DevelopmentComponentChangeType;
  progress: number;
  notes?: string;
  version?: string;
}
