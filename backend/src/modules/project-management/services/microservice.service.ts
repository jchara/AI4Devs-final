import { Injectable, NotFoundException } from '@nestjs/common';
import { MicroserviceRepository } from '../repositories/microservice.repository';
import { Microservice } from '../entities/microservice.entity';
import { CreateMicroserviceDto, UpdateMicroserviceDto } from '../dto/microservice-response.dto';

@Injectable()
export class MicroserviceService {
  constructor(private readonly microserviceRepository: MicroserviceRepository) {}

  async create(createMicroserviceDto: CreateMicroserviceDto): Promise<Microservice> {
    return this.microserviceRepository.create(createMicroserviceDto);
  }

  async findAll(): Promise<Microservice[]> {
    return this.microserviceRepository.findAll();
  }

  async findOne(id: number): Promise<Microservice> {
    const microservice = await this.microserviceRepository.findOne(id);
    if (!microservice) {
      throw new NotFoundException(`Microservice with ID ${id} not found`);
    }
    return microservice;
  }

  async findByName(name: string): Promise<Microservice> {
    const microservice = await this.microserviceRepository.findByName(name);
    if (!microservice) {
      throw new NotFoundException(`Microservice with name ${name} not found`);
    }
    return microservice;
  }

  async findByTechnology(technology: string): Promise<Microservice[]> {
    return this.microserviceRepository.findByTechnology(technology);
  }

  async findWithDevelopments(id: number): Promise<Microservice> {
    const microservice = await this.microserviceRepository.findWithDevelopments(id);
    if (!microservice) {
      throw new NotFoundException(`Microservice with ID ${id} not found`);
    }
    return microservice;
  }

  async update(id: number, updateMicroserviceDto: UpdateMicroserviceDto): Promise<Microservice> {
    await this.findOne(id); // Verificar que existe
    return this.microserviceRepository.update(id, updateMicroserviceDto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar que existe
    await this.microserviceRepository.remove(id);
  }
} 