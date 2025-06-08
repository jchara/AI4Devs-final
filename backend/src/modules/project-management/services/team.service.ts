import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/team.dto';
import { Team } from '../../identity';
import { BaseService } from './base.service';
import { TeamRepository } from '../repositories';

@Injectable()
export class TeamService extends BaseService<Team> {
  constructor(private readonly teamRepository: TeamRepository) {
    super(teamRepository);
  }

  async findByName(name: string): Promise<Team | null> {
    const teams = await this.teamRepository.findByName(name);
    return teams[0] || null;
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const existingTeam = await this.findByName(createTeamDto.name);
    if (existingTeam) {
      throw new ConflictException(
        `Ya existe un equipo con el nombre ${createTeamDto.name}`,
      );
    }
    return await this.create(createTeamDto);
  }

  async updateTeam(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    if (updateTeamDto.name) {
      const existingTeam = await this.findByName(updateTeamDto.name);
      if (existingTeam && existingTeam.id !== id) {
        throw new ConflictException(
          `Ya existe un equipo con el nombre ${updateTeamDto.name}`,
        );
      }
    }
    return await this.update(id, updateTeamDto);
  }

  async getTeamWithDetails(id: number): Promise<Team> {
    const team = await this.teamRepository.findWithRelations(id);
    if (!team) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
    return team;
  }

  async findActive(): Promise<Team[]> {
    return await this.teamRepository.findActive();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findWithRelations(id);
    if (!team) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
    return team;
  }

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.findAllWithRelations();
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    if (team.users?.length > 0) {
      throw new ConflictException(
        'No se puede eliminar un equipo que tiene usuarios asignados',
      );
    }
    await this.teamRepository.remove(id);
  }
}
