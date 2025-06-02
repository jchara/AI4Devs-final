import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Team } from '../entities/team.entity';

@Injectable()
export class TeamRepository extends BaseRepository<Team> {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {
    super(teamRepository);
  }

  async findByName(name: string): Promise<Team | null> {
    return this.teamRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findWithUsers(id: number): Promise<Team | null> {
    return this.teamRepository.findOne({
      where: { id, isActive: true },
      relations: ['users'],
    });
  }
} 