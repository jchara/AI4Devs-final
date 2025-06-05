import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnvironmentDto {
  @ApiProperty({
    description: 'Nombre del ambiente',
    example: 'Producción',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción del ambiente',
    example: 'Ambiente de producción para aplicaciones en vivo',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(100, { message: 'La descripción no puede exceder 100 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Color en formato hexadecimal',
    example: '#007bff',
    default: '#007bff',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'El color debe ser un texto' })
  @MaxLength(20, { message: 'El color no puede exceder 20 caracteres' })
  color?: string;

  @ApiProperty({
    description: 'Orden de aparición',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  order?: number;

  @ApiProperty({
    description: 'Indica si el ambiente está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
} 