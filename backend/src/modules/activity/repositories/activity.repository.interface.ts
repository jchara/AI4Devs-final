import { BaseRepositoryInterface } from '../../../shared/repositories/base.repository.interface';
import { RecentActivity, ActivityType } from '../entities/recent-activity.entity';

export interface ActivityRepositoryInterface extends BaseRepositoryInterface<RecentActivity> {
  findByType(type: ActivityType): Promise<RecentActivity[]>;
  findByDevelopment(developmentId: number): Promise<RecentActivity[]>;
  findByUser(userId: number): Promise<RecentActivity[]>;
  findRecent(limit?: number): Promise<RecentActivity[]>;
} 