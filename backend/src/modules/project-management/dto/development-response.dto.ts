import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevelopmentStatus, DevelopmentPriority } from '../../../shared/enums';
import { MicroserviceResponseDto } from './microservice-response.dto';

// DTO para la relación desarrollo-microservicio
export class DevelopmentMicroserviceResponseDto {
  @ApiProperty({
    description: 'ID de la relación',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Progreso del microservicio en este desarrollo',
    example: 75.5,
  })
  progress: number;

  @ApiPropertyOptional({
    description: 'Notas específicas sobre este microservicio en el desarrollo',
    example: 'Pendiente revisión de seguridad',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Versión del microservicio',
    example: '1.2.3',
  })
  version?: string;

  @ApiProperty({
    description: 'Información del microservicio',
    type: MicroserviceResponseDto,
  })
  microservice: MicroserviceResponseDto;
}

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
    description: 'URL de la tarea de Jira',
    example: 'https://company.atlassian.net/browse/AUTH-2024',
  })
  jiraUrl?: string;

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

  @ApiPropertyOptional({
    description: 'Detalles del ambiente',
    example: { id: 2, name: 'Testing' },
  })
  environment?: any;

  @ApiPropertyOptional({
    description: 'Detalles del usuario asignado',
    example: { id: 3, name: 'John Doe' },
  })
  assignedTo?: any;

  @ApiPropertyOptional({
    description: 'Detalles del equipo',
    example: { id: 1, name: 'Backend Team' },
  })
  team?: any;

  @ApiPropertyOptional({
    description: 'Microservicios asociados al desarrollo',
    type: [DevelopmentMicroserviceResponseDto],
  })
  developmentMicroservices?: DevelopmentMicroserviceResponseDto[];
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
      COMPLETED: 8,
      CANCELLED: 2,
      IN_DEVELOPMENT: 10,
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