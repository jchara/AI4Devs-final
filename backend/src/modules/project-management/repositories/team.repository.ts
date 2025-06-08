import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../identity';
import { BaseRepository } from '../../../shared/repositories/base.repository';

@Injectable()
export class TeamRepository extends BaseRepository<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {
    super(teamRepository);
  }

  async findByName(name: string): Promise<Team[]> {
    return this.findBy({ name } as Partial<Team>);
  }

  async findActive(): Promise<Team[]> {
    return this.findBy({ isActive: true } as Partial<Team>);
  }

  async findWithRelations(id: number): Promise<Team | null> {
    return this.teamRepository.findOne({
      where: { id },
      relations: ['users', 'developments', 'developments.project'],
    });
  }

  async findAllWithRelations(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: ['users', 'developments'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.teamRepository.delete(id);
  }
} 