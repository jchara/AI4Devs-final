import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
      where: { name, isActive: true, deletedAt: IsNull() },
    });
  }

  async findAll(): Promise<Environment[]> {
    return this.environmentRepository.find({
      where: { deletedAt: IsNull() },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findWithDevelopments(id: number): Promise<Environment | null> {
    return this.environmentRepository.findOne({
      where: { id, isActive: true, deletedAt: IsNull() },
      relations: ['developments'],
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.environmentRepository.update(
      { id },
      { deletedAt: new Date() }
    );
  }
} 