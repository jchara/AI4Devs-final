import { BaseRepositoryInterface } from '../../../shared/repositories/base.repository.interface';
import { Development, DevelopmentStatus, DevelopmentPriority } from '../entities/development.entity';

export interface DevelopmentFilters {
  status?: DevelopmentStatus;
  priority?: DevelopmentPriority;
  environmentId?: number;
  assignedToId?: number;
  teamId?: number;
  search?: string;
}

export interface DevelopmentRepositoryInterface extends BaseRepositoryInterface<Development> {
  findWithFilters(filters: DevelopmentFilters): Promise<Development[]>;
  findByStatus(status: DevelopmentStatus): Promise<Development[]>;
  findByTeam(teamId: number): Promise<Development[]>;
  findByAssignedUser(userId: number): Promise<Development[]>;
  findByEnvironment(environmentId: number): Promise<Development[]>;
  getMetrics(): Promise<any>;
} 