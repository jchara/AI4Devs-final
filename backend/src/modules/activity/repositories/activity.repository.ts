import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { RecentActivity, ActivityType } from '../entities/recent-activity.entity';
import { ActivityRepositoryInterface } from './activity.repository.interface';

@Injectable()
export class ActivityRepository extends BaseRepository<RecentActivity> implements ActivityRepositoryInterface {
  constructor(
    @InjectRepository(RecentActivity)
    private activityRepository: Repository<RecentActivity>,
  ) {
    super(activityRepository);
  }

  async findByType(type: ActivityType): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { type, isActive: true },
      relations: ['development', 'performedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDevelopment(developmentId: number): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { developmentId, isActive: true },
      relations: ['development', 'performedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { performedById: userId, isActive: true },
      relations: ['development', 'performedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRecent(limit: number = 20): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { isActive: true },
      relations: ['development', 'performedBy'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findAll(): Promise<RecentActivity[]> {
    return this.activityRepository.find({
      where: { isActive: true },
      relations: ['development', 'performedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RecentActivity | null> {
    return this.activityRepository.findOne({
      where: { id, isActive: true },
      relations: ['development', 'performedBy'],
    });
  }
} 