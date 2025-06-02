import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Microservice } from '../entities/microservice.entity';

@Injectable()
export class MicroserviceRepository extends BaseRepository<Microservice> {
  constructor(
    @InjectRepository(Microservice)
    private microserviceRepository: Repository<Microservice>,
  ) {
    super(microserviceRepository);
  }

  async findByName(name: string): Promise<Microservice | null> {
    return this.microserviceRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findByTechnology(technology: string): Promise<Microservice[]> {
    return this.microserviceRepository.find({
      where: { technology, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findAll(): Promise<Microservice[]> {
    return this.microserviceRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findWithDevelopments(id: number): Promise<Microservice | null> {
    return this.microserviceRepository.findOne({
      where: { id, isActive: true },
      relations: ['developmentMicroservices', 'developmentMicroservices.development'],
    });
  }
} 