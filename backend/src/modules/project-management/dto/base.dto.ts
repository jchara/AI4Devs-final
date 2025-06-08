import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty({ description: 'Nombre del registro' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del registro', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Fecha de creación', required: false })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Fecha de actualización', required: false })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
} 