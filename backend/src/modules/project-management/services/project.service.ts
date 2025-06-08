import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectType } from '../../../shared/enums/project-type.enum';
import { CreateProjectDto, UpdateProjectDto } from '../dtos';
import { Project } from '../entities/project.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { BaseService } from './base.service';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(private readonly projectRepository: ProjectRepository) {
    super(projectRepository);
  }

  async findByName(name: string): Promise<Project | null> {
    return await this.projectRepository
      .findBy({ name } as Partial<Project>)
      .then((projects) => projects[0] || null);
  }

  async findByType(type: ProjectType): Promise<Project[]> {
    return await this.projectRepository.findBy({ type } as Partial<Project>);
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const existingProject = await this.findByName(createProjectDto.name);
    if (existingProject) {
      throw new BadRequestException(
        `Project with name ${createProjectDto.name} already exists`,
      );
    }
    return await this.create(createProjectDto);
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    if (updateProjectDto.name) {
      const existingProject = await this.findByName(updateProjectDto.name);
      if (existingProject && existingProject.id !== id) {
        throw new BadRequestException(
          `Project with name ${updateProjectDto.name} already exists`,
        );
      }
    }
    return await this.update(id, updateProjectDto);
  }

  async searchProjects(name?: string, type?: ProjectType): Promise<Project[]> {
    const filters: Partial<Project> = {};
    if (name) {
      filters.name = name;
    }
    if (type) {
      filters.type = type;
    }
    return await this.projectRepository.findBy(filters);
  }

  async getProjectWithDetails(id: number): Promise<Project> {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async findActive(): Promise<Project[]> {
    return await this.projectRepository.findBy({
      isActive: true,
    } as Partial<Project>);
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }
}
