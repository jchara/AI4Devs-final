import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectType } from '../../../shared/enums/project-type.enum';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
    super(projectRepository);
  }

  async findByName(name: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { name },
      relations: ['components', 'databases', 'developments', 'team'],
    });
  }

  async findByType(type: ProjectType): Promise<Project[]> {
    return this.projectRepository.find({
      where: { type },
      relations: ['components', 'databases', 'developments', 'team'],
    });
  }
}
