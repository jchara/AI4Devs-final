import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, Length, IsNumber, IsBoolean } from 'class-validator';
import { BaseDto } from './base.dto';
import { ComponentType } from '../../../shared/enums/component-type.enum';

export class CreateComponentDto {
  @ApiProperty({ description: 'Name of the component' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Description of the component' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ComponentType, description: 'Type of the component' })
  @IsEnum(ComponentType)
  type: ComponentType;

  @ApiProperty({ description: 'Version of the component' })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Technology of the component' })
  @IsString()
  @Length(1, 100)
  technology: string;

  @ApiProperty({ description: 'Whether the component is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'ID of the project this component belongs to' })
  @IsNumber()
  projectId: number;
}

export class UpdateComponentDto {
  @ApiProperty({ description: 'Name of the component', required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the component', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ComponentType, description: 'Type of the component', required: false })
  @IsEnum(ComponentType)
  @IsOptional()
  type?: ComponentType;

  @ApiProperty({ description: 'Version of the component', required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Technology of the component', required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  technology?: string;

  @ApiProperty({ description: 'Whether the component is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'ID of the project this component belongs to', required: false })
  @IsNumber()
  @IsOptional()
  projectId?: number;
}

export class ComponentResponseDto extends BaseDto {
  id: number;
  projectId: number;
  name: string;
  type: ComponentType;
  description?: string;
  technology: string;
  version?: string;
} 