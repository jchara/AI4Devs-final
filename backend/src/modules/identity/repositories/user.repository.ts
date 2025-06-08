import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['role', 'team'],
    });
  }

  async findByRole(roleId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { roleId, isActive: true },
      relations: ['role', 'team'],
    });
  }

  async findByTeam(teamId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { teamId, isActive: true },
      relations: ['role', 'team'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      relations: ['role', 'team'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, isActive: true },
      relations: ['role', 'team'],
    });
  }
} 