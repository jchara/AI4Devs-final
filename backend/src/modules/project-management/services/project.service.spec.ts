import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';
import { ProjectType } from '../../../shared/enums/project-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('ProjectService', () => {
  let service: ProjectService;
  let repository: Repository<Project>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {
    it('should return projects matching the name', async () => {
      const mockProjects = [
        { id: 1, name: 'Test Project' },
        { id: 2, name: 'Test Project 2' },
      ];
      mockRepository.find.mockResolvedValue(mockProjects);

      const result = await service.findByName('Test');
      expect(result).toEqual(mockProjects);
      expect(repository.find).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
    });
  });

  describe('findByType', () => {
    it('should return projects of the specified type', async () => {
      const mockProjects = [
        { id: 1, name: 'Project 1', type: ProjectType.BACKEND },
      ];
      mockRepository.find.mockResolvedValue(mockProjects);

      const result = await service.findByType(ProjectType.BACKEND);
      expect(result).toEqual(mockProjects);
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: ProjectType.BACKEND },
      });
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createDto = {
        name: 'New Project',
        type: ProjectType.BACKEND,
        description: 'Test project',
      };
      const mockProject = { id: 1, ...createDto };
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(createDto);
      expect(result).toEqual(mockProject);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('getProjectWithDetails', () => {
    it('should return project with all relations', async () => {
      const mockProject = {
        id: 1,
        name: 'Test Project',
        components: [],
        developments: [],
      };
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getProjectWithDetails(1);
      expect(result).toEqual(mockProject);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['components', 'developments'],
      });
    });

    it('should throw NotFoundException when project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProjectWithDetails(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 