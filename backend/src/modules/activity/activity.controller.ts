import { Controller, Get, Query, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { RecentActivity } from './entities/recent-activity.entity';

@ApiTags('activities')
@Controller('api/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades recientes' })
  @ApiResponse({ status: 200, description: 'Lista de actividades obtenida exitosamente' })
  async findAll(@Query('limit', ParseIntPipe) limit: number = 20): Promise<RecentActivity[]> {
    return this.activityService.findAll(limit);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Obtener actividades recientes (alias)' })
  @ApiResponse({ status: 200, description: 'Lista de actividades recientes obtenida exitosamente' })
  async findRecent(@Query('limit', ParseIntPipe) limit: number = 10): Promise<RecentActivity[]> {
    return this.activityService.findAll(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RecentActivity> {
    return this.activityService.findOne(id);
  }

  @Get('development/:developmentId')
  @ApiOperation({ summary: 'Obtener actividades de un desarrollo específico' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del desarrollo obtenida exitosamente' })
  async findByDevelopment(
    @Param('developmentId', ParseIntPipe) developmentId: number,
    @Query('limit', ParseIntPipe) limit: number = 10
  ): Promise<RecentActivity[]> {
    return this.activityService.findByDevelopment(developmentId, limit);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener actividades de un usuario específico' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del usuario obtenida exitosamente' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', ParseIntPipe) limit: number = 10
  ): Promise<RecentActivity[]> {
    return this.activityService.findByUser(userId, limit);
  }
}
