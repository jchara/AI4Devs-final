import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { UpcomingDeployment, DeploymentStatus } from '../entities/upcoming-deployment.entity';

@Injectable()
export class UpcomingDeploymentRepository extends BaseRepository<UpcomingDeployment> {
  constructor(
    @InjectRepository(UpcomingDeployment)
    private deploymentRepository: Repository<UpcomingDeployment>,
  ) {
    super(deploymentRepository);
  }

  async findByStatus(status: DeploymentStatus): Promise<UpcomingDeployment[]> {
    return this.deploymentRepository.find({
      where: { status, isActive: true },
      relations: ['development', 'environment', 'deployedBy', 'deploymentType'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findByEnvironment(environmentId: number): Promise<UpcomingDeployment[]> {
    return this.deploymentRepository.find({
      where: { environmentId, isActive: true },
      relations: ['development', 'environment', 'deployedBy', 'deploymentType'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findByDevelopment(developmentId: number): Promise<UpcomingDeployment[]> {
    return this.deploymentRepository.find({
      where: { developmentId, isActive: true },
      relations: ['development', 'environment', 'deployedBy', 'deploymentType'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findByUser(userId: number): Promise<UpcomingDeployment[]> {
    return this.deploymentRepository.find({
      where: { deployedById: userId, isActive: true },
      relations: ['development', 'environment', 'deployedBy', 'deploymentType'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findUpcoming(): Promise<UpcomingDeployment[]> {
    return this.deploymentRepository
      .createQueryBuilder('deployment')
      .leftJoinAndSelect('deployment.development', 'development')
      .leftJoinAndSelect('deployment.environment', 'environment')
      .leftJoinAndSelect('deployment.deployedBy', 'deployedBy')
      .leftJoinAndSelect('deployment.deploymentType', 'deploymentType')
      .where('deployment.isActive = :isActive', { isActive: true })
      .andWhere('deployment.status IN (:...statuses)', { 
        statuses: [DeploymentStatus.SCHEDULED, DeploymentStatus.IN_PROGRESS] 
      })
      .andWhere('deployment.scheduledDate >= :now', { now: new Date() })
      .orderBy('deployment.scheduledDate', 'ASC')
      .getMany();
  }

  async findAll(): Promise<UpcomingDeployment[]> {
    return this.deploymentRepository.find({
      where: { isActive: true },
      relations: ['development', 'environment', 'deployedBy', 'deploymentType'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<UpcomingDeployment | null> {
    return this.deploymentRepository.findOne({
      where: { id, isActive: true },
      relations: ['development', 'environment', 'deployedBy', 'deploymentType'],
    });
  }
} 