import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Development } from '../entities/development.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { DevelopmentFilters } from './development.repository.interface';
import { DevelopmentMetrics } from '../interfaces';

@Injectable()
export class DevelopmentRepository extends BaseRepository<Development> {
  constructor(
    @InjectRepository(Development)
    private readonly developmentRepository: Repository<Development>,
  ) {
    super(developmentRepository);
  }

  async findWithFilters(filters: DevelopmentFilters): Promise<Development[]> {
    const queryBuilder = this.developmentRepository
      .createQueryBuilder('development')
      .leftJoinAndSelect('development.assignedTo', 'assignedTo')
      .leftJoinAndSelect('development.team', 'team')
      .leftJoinAndSelect('development.environment', 'environment');

    if (filters.status) {
      queryBuilder.andWhere('development.status = :status', {
        status: filters.status,
      });
    }

    if (filters.priority) {
      queryBuilder.andWhere('development.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters.environmentId) {
      queryBuilder.andWhere('development.environmentId = :environmentId', {
        environmentId: filters.environmentId,
      });
    }

    if (filters.assignedToId) {
      queryBuilder.andWhere('development.assignedToId = :assignedToId', {
        assignedToId: filters.assignedToId,
      });
    }

    if (filters.teamId) {
      queryBuilder.andWhere('development.teamId = :teamId', {
        teamId: filters.teamId,
      });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(development.title ILIKE :search OR development.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return queryBuilder.getMany();
  }

  async findByStatus(status: DevelopmentStatus): Promise<Development[]> {
    return this.findBy({ status } as Partial<Development>);
  }

  async findByTeam(teamId: number): Promise<Development[]> {
    return this.findBy({ teamId } as Partial<Development>);
  }

  async findByAssignedUser(userId: number): Promise<Development[]> {
    return this.findBy({ assignedToId: userId } as Partial<Development>);
  }

  async findByEnvironment(environmentId: number): Promise<Development[]> {
    return this.findBy({ environmentId } as Partial<Development>);
  }

  async getMetrics(): Promise<DevelopmentMetrics> {
    const total = await this.developmentRepository.count();
    const completed = await this.developmentRepository.count({
      where: { status: DevelopmentStatus.COMPLETED },
    });
    const inProgress = await this.developmentRepository.count({
      where: { status: DevelopmentStatus.IN_PROGRESS },
    });
    const planning = await this.developmentRepository.count({
      where: { status: DevelopmentStatus.PLANNING },
    });
    const testing = await this.developmentRepository.count({
      where: { status: DevelopmentStatus.TESTING },
    });

    const highPriority = await this.developmentRepository.count({
      where: { priority: DevelopmentPriority.HIGH },
    });
    const mediumPriority = await this.developmentRepository.count({
      where: { priority: DevelopmentPriority.MEDIUM },
    });
    const lowPriority = await this.developmentRepository.count({
      where: { priority: DevelopmentPriority.LOW },
    });

    return {
      total,
      byStatus: {
        completed,
        inProgress,
        planning,
        testing,
      },
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    };
  }
}
