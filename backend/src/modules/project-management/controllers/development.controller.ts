import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { DevelopmentService } from '../services/development.service';
import { Development, DevelopmentStatus, DevelopmentPriority } from '../entities/development.entity';
import { DevelopmentFilters } from '../repositories/development.repository.interface';
import { 
  CreateDevelopmentDto,
  UpdateDevelopmentDto,
  DevelopmentResponseDto, 
  DevelopmentMetricsResponseDto
} from '../dto';

@ApiTags('developments')
@Controller('developments')
export class DevelopmentController {
  constructor(private readonly developmentService: DevelopmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo desarrollo',
    description: 'Crea un nuevo desarrollo en el sistema con todos los detalles especificados'
  })
  @ApiBody({ 
    type: CreateDevelopmentDto,
    description: 'Datos del desarrollo a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Desarrollo creado exitosamente',
    type: DevelopmentResponseDto
  })
  @ApiResponse({ status: 400, description: 'Error de validación en los datos enviados' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  create(@Body() createDevelopmentDto: CreateDevelopmentDto): Promise<Development> {
    return this.developmentService.create(createDevelopmentDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener desarrollos con filtros opcionales',
    description: 'Retorna una lista de desarrollos, opcionalmente filtrada por estado, prioridad, asignado, equipo, ambiente o búsqueda de texto'
  })
  @ApiQuery({ name: 'status', enum: DevelopmentStatus, required: false, description: 'Filtrar por estado del desarrollo' })
  @ApiQuery({ name: 'priority', enum: DevelopmentPriority, required: false, description: 'Filtrar por prioridad del desarrollo' })
  @ApiQuery({ name: 'assignedToId', type: Number, required: false, description: 'ID del usuario asignado' })
  @ApiQuery({ name: 'teamId', type: Number, required: false, description: 'ID del equipo responsable' })
  @ApiQuery({ name: 'environmentId', type: Number, required: false, description: 'ID del ambiente de despliegue' })
  @ApiQuery({ name: 'search', type: String, required: false, description: 'Búsqueda por título del desarrollo' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de desarrollos obtenida exitosamente',
    type: [DevelopmentResponseDto]
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findAll(
    @Query('status') status?: DevelopmentStatus,
    @Query('priority') priority?: DevelopmentPriority,
    @Query('assignedToId') assignedToId?: string,
    @Query('teamId') teamId?: string,
    @Query('environmentId') environmentId?: string,
    @Query('search') search?: string,
  ): Promise<Development[]> {
    // Si no hay filtros, devolver todos
    if (!status && !priority && !assignedToId && !teamId && !environmentId && !search) {
      return this.developmentService.findAll();
    }

    // Construir filtros
    const filters: DevelopmentFilters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assignedToId) filters.assignedToId = parseInt(assignedToId);
    if (teamId) filters.teamId = parseInt(teamId);
    if (environmentId) filters.environmentId = parseInt(environmentId);
    if (search) filters.search = search;

    return this.developmentService.findWithFilters(filters);
  }

  @Get('metrics')
  @ApiOperation({ 
    summary: 'Obtener métricas de desarrollos',
    description: 'Retorna estadísticas y métricas agregadas de todos los desarrollos del sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas obtenidas exitosamente',
    type: DevelopmentMetricsResponseDto
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  getMetrics(): Promise<DevelopmentMetricsResponseDto> {
    return this.developmentService.getMetrics();
  }

  @Get('overdue')
  @ApiOperation({ 
    summary: 'Obtener desarrollos vencidos',
    description: 'Retorna una lista de desarrollos que han superado su fecha estimada de finalización'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de desarrollos vencidos obtenida exitosamente',
    type: [DevelopmentResponseDto]
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  getOverdue(): Promise<Development[]> {
    return this.developmentService.getOverdue();
  }

  @Get('by-status/:status')
  @ApiOperation({ 
    summary: 'Obtener desarrollos por estado',
    description: 'Retorna todos los desarrollos que tienen el estado especificado'
  })
  @ApiParam({ 
    name: 'status', 
    enum: DevelopmentStatus, 
    description: 'Estado del desarrollo a filtrar',
    example: DevelopmentStatus.IN_PROGRESS
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de desarrollos por estado obtenida exitosamente',
    type: [DevelopmentResponseDto]
  })
  @ApiResponse({ status: 400, description: 'Estado inválido proporcionado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByStatus(
    @Param('status', new ParseEnumPipe(DevelopmentStatus)) status: DevelopmentStatus,
  ): Promise<Development[]> {
    return this.developmentService.findByStatus(status);
  }

  @Get('by-priority/:priority')
  @ApiOperation({ 
    summary: 'Obtener desarrollos por prioridad',
    description: 'Retorna todos los desarrollos que tienen la prioridad especificada'
  })
  @ApiParam({ 
    name: 'priority', 
    enum: DevelopmentPriority, 
    description: 'Prioridad del desarrollo a filtrar',
    example: DevelopmentPriority.HIGH
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de desarrollos por prioridad obtenida exitosamente',
    type: [DevelopmentResponseDto]
  })
  @ApiResponse({ status: 400, description: 'Prioridad inválida proporcionada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByPriority(
    @Param('priority', new ParseEnumPipe(DevelopmentPriority)) priority: DevelopmentPriority,
  ): Promise<Development[]> {
    return this.developmentService.findByPriority(priority);
  }

  @Get('by-assignee/:assignedToId')
  @ApiOperation({ 
    summary: 'Obtener desarrollos por usuario asignado',
    description: 'Retorna todos los desarrollos asignados a un usuario específico'
  })
  @ApiParam({ 
    name: 'assignedToId', 
    type: Number, 
    description: 'ID del usuario asignado',
    example: 2
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de desarrollos del usuario obtenida exitosamente',
    type: [DevelopmentResponseDto]
  })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByAssignee(@Param('assignedToId', ParseIntPipe) assignedToId: number): Promise<Development[]> {
    return this.developmentService.findByAssignee(assignedToId);
  }

  @Get('by-team/:teamId')
  @ApiOperation({ 
    summary: 'Obtener desarrollos por equipo',
    description: 'Retorna todos los desarrollos asignados a un equipo específico'
  })
  @ApiParam({ 
    name: 'teamId', 
    type: Number, 
    description: 'ID del equipo',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de desarrollos del equipo obtenida exitosamente',
    type: [DevelopmentResponseDto]
  })
  @ApiResponse({ status: 400, description: 'ID de equipo inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByTeam(@Param('teamId', ParseIntPipe) teamId: number): Promise<Development[]> {
    return this.developmentService.findByTeam(teamId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener desarrollo por ID',
    description: 'Retorna los detalles completos de un desarrollo específico'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del desarrollo',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Desarrollo encontrado exitosamente',
    type: DevelopmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Desarrollo no encontrado' })
  @ApiResponse({ status: 400, description: 'ID inválido proporcionado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Development> {
    return this.developmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar desarrollo',
    description: 'Actualiza los datos de un desarrollo existente'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del desarrollo a actualizar',
    example: 1
  })
  @ApiBody({ 
    type: UpdateDevelopmentDto,
    description: 'Datos a actualizar del desarrollo'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Desarrollo actualizado exitosamente',
    type: DevelopmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Desarrollo no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDevelopmentDto: UpdateDevelopmentDto,
  ): Promise<Development> {
    return this.developmentService.update(id, updateDevelopmentDto);
  }

  @Patch(':id/progress')
  @ApiOperation({ 
    summary: 'Actualizar progreso del desarrollo',
    description: 'Actualiza únicamente el progreso de un desarrollo. Si se establece en 100%, el estado cambia automáticamente a COMPLETED'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del desarrollo',
    example: 1
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        progress: {
          type: 'number',
          minimum: 0,
          maximum: 100,
          description: 'Porcentaje de progreso (0-100)',
          example: 75
        }
      },
      required: ['progress']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Progreso actualizado exitosamente',
    type: DevelopmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Desarrollo no encontrado' })
  @ApiResponse({ status: 400, description: 'Valor de progreso inválido (debe estar entre 0 y 100)' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { progress: number },
  ): Promise<Development> {
    return this.developmentService.updateProgress(id, body.progress);
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Cambiar estado del desarrollo',
    description: 'Cambia el estado de un desarrollo. Si se marca como COMPLETED, automáticamente se establece la fecha de finalización y progreso al 100%'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del desarrollo',
    example: 1
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        status: {
          enum: Object.values(DevelopmentStatus),
          description: 'Nuevo estado del desarrollo',
          example: DevelopmentStatus.COMPLETED
        }
      },
      required: ['status']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado cambiado exitosamente',
    type: DevelopmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Desarrollo no encontrado' })
  @ApiResponse({ status: 400, description: 'Estado inválido proporcionado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: DevelopmentStatus },
  ): Promise<Development> {
    return this.developmentService.changeStatus(id, body.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar desarrollo',
    description: 'Elimina un desarrollo del sistema (soft delete - marca como inactivo)'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del desarrollo a eliminar',
    example: 1
  })
  @ApiResponse({ status: 204, description: 'Desarrollo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Desarrollo no encontrado' })
  @ApiResponse({ status: 400, description: 'ID inválido proporcionado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.developmentService.remove(id);
  }
} 