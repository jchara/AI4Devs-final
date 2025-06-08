import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentType } from '../../../shared/enums';

export class CreateComponentDto {
  @ApiProperty({ description: 'Nombre del componente' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del componente', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Tipo de componente', enum: ComponentType })
  @IsEnum(ComponentType)
  type: ComponentType;

  @ApiProperty({ description: 'ID del proyecto', required: false })
  @IsNumber()
  @IsOptional()
  projectId?: number;
} 