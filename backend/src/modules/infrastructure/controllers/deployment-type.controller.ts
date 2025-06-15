import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { DeploymentTypeRepository } from '../repositories/deployment-type.repository';
import { DeploymentType } from '../entities/deployment-type.entity';

@ApiTags('deployment-types')
@Controller('deployment-types')
export class DeploymentTypeController {
  constructor(
    private readonly deploymentTypeRepository: DeploymentTypeRepository,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de despliegue',
    description: 'Retorna una lista completa de todos los tipos de despliegue',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de despliegue obtenida exitosamente',
    type: [DeploymentType],
  })
  findAll(): Promise<DeploymentType[]> {
    return this.deploymentTypeRepository.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener tipo de despliegue por ID',
    description: 'Retorna los detalles de un tipo de despliegue específico',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del tipo de despliegue',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de despliegue encontrado exitosamente',
    type: DeploymentType,
  })
  @ApiResponse({ status: 404, description: 'Tipo de despliegue no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<DeploymentType> {
    const deploymentType = await this.deploymentTypeRepository.findOne(id);
    if (!deploymentType) {
      throw new Error(`Deployment type with ID ${id} not found`);
    }
    return deploymentType;
  }
} 