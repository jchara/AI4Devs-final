import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { DevelopmentMicroservice } from '../entities/development-microservice.entity';

@Injectable()
export class DevelopmentMicroserviceRepository extends BaseRepository<DevelopmentMicroservice> {
  constructor(
    @InjectRepository(DevelopmentMicroservice)
    private devMicroRepository: Repository<DevelopmentMicroservice>,
  ) {
    super(devMicroRepository);
  }

  async findByDevelopment(developmentId: number): Promise<DevelopmentMicroservice[]> {
    return this.devMicroRepository.find({
      where: { developmentId, isActive: true },
      relations: ['microservice'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByMicroservice(microserviceId: number): Promise<DevelopmentMicroservice[]> {
    return this.devMicroRepository.find({
      where: { microserviceId, isActive: true },
      relations: ['development'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDevelopmentAndMicroservice(
    developmentId: number,
    microserviceId: number,
  ): Promise<DevelopmentMicroservice | null> {
    return this.devMicroRepository.findOne({
      where: { developmentId, microserviceId, isActive: true },
      relations: ['development', 'microservice'],
    });
  }

  async findAll(): Promise<DevelopmentMicroservice[]> {
    return this.devMicroRepository.find({
      where: { isActive: true },
      relations: ['development', 'microservice'],
      order: { createdAt: 'DESC' },
    });
  }
} 