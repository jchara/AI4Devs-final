import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/team.dto';
import { Team } from '../../identity';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo equipo',
    description: 'Crea un nuevo equipo en el sistema',
  })
  @ApiBody({
    type: CreateTeamDto,
    description: 'Datos del equipo a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Equipo creado exitosamente',
    type: Team,
  })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  @ApiResponse({ status: 409, description: 'El nombre del equipo ya existe' })
  create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.createTeam(createTeamDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los equipos',
    description: 'Retorna una lista completa de todos los equipos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipos obtenida exitosamente',
    type: [Team],
  })
  findAll(): Promise<Team[]> {
    return this.teamService.findAll();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Obtener equipos activos',
    description: 'Retorna solo los equipos activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipos activos obtenida exitosamente',
    type: [Team],
  })
  findActive(): Promise<Team[]> {
    return this.teamService.findActive();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener equipo por ID',
    description: 'Retorna los detalles completos de un equipo específico',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del equipo',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Equipo encontrado exitosamente',
    type: Team,
  })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar equipo',
    description: 'Actualiza los datos de un equipo existente',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del equipo a actualizar',
    example: 1,
  })
  @ApiBody({
    type: UpdateTeamDto,
    description: 'Datos a actualizar del equipo',
  })
  @ApiResponse({
    status: 200,
    description: 'Equipo actualizado exitosamente',
    type: Team,
  })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  @ApiResponse({ status: 409, description: 'El nombre del equipo ya existe' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar equipo',
    description: 'Elimina un equipo del sistema',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del equipo a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Equipo eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar un equipo con usuarios asignados',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teamService.remove(id);
  }
} 