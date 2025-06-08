import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChangeType } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateDevelopmentComponentDto extends BaseDto {
  @ApiProperty({ description: 'ID del desarrollo' })
  @IsNumber()
  developmentId: number;

  @ApiProperty({ description: 'ID del componente' })
  @IsNumber()
  componentId: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: ChangeType })
  @IsEnum(ChangeType)
  changeType: ChangeType;

  @ApiProperty({ description: 'Detalles del cambio', required: false })
  @IsString()
  @IsOptional()
  changeDetails?: string;

  @ApiProperty({ description: 'Versión del componente', required: false })
  @IsString()
  @IsOptional()
  version?: string;
}

export class UpdateDevelopmentComponentDto extends BaseDto {
  @ApiProperty({ description: 'ID del desarrollo', required: false })
  @IsNumber()
  @IsOptional()
  developmentId?: number;

  @ApiProperty({ description: 'ID del componente', required: false })
  @IsNumber()
  @IsOptional()
  componentId?: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: ChangeType, required: false })
  @IsEnum(ChangeType)
  @IsOptional()
  changeType?: ChangeType;

  @ApiProperty({ description: 'Detalles del cambio', required: false })
  @IsString()
  @IsOptional()
  changeDetails?: string;

  @ApiProperty({ description: 'Versión del componente', required: false })
  @IsString()
  @IsOptional()
  version?: string;
} 