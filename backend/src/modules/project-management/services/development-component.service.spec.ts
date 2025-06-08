import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentComponentService } from './development-component.service';
import { DevelopmentComponent } from '../entities/development-component.entity';
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('DevelopmentComponentService', () => {
  let service: DevelopmentComponentService;
  let repository: Repository<DevelopmentComponent>;

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
        DevelopmentComponentService,
        {
          provide: getRepositoryToken(DevelopmentComponent),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DevelopmentComponentService>(
      DevelopmentComponentService,
    );
    repository = module.get<Repository<DevelopmentComponent>>(
      getRepositoryToken(DevelopmentComponent),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByDevelopmentId', () => {
    it('should return components for a development', async () => {
      const mockComponents = [
        { id: 1, developmentId: 1 },
        { id: 2, developmentId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockComponents);

      const result = await service.findByDevelopment(1);
      expect(result).toEqual(mockComponents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { development: { id: 1 } },
      });
    });
  });

  describe('findByComponentId', () => {
    it('should return developments for a component', async () => {
      const mockComponents = [
        { id: 1, componentId: 1 },
        { id: 2, componentId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockComponents);

      const result = await service.findByComponent(1);
      expect(result).toEqual(mockComponents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { component: { id: 1 } },
      });
    });
  });

  describe('findByChangeType', () => {
    it('should return components with the specified change type', async () => {
      const mockComponents = [
        { id: 1, changeType: DevelopmentComponentChangeType.CREATED },
      ];
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockComponents as DevelopmentComponent[]);

      const result = await service.findByChangeType(
        DevelopmentComponentChangeType.CREATED,
      );

      expect(result).toEqual(mockComponents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { changeType: DevelopmentComponentChangeType.CREATED },
        relations: ['development', 'component'],
      });
    });
  });

  describe('getDevelopmentComponentWithDetails', () => {
    it('should return component with all relations', async () => {
      const mockComponent = {
        id: 1,
        development: { id: 1 },
        component: { id: 1 },
      };
      mockRepository.findOne.mockResolvedValue(mockComponent);

      const result = await service.findOne(1);
      expect(result).toEqual(mockComponent);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['development', 'component'],
      });
    });

    it('should throw NotFoundException when component not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
