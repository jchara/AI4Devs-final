import { BadRequestException, Injectable } from '@nestjs/common';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { CreateDevelopmentDto, UpdateDevelopmentDto } from '../dtos';
import { Development } from '../entities/development.entity';
import { DevelopmentMetrics } from '../interfaces';
import { DevelopmentRepository } from '../repositories/development.repository';
import { DevelopmentFilters } from '../repositories/development.repository.interface';
import { BaseService } from './base.service';
import { EnvironmentRepository } from 'src/modules/infrastructure';

@Injectable()
export class DevelopmentService extends BaseService<Development> {
  constructor(
    private readonly developmentRepository: DevelopmentRepository,
    private readonly environmentRepository: EnvironmentRepository,
  ) {
    super(developmentRepository);
  }

  async findAll(): Promise<Development[]> {
    return await this.developmentRepository.findAll();
  }

  async findWithFilters(filters: DevelopmentFilters): Promise<Development[]> {
    return await this.developmentRepository.findWithFilters(filters);
  }

  async findByStatus(status: DevelopmentStatus): Promise<Development[]> {
    return await this.developmentRepository.findByStatus(status);
  }

  async findByPriority(priority: DevelopmentPriority): Promise<Development[]> {
    return await this.developmentRepository.findBy({
      priority,
    } as Partial<Development>);
  }

  async findByEnvironmentId(environmentId: number): Promise<Development[]> {
    return await this.developmentRepository.findByEnvironment(environmentId);
  }

  async findByAssignedTo(userId: number): Promise<Development[]> {
    return await this.developmentRepository.findByAssignedUser(userId);
  }

  async findByTeam(teamId: number): Promise<Development[]> {
    return await this.developmentRepository.findByTeam(teamId);
  }

  async findByEnvironment(environmentId: number): Promise<Development[]> {
    return await this.developmentRepository.findByEnvironment(environmentId);
  }

  async create(
    createDevelopmentDto: CreateDevelopmentDto,
  ): Promise<Development> {
    return await this.developmentRepository.create(createDevelopmentDto);
  }

  async update(
    id: number,
    updateDevelopmentDto: UpdateDevelopmentDto,
  ): Promise<Development> {
    return await this.developmentRepository.update(id, updateDevelopmentDto);
  }

  async getDevelopmentWithDetails(id: number): Promise<Development> {
    const development = await this.developmentRepository.findOne(id);
    if (!development) {
      throw new BadRequestException(`Development with ID ${id} not found`);
    }
    return development;
  }

  async updateProgress(id: number, progress: number): Promise<Development> {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const development = await this.findOne(id);
    development.progress = progress;
    return this.developmentRepository.update(id, development);
  }

  async updateStatus(
    id: number,
    status: DevelopmentStatus,
  ): Promise<Development> {
    const development = await this.findOne(id);
    development.status = status;
    return this.developmentRepository.update(id, development);
  }

  async getMetrics(): Promise<DevelopmentMetrics> {
    const metrics = await this.developmentRepository.getMetrics();
    const environments = await this.environmentRepository.findAll();
    const byEnvironment = environments.map((environment) => {
      if(environment.isActive){
        return {
          environment: environment.name,
          count: metrics.byEnvironment[environment.name] || 0,
        }
      }
    });

    metrics.byEnvironment = byEnvironment.reduce(
      (acc, curr) => {
        if(curr){
          acc[curr.environment] = curr.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return metrics;
  }

  async getOverdue(): Promise<Development[]> {
    const now = new Date();
    return await this.developmentRepository.findBy({
      endDate: { $lt: now },
      status: { $ne: DevelopmentStatus.COMPLETED },
    } as any);
  }

  async getDevelopmentsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Development[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return await this.developmentRepository.findBy({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    } as any);
  }

  async remove(id: number): Promise<void> {
    await this.developmentRepository.remove(id);
  }

  async changeStatus(
    id: number,
    status: DevelopmentStatus,
  ): Promise<Development> {
    const development = await this.findOne(id);
    if (!development) {
      throw new BadRequestException(`Development with ID ${id} not found`);
    }

    development.status = status;

    // Si el estado es COMPLETED, actualizar progreso y fecha de finalización
    if (status === DevelopmentStatus.COMPLETED) {
      development.progress = 100;
      development.endDate = new Date();
    }

    return this.developmentRepository.update(id, development);
  }

  async filterDevelopments(
    filters: DevelopmentFilters,
  ): Promise<Development[]> {
    return await this.developmentRepository.findWithFilters(filters);
  }
}
