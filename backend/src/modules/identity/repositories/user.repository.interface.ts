import { BaseRepositoryInterface } from '../../../shared/repositories/base.repository.interface';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
  findByEmail(email: string): Promise<User | null>;
  findByRole(roleId: number): Promise<User[]>;
  findByTeam(teamId: number): Promise<User[]>;
} 