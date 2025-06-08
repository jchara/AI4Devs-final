import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChangeType } from '../../../shared/enums/change-type.enum';

export class CreateDevelopmentComponentDto {
  @ApiProperty({ description: 'ID del desarrollo' })
  @IsNumber()
  developmentId: number;

  @ApiProperty({ description: 'ID del componente' })
  @IsNumber()
  componentId: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: ChangeType })
  @IsEnum(ChangeType)
  changeType: ChangeType;

  @ApiProperty({ description: 'Descripción del cambio', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Código del cambio', required: false })
  @IsString()
  @IsOptional()
  code?: string;
} 