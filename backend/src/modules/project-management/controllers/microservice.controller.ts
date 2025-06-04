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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MicroserviceService } from '../services/microservice.service';
import { Microservice } from '../entities/microservice.entity';
import { 
  MicroserviceResponseDto,
  CreateMicroserviceDto,
  UpdateMicroserviceDto
} from '../dto/microservice-response.dto';

@ApiTags('microservices')
@Controller('microservices')
export class MicroserviceController {
  constructor(private readonly microserviceService: MicroserviceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo microservicio',
    description: 'Crea un nuevo microservicio en el sistema con todos los detalles especificados'
  })
  @ApiBody({ 
    type: CreateMicroserviceDto,
    description: 'Datos del microservicio a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Microservicio creado exitosamente',
    type: MicroserviceResponseDto
  })
  @ApiResponse({ status: 400, description: 'Error de validación en los datos enviados' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  create(@Body() createMicroserviceDto: CreateMicroserviceDto): Promise<Microservice> {
    return this.microserviceService.create(createMicroserviceDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los microservicios',
    description: 'Retorna una lista de todos los microservicios registrados en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de microservicios obtenida exitosamente',
    type: [MicroserviceResponseDto]
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findAll(): Promise<Microservice[]> {
    return this.microserviceService.findAll();
  }

  @Get('by-technology/:technology')
  @ApiOperation({ 
    summary: 'Obtener microservicios por tecnología',
    description: 'Retorna todos los microservicios que utilizan la tecnología especificada'
  })
  @ApiParam({ 
    name: 'technology', 
    type: String,
    description: 'Tecnología utilizada en los microservicios',
    example: 'NestJS'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de microservicios por tecnología obtenida exitosamente',
    type: [MicroserviceResponseDto]
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByTechnology(@Param('technology') technology: string): Promise<Microservice[]> {
    return this.microserviceService.findByTechnology(technology);
  }

  @Get('by-name/:name')
  @ApiOperation({ 
    summary: 'Obtener microservicio por nombre',
    description: 'Retorna un microservicio específico por su nombre'
  })
  @ApiParam({ 
    name: 'name', 
    type: String,
    description: 'Nombre del microservicio a buscar',
    example: 'auth-service'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Microservicio obtenido exitosamente',
    type: MicroserviceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Microservicio no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByName(@Param('name') name: string): Promise<Microservice> {
    return this.microserviceService.findByName(name);
  }

  @Get(':id/developments')
  @ApiOperation({
    summary: 'Obtener microservicio con sus desarrollos',
    description: 'Retorna un microservicio con la lista de desarrollos que lo utilizan'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del microservicio',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Microservicio con desarrollos obtenido exitosamente',
    type: MicroserviceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Microservicio no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findWithDevelopments(@Param('id', ParseIntPipe) id: number): Promise<Microservice> {
    return this.microserviceService.findWithDevelopments(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener microservicio por ID',
    description: 'Retorna un microservicio específico por su ID'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del microservicio',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Microservicio obtenido exitosamente',
    type: MicroserviceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Microservicio no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Microservice> {
    return this.microserviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar microservicio',
    description: 'Actualiza los datos de un microservicio existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del microservicio a actualizar',
    example: 1
  })
  @ApiBody({
    type: UpdateMicroserviceDto,
    description: 'Datos a actualizar del microservicio'
  })
  @ApiResponse({
    status: 200,
    description: 'Microservicio actualizado exitosamente',
    type: MicroserviceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Microservicio no encontrado' })
  @ApiResponse({ status: 400, description: 'Error de validación en los datos enviados' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMicroserviceDto: UpdateMicroserviceDto,
  ): Promise<Microservice> {
    return this.microserviceService.update(id, updateMicroserviceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar microservicio',
    description: 'Elimina un microservicio del sistema (soft delete - marca como inactivo)'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del microservicio a eliminar',
    example: 1
  })
  @ApiResponse({ status: 204, description: 'Microservicio eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Microservicio no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.microserviceService.remove(id);
  }
} 