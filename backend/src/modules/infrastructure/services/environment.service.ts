import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EnvironmentRepository } from '../repositories/environment.repository';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from '../dto';
import { Environment } from '../entities/environment.entity';

@Injectable()
export class EnvironmentService {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async findAll(): Promise<Environment[]> {
    return this.environmentRepository.findAll();
  }

  async findOne(id: number): Promise<Environment> {
    const environment = await this.environmentRepository.findOne(id);
    if (!environment) {
      throw new NotFoundException(`Ambiente con ID ${id} no encontrado`);
    }
    return environment;
  }

  async findByName(name: string): Promise<Environment> {
    const environment = await this.environmentRepository.findByName(name);
    if (!environment) {
      throw new NotFoundException(`Ambiente con nombre ${name} no encontrado`);
    }
    return environment;
  }

  async findWithDevelopments(id: number): Promise<Environment> {
    const environment = await this.environmentRepository.findWithDevelopments(id);
    if (!environment) {
      throw new NotFoundException(`Ambiente con ID ${id} no encontrado`);
    }
    return environment;
  }

  async create(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
    // Verificar si ya existe un ambiente con el mismo nombre
    const existingEnvironment = await this.environmentRepository.findByName(createEnvironmentDto.name);
    if (existingEnvironment) {
      throw new ConflictException(`Ya existe un ambiente con el nombre ${createEnvironmentDto.name}`);
    }

    return this.environmentRepository.create(createEnvironmentDto);
  }

  async update(id: number, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment> {
    // Verificar si existe el ambiente
    await this.findOne(id);

    // Verificar si se intenta actualizar el nombre y si ya existe un ambiente con ese nombre
    if (updateEnvironmentDto.name) {
      const existingEnvironment = await this.environmentRepository.findByName(updateEnvironmentDto.name);
      if (existingEnvironment && existingEnvironment.id !== id) {
        throw new ConflictException(`Ya existe un ambiente con el nombre ${updateEnvironmentDto.name}`);
      }
    }

    return this.environmentRepository.update(id, updateEnvironmentDto);
  }

  async remove(id: number): Promise<void> {
    // Verificar si existe el ambiente
    await this.findOne(id);
    
    // Eliminar el ambiente (marcarlo como inactivo)
    await this.environmentRepository.remove(id);
  }
} 