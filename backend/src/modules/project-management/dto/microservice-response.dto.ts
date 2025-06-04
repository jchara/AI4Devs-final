import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MicroserviceResponseDto {
  @ApiProperty({
    description: 'ID único del microservicio',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del microservicio',
    example: 'auth-service',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del microservicio',
    example: 'Servicio de autenticación y autorización',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del repositorio',
    example: 'https://github.com/company/auth-service',
  })
  repository?: string;

  @ApiPropertyOptional({
    description: 'Tecnología utilizada',
    example: 'NestJS',
  })
  technology?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-10T08:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-25T14:30:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class CreateMicroserviceDto {
  @ApiProperty({
    description: 'Nombre del microservicio',
    example: 'auth-service',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del microservicio',
    example: 'Servicio de autenticación y autorización',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del repositorio',
    example: 'https://github.com/company/auth-service',
  })
  repository?: string;

  @ApiPropertyOptional({
    description: 'Tecnología utilizada',
    example: 'NestJS',
  })
  technology?: string;
}

export class UpdateMicroserviceDto {
  @ApiPropertyOptional({
    description: 'Nombre del microservicio',
    example: 'auth-service',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción del microservicio',
    example: 'Servicio de autenticación y autorización',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del repositorio',
    example: 'https://github.com/company/auth-service',
  })
  repository?: string;

  @ApiPropertyOptional({
    description: 'Tecnología utilizada',
    example: 'NestJS',
  })
  technology?: string;
} 