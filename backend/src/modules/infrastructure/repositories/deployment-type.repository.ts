import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { DeploymentType } from '../entities/deployment-type.entity';

@Injectable()
export class DeploymentTypeRepository extends BaseRepository<DeploymentType> {
  constructor(
    @InjectRepository(DeploymentType)
    private deploymentTypeRepository: Repository<DeploymentType>,
  ) {
    super(deploymentTypeRepository);
  }

  async findByName(name: string): Promise<DeploymentType | null> {
    return this.deploymentTypeRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findAll(): Promise<DeploymentType[]> {
    return this.deploymentTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }
} 