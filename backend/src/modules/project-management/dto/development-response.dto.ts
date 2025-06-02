import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevelopmentStatus, DevelopmentPriority } from '../entities/development.entity';

export class DevelopmentResponseDto {
  @ApiProperty({
    description: 'ID único del desarrollo',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Título del desarrollo',
    example: 'Implementación de autenticación JWT',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del desarrollo',
    example: 'Sistema de autenticación basado en JWT con refresh tokens y roles de usuario',
  })
  description: string;

  @ApiProperty({
    description: 'Estado actual del desarrollo',
    enum: DevelopmentStatus,
    example: DevelopmentStatus.IN_PROGRESS,
  })
  status: DevelopmentStatus;

  @ApiProperty({
    description: 'Prioridad del desarrollo',
    enum: DevelopmentPriority,
    example: DevelopmentPriority.HIGH,
  })
  priority: DevelopmentPriority;

  @ApiProperty({
    description: 'Progreso del desarrollo (0-100)',
    example: 45,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiPropertyOptional({
    description: 'ID del ambiente donde se desplegará',
    example: 2,
  })
  environmentId?: number;

  @ApiPropertyOptional({
    description: 'ID del usuario asignado',
    example: 3,
  })
  assignedToId?: number;

  @ApiPropertyOptional({
    description: 'ID del equipo responsable',
    example: 1,
  })
  teamId?: number;

  @ApiPropertyOptional({
    description: 'URL del repositorio',
    example: 'https://github.com/empresa/proyecto-auth',
  })
  repository?: string;

  @ApiPropertyOptional({
    description: 'Rama de desarrollo',
    example: 'feature/jwt-authentication',
  })
  branch?: string;

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

  @ApiPropertyOptional({
    description: 'Fecha de inicio del desarrollo',
    example: '2024-01-15T09:00:00.000Z',
    format: 'date-time',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha estimada de finalización',
    example: '2024-02-15T17:00:00.000Z',
    format: 'date-time',
  })
  estimatedDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha real de finalización',
    example: '2024-02-10T16:30:00.000Z',
    format: 'date-time',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Notas adicionales del desarrollo',
    example: 'Recordar actualizar la documentación de la API',
  })
  notes?: string;
}

export class DevelopmentMetricsResponseDto {
  @ApiProperty({
    description: 'Total de desarrollos',
    example: 25,
  })
  totalDevelopments: number;

  @ApiProperty({
    description: 'Desarrollos por estado',
    example: {
      PLANNING: 5,
      IN_PROGRESS: 8,
      TESTING: 4,
      COMPLETED: 8
    },
  })
  byStatus: Record<DevelopmentStatus, number>;

  @ApiProperty({
    description: 'Desarrollos por prioridad',
    example: {
      LOW: 6,
      MEDIUM: 12,
      HIGH: 5,
      CRITICAL: 2
    },
  })
  byPriority: Record<DevelopmentPriority, number>;

  @ApiProperty({
    description: 'Progreso promedio de todos los desarrollos',
    example: 65.4,
  })
  averageProgress: number;

  @ApiProperty({
    description: 'Desarrollos completados este mes',
    example: 3,
  })
  completedThisMonth: number;

  @ApiProperty({
    description: 'Desarrollos vencidos',
    example: 2,
  })
  overdue: number;
}

export class UpdateProgressResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Progreso actualizado exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Desarrollo actualizado',
    type: DevelopmentResponseDto,
  })
  development: DevelopmentResponseDto;
}

export class UpdateStatusResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Estado cambiado exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Desarrollo actualizado',
    type: DevelopmentResponseDto,
  })
  development: DevelopmentResponseDto;
} 