import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { Project } from '../entities/project.entity';

describe('BaseService', () => {
  let service: BaseService<Project>;
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
        BaseService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BaseService<Project>>(BaseService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of entities', async () => {
      const mockProjects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ];
      mockRepository.find.mockResolvedValue(mockProjects);

      const result = await service.findAll();
      expect(result).toEqual(mockProjects);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      const mockProject = { id: 1, name: 'Project 1' };
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProject);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('create', () => {
    it('should create and return a new entity', async () => {
      const createDto = { name: 'New Project' };
      const mockProject = { id: 1, ...createDto };
      mockRepository.create.mockReturnValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(createDto);
      expect(result).toEqual(mockProject);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('update', () => {
    it('should update and return the entity', async () => {
      const updateDto = { name: 'Updated Project' };
      const mockProject = { id: 1, ...updateDto };
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(mockProject);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('delete', () => {
    it('should delete the entity', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('softDelete', () => {
    it('should soft delete the entity', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.softDelete(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('restore', () => {
    it('should restore the entity', async () => {
      mockRepository.restore.mockResolvedValue({ affected: 1 });

      await service.restore(1);
      expect(repository.restore).toHaveBeenCalledWith(1);
    });
  });
}); 