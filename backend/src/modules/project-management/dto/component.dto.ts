import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentType } from '../../../shared/enums';
import { BaseDto } from './base.dto';

export class CreateComponentDto extends BaseDto {
  @ApiProperty({ description: 'Tipo de componente', enum: ComponentType })
  @IsEnum(ComponentType)
  type: ComponentType;

  @ApiProperty({ description: 'Tecnología utilizada' })
  @IsString()
  technology: string;

  @ApiProperty({ description: 'ID del proyecto al que pertenece' })
  @IsNumber()
  projectId: number;

  @ApiProperty({ description: 'Versión del componente', required: false })
  @IsString()
  @IsOptional()
  version?: string;
}

export class UpdateComponentDto extends BaseDto {
  @ApiProperty({ description: 'Tipo de componente', enum: ComponentType, required: false })
  @IsEnum(ComponentType)
  @IsOptional()
  type?: ComponentType;

  @ApiProperty({ description: 'Tecnología utilizada', required: false })
  @IsString()
  @IsOptional()
  technology?: string;

  @ApiProperty({ description: 'ID del proyecto al que pertenece', required: false })
  @IsNumber()
  @IsOptional()
  projectId?: number;

  @ApiProperty({ description: 'Versión del componente', required: false })
  @IsString()
  @IsOptional()
  version?: string;
} 