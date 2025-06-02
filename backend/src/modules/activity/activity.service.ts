import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { RecentActivity, ActivityType } from './entities/recent-activity.entity';

export interface CreateActivityDto {
  type: ActivityType;
  description: string;
  developmentId?: number;
  metadata?: any;
  performedById?: number;
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(RecentActivity)
    private activityRepository: Repository<RecentActivity>,
  ) {}

  async findAll(limit: number = 20): Promise<RecentActivity[]> {
    const options: FindManyOptions<RecentActivity> = {
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
    };

    return this.activityRepository.find(options);
  }

  async findOne(id: number): Promise<RecentActivity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async create(activityData: CreateActivityDto): Promise<RecentActivity> {
    const activity = this.activityRepository.create(activityData);
    return this.activityRepository.save(activity);
  }

  async findByDevelopment(developmentId: number, limit: number = 10): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { developmentId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['performedBy', 'performedBy.role', 'performedBy.team'],
    });
  }

  async findByUser(userId: number, limit: number = 10): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { performedById: userId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
    });
  }

  async logDevelopmentCreated(developmentId: number, title: string, performedById?: number): Promise<RecentActivity> {
    return this.create({
      type: ActivityType.DEVELOPMENT_CREATED,
      description: `Nuevo desarrollo creado: ${title}`,
      developmentId,
      performedById,
    });
  }

  async logStatusChanged(developmentId: number, title: string, oldStatus: string, newStatus: string, performedById?: number): Promise<RecentActivity> {
    return this.create({
      type: ActivityType.STATUS_CHANGED,
      description: `Estado cambiado de ${oldStatus} a ${newStatus} en: ${title}`,
      developmentId,
      metadata: { oldStatus, newStatus },
      performedById,
    });
  }

  async logProgressUpdated(developmentId: number, title: string, progress: number, performedById?: number): Promise<RecentActivity> {
    return this.create({
      type: ActivityType.PROGRESS_UPDATED,
      description: `Progreso actualizado al ${progress}% en: ${title}`,
      developmentId,
      metadata: { progress },
      performedById,
    });
  }
}
