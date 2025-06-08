import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';
import { ProjectType } from '../enums/project-type.enum';
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
        { id: 1, name: 'Project 1', type: ProjectType.INTERNAL },
      ];
      mockRepository.find.mockResolvedValue(mockProjects);

      const result = await service.findByType(ProjectType.INTERNAL);
      expect(result).toEqual(mockProjects);
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: ProjectType.INTERNAL },
      });
    });
  });

  describe('validateUniqueName', () => {
    it('should return true for unique name', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUniqueName('Unique Project');
      expect(result).toBe(true);
    });

    it('should return false for duplicate name', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1, name: 'Existing Project' });

      const result = await service.validateUniqueName('Existing Project');
      expect(result).toBe(false);
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