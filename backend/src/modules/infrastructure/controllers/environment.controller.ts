import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EnvironmentService } from '../services/environment.service';
import { CreateEnvironmentDto, UpdateEnvironmentDto, EnvironmentResponseDto } from '../dto';

@ApiTags('environments')
@Controller('environments')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @ApiOperation({ summary: 'Obtener todos los ambientes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de ambientes',
    type: [EnvironmentResponseDto],
  })
  @Get()
  async findAll(): Promise<EnvironmentResponseDto[]> {
    const environments = await this.environmentService.findAll();
    return environments.map(environment => new EnvironmentResponseDto(environment));
  }

  @ApiOperation({ summary: 'Obtener un ambiente por ID' })
  @ApiParam({ name: 'id', description: 'ID del ambiente', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ambiente encontrado',
    type: EnvironmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ambiente no encontrado',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EnvironmentResponseDto> {
    const environment = await this.environmentService.findOne(id);
    return new EnvironmentResponseDto(environment);
  }

  @ApiOperation({ summary: 'Obtener un ambiente por nombre' })
  @ApiParam({ name: 'name', description: 'Nombre del ambiente', example: 'Producción' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ambiente encontrado',
    type: EnvironmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ambiente no encontrado',
  })
  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<EnvironmentResponseDto> {
    const environment = await this.environmentService.findByName(name);
    return new EnvironmentResponseDto(environment);
  }

  @ApiOperation({ summary: 'Obtener un ambiente con sus desarrollos' })
  @ApiParam({ name: 'id', description: 'ID del ambiente', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ambiente con desarrollos',
    type: EnvironmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ambiente no encontrado',
  })
  @Get(':id/developments')
  async findWithDevelopments(@Param('id', ParseIntPipe) id: number): Promise<EnvironmentResponseDto> {
    const environment = await this.environmentService.findWithDevelopments(id);
    return new EnvironmentResponseDto(environment);
  }

  @ApiOperation({ summary: 'Crear un nuevo ambiente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ambiente creado exitosamente',
    type: EnvironmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un ambiente con ese nombre',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnvironmentDto: CreateEnvironmentDto): Promise<EnvironmentResponseDto> {
    const environment = await this.environmentService.create(createEnvironmentDto);
    return new EnvironmentResponseDto(environment);
  }

  @ApiOperation({ summary: 'Actualizar un ambiente existente' })
  @ApiParam({ name: 'id', description: 'ID del ambiente', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ambiente actualizado exitosamente',
    type: EnvironmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ambiente no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un ambiente con ese nombre',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<EnvironmentResponseDto> {
    const environment = await this.environmentService.update(id, updateEnvironmentDto);
    return new EnvironmentResponseDto(environment);
  }

  @ApiOperation({ summary: 'Eliminar un ambiente' })
  @ApiParam({ name: 'id', description: 'ID del ambiente', example: 1 })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Ambiente eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ambiente no encontrado',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.environmentService.remove(id);
  }
} 