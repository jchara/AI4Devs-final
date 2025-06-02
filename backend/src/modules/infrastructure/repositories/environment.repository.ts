import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Environment } from '../entities/environment.entity';

@Injectable()
export class EnvironmentRepository extends BaseRepository<Environment> {
  constructor(
    @InjectRepository(Environment)
    private environmentRepository: Repository<Environment>,
  ) {
    super(environmentRepository);
  }

  async findByName(name: string): Promise<Environment | null> {
    return this.environmentRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findAll(): Promise<Environment[]> {
    return this.environmentRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findWithDevelopments(id: number): Promise<Environment | null> {
    return this.environmentRepository.findOne({
      where: { id, isActive: true },
      relations: ['developments'],
    });
  }
} 