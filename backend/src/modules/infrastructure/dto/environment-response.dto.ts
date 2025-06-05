import { ApiProperty } from '@nestjs/swagger';
import { Environment } from '../entities/environment.entity';

export class EnvironmentResponseDto {
  @ApiProperty({
    description: 'ID único del ambiente',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del ambiente',
    example: 'Producción',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del ambiente',
    example: 'Ambiente de producción para aplicaciones en vivo',
  })
  description: string;

  @ApiProperty({
    description: 'Color en formato hexadecimal',
    example: '#007bff',
  })
  color: string;

  @ApiProperty({
    description: 'Orden de aparición',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Indica si el ambiente está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-06-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2023-06-15T10:00:00.000Z',
  })
  updatedAt: Date;

  constructor(environment: Environment) {
    this.id = environment.id;
    this.name = environment.name;
    this.description = environment.description;
    this.color = environment.color;
    this.order = environment.order;
    this.isActive = environment.isActive;
    this.createdAt = environment.createdAt;
    this.updatedAt = environment.updatedAt;
  }
} 