import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async findAll(): Promise<Development[]> {
    return this.developmentRepository
      .createQueryBuilder('development')
      .leftJoinAndSelect('development.assignedTo', 'assignedTo')
      .leftJoinAndSelect('development.team', 'team')
      .leftJoinAndSelect('development.environment', 'environment')
      .select([
        'development.id',
        'development.title',
        'development.description',
        'development.status',
        'development.priority',
        'development.startDate',
        'development.endDate',
        'development.estimatedDate',
        'development.progress',
        'development.jiraUrl',
        'development.branch',
        'development.notes',
        'development.isActive',
        'development.environmentId',
        'development.assignedToId',
        'development.teamId',
        'development.createdAt',
        'development.updatedAt',
        'development.deletedAt',
        'environment.id',
        'environment.name',
        'environment.description',
        'environment.color',
        'environment.order',
        'environment.isActive',
        'environment.createdAt',
        'environment.updatedAt',
        'environment.deletedAt',
        'assignedTo.id',
        'assignedTo.email',
        'assignedTo.firstName',
        'assignedTo.lastName',
        'assignedTo.roleId',
        'assignedTo.teamId',
        'assignedTo.isActive',
        'assignedTo.createdAt',
        'assignedTo.updatedAt',
        'assignedTo.deletedAt',
        'team.id',
        'team.name',
        'team.description',
        'team.isActive',
        'team.createdAt',
        'team.updatedAt',
        'team.deletedAt',
      ])
      .where('development.isActive = :isActive', { isActive: true })
      .orderBy('development.id', 'ASC')
      .getMany();
  }

  async findWithFilters(filters: DevelopmentFilters): Promise<Development[]> {
    const queryBuilder = this.developmentRepository
      .createQueryBuilder('development')
      .leftJoinAndSelect('development.assignedTo', 'assignedTo')
      .leftJoinAndSelect('development.team', 'team')
      .leftJoinAndSelect('development.environment', 'environment')
      .select([
        'development.id',
        'development.title',
        'development.description',
        'development.status',
        'development.priority',
        'development.startDate',
        'development.endDate',
        'development.estimatedDate',
        'development.progress',
        'development.jiraUrl',
        'development.branch',
        'development.notes',
        'development.isActive',
        'development.environmentId',
        'development.assignedToId',
        'development.teamId',
        'development.createdAt',
        'development.updatedAt',
        'development.deletedAt',
        'environment.id',
        'environment.name',
        'environment.description',
        'environment.color',
        'environment.order',
        'environment.isActive',
        'environment.createdAt',
        'environment.updatedAt',
        'environment.deletedAt',
        'assignedTo.id',
        'assignedTo.email',
        'assignedTo.firstName',
        'assignedTo.lastName',
        'assignedTo.roleId',
        'assignedTo.teamId',
        'assignedTo.isActive',
        'assignedTo.createdAt',
        'assignedTo.updatedAt',
        'assignedTo.deletedAt',
        'team.id',
        'team.name',
        'team.description',
        'team.isActive',
        'team.createdAt',
        'team.updatedAt',
        'team.deletedAt',
      ])
      .where('development.isActive = :isActive', { isActive: true });

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

    queryBuilder.orderBy('development.id', 'ASC');

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
    const inDevelopment = await this.developmentRepository.count({
      where: {
        status: In([
          DevelopmentStatus.IN_PROGRESS,
          DevelopmentStatus.PLANNING,
          DevelopmentStatus.TESTING,
        ]),
      },
    });

    const cancelled = await this.developmentRepository.count({
      where: { status: DevelopmentStatus.CANCELLED },
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

    const developments = await this.developmentRepository
      .createQueryBuilder('development')
      .leftJoinAndSelect('development.environment', 'environment')
      .where('development.isActive = :isActive', { isActive: true })
      .getMany();

    const byEnvironment: Record<string, number> = {};
    for (const dev of developments) {
      const env = dev.environment?.name || 'UNKNOWN';
      byEnvironment[env] = (byEnvironment[env] || 0) + 1;
    }

    return {
      total,
      byStatus: {
        completed,
        inDevelopment,
        cancelled,
      },
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
      byEnvironment,
    };
  }
}
