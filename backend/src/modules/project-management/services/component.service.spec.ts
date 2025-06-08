import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentService } from './component.service';
import { Component } from '../entities/component.entity';
import { ComponentType } from '../enums/component-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('ComponentService', () => {
  let service: ComponentService;
  let repository: Repository<Component>;

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
        ComponentService,
        {
          provide: getRepositoryToken(Component),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ComponentService>(ComponentService);
    repository = module.get<Repository<Component>>(getRepositoryToken(Component));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByProject', () => {
    it('should return components for a project', async () => {
      const mockComponents = [
        { id: 1, name: 'Component 1', projectId: 1 },
        { id: 2, name: 'Component 2', projectId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockComponents);

      const result = await service.findByProject(1);
      expect(result).toEqual(mockComponents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { project: { id: 1 } },
      });
    });
  });

  describe('findByType', () => {
    it('should return components of the specified type', async () => {
      const mockComponents = [
        { id: 1, name: 'Component 1', type: ComponentType.FRONTEND },
      ];
      mockRepository.find.mockResolvedValue(mockComponents);

      const result = await service.findByType(ComponentType.FRONTEND);
      expect(result).toEqual(mockComponents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: ComponentType.FRONTEND },
      });
    });
  });

  describe('findByTechnology', () => {
    it('should return components using the specified technology', async () => {
      const mockComponents = [
        { id: 1, name: 'Component 1', technology: 'React' },
      ];
      mockRepository.find.mockResolvedValue(mockComponents);

      const result = await service.findByTechnology('React');
      expect(result).toEqual(mockComponents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { technology: 'React' },
      });
    });
  });

  describe('getComponentWithDetails', () => {
    it('should return component with all relations', async () => {
      const mockComponent = {
        id: 1,
        name: 'Test Component',
        developments: [],
      };
      mockRepository.findOne.mockResolvedValue(mockComponent);

      const result = await service.getComponentWithDetails(1);
      expect(result).toEqual(mockComponent);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['project', 'developments'],
      });
    });

    it('should throw NotFoundException when component not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getComponentWithDetails(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 