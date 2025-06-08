import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectType } from '../../../shared/enums/project-type.enum';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../services/project.service';
import { BaseController } from './base.controller';

@ApiTags('projects')
@Controller('projects')
export class ProjectController extends BaseController<Project> {
  constructor(private readonly projectService: ProjectService) {
    super(projectService);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search projects by name and type' })
  @ApiResponse({ status: 200, description: 'Return matching projects' })
  async searchProjects(
    @Query('name') name?: string,
    @Query('type') type?: ProjectType,
  ): Promise<Project[]> {
    return this.projectService.searchProjects(name, type);
  }

  @Get(':id/with-details')
  @ApiOperation({ summary: 'Get project with all related details' })
  @ApiResponse({ status: 200, description: 'Return project with details' })
  async getProjectWithDetails(@Param('id') id: number): Promise<Project> {
    return this.projectService.getProjectWithDetails(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body() createDto: CreateProjectDto): Promise<Project> {
    return this.projectService.createProject(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  async updateProject(
    @Param('id') id: number,
    @Body() updateDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProject(id, updateDto);
  }
}
