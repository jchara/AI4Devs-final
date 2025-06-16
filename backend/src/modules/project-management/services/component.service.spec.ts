import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ComponentService } from './component.service';
// import { Component } from '../entities/component.entity'; // Unused import
import { ComponentRepository } from '../repositories/component.repository';
import { ComponentType } from '../../../shared/enums/component-type.enum';
import { CreateComponentDto, UpdateComponentDto } from '../dtos/component.dto';

// Test environment variables
const TEST_COMPONENT_NAME = process.env.TEST_COMPONENT_NAME || 'Test Component';
const TEST_COMPONENT_DESCRIPTION = process.env.TEST_COMPONENT_DESCRIPTION || 'Test component description';
const TEST_COMPONENT_TECHNOLOGY = process.env.TEST_COMPONENT_TECHNOLOGY || 'Node.js';
const TEST_PROJECT_ID = parseInt(process.env.TEST_PROJECT_ID || '1');

describe('ComponentService', () => {
  let service: ComponentService;
  let repository: ComponentRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBy: jest.fn(),
    findByProject: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentService,
        {
          provide: ComponentRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ComponentService>(ComponentService);
    repository = module.get<ComponentRepository>(ComponentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all components', async () => {
      const mockComponents = [
        { id: 1, name: 'Component 1', type: ComponentType.MICROSERVICE },
        { id: 2, name: 'Component 2', type: ComponentType.MICROFRONTEND },
      ];
      mockRepository.findAll.mockResolvedValue(mockComponents);

      const result = await service.findAll();
      expect(result).toEqual(mockComponents);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return component when found', async () => {
      const mockComponent = { id: 1, name: TEST_COMPONENT_NAME, type: ComponentType.MICROSERVICE };
      mockRepository.findOne.mockResolvedValue(mockComponent);

      const result = await service.findOne(1);
      expect(result).toEqual(mockComponent);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when component not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Component with ID 999 not found');
    });
  });

  describe('findByProject', () => {
    it('should return components for specific project', async () => {
      const mockComponents = [
        { id: 1, name: 'Component 1', projectId: TEST_PROJECT_ID },
        { id: 2, name: 'Component 2', projectId: TEST_PROJECT_ID },
      ];
      mockRepository.findByProject.mockResolvedValue(mockComponents);

      const result = await service.findByProject(TEST_PROJECT_ID);
      expect(result).toEqual(mockComponents);
      expect(repository.findByProject).toHaveBeenCalledWith(TEST_PROJECT_ID);
    });
  });

  describe('findByType', () => {
    it('should return components of specific type', async () => {
      const mockComponents = [
        { id: 1, name: 'Service 1', type: ComponentType.MICROSERVICE },
        { id: 2, name: 'Service 2', type: ComponentType.MICROSERVICE },
      ];
      mockRepository.findBy.mockResolvedValue(mockComponents);

      const result = await service.findByType(ComponentType.MICROSERVICE);
      expect(result).toEqual(mockComponents);
      expect(repository.findBy).toHaveBeenCalledWith({ type: ComponentType.MICROSERVICE });
    });
  });

  describe('findByVersion', () => {
    it('should return components with specific version', async () => {
      const mockComponents = [
        { id: 1, name: 'Component 1', version: '1.0.0' },
      ];
      mockRepository.findBy.mockResolvedValue(mockComponents);

      const result = await service.findByVersion('1.0.0');
      expect(result).toEqual(mockComponents);
      expect(repository.findBy).toHaveBeenCalledWith({ version: '1.0.0' });
    });

    it('should throw BadRequestException for invalid version format', async () => {
      await expect(service.findByVersion('invalid')).rejects.toThrow(BadRequestException);
      await expect(service.findByVersion('invalid')).rejects.toThrow('Version must be in format x.y.z');
    });

    it('should accept valid version formats', async () => {
      mockRepository.findBy.mockResolvedValue([]);
      
      await service.findByVersion('1.0.0');
      await service.findByVersion('10.25.99');
      
      expect(repository.findBy).toHaveBeenCalledTimes(2);
    });
  });

  describe('findActive', () => {
    it('should return only active components', async () => {
      const mockComponents = [
        { id: 1, name: 'Active Component', isActive: true },
      ];
      mockRepository.findBy.mockResolvedValue(mockComponents);

      const result = await service.findActive();
      expect(result).toEqual(mockComponents);
      expect(repository.findBy).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('createComponent', () => {
    it('should create component with valid type', async () => {
      const createDto: CreateComponentDto = {
        name: TEST_COMPONENT_NAME,
        type: ComponentType.MICROSERVICE,
        description: TEST_COMPONENT_DESCRIPTION,
        technology: TEST_COMPONENT_TECHNOLOGY,
        isActive: true,
        projectId: TEST_PROJECT_ID,
      };
      const mockComponent = { id: 1, ...createDto };
      mockRepository.create.mockResolvedValue(mockComponent);

      const result = await service.createComponent(createDto);
      expect(result).toEqual(mockComponent);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException for invalid component type', async () => {
      const createDto = {
        name: TEST_COMPONENT_NAME,
        type: 'INVALID_TYPE' as ComponentType,
        description: TEST_COMPONENT_DESCRIPTION,
        technology: TEST_COMPONENT_TECHNOLOGY,
        isActive: true,
        projectId: TEST_PROJECT_ID,
      };

      await expect(service.createComponent(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.createComponent(createDto)).rejects.toThrow('Invalid component type: INVALID_TYPE');
    });
  });

  describe('updateComponent', () => {
    it('should update component with valid data', async () => {
      const updateDto: UpdateComponentDto = {
        name: 'Updated Component',
        type: ComponentType.MICROFRONTEND,
      };
      const existingComponent = { id: 1, name: 'Old Component', type: ComponentType.MICROSERVICE };
      const updatedComponent = { ...existingComponent, ...updateDto };
      
      mockRepository.findOne.mockResolvedValue(existingComponent);
      mockRepository.update.mockResolvedValue(updatedComponent);

      const result = await service.updateComponent(1, updateDto);
      expect(result).toEqual(updatedComponent);
      expect(repository.update).toHaveBeenCalledWith(1, expect.objectContaining(updateDto));
    });

    it('should throw BadRequestException for invalid component type in update', async () => {
      const updateDto = {
        name: 'Updated Component',
        type: 'INVALID_TYPE' as ComponentType,
      };

      await expect(service.updateComponent(1, updateDto)).rejects.toThrow(BadRequestException);
      await expect(service.updateComponent(1, updateDto)).rejects.toThrow('Invalid component type: INVALID_TYPE');
    });
  });

  describe('getComponentWithDetails', () => {
    it('should return component with details when found', async () => {
      const mockComponent = { id: 1, name: TEST_COMPONENT_NAME, type: ComponentType.MICROSERVICE };
      mockRepository.findOne.mockResolvedValue(mockComponent);

      const result = await service.getComponentWithDetails(1);
      expect(result).toEqual(mockComponent);
    });

    it('should throw NotFoundException when component not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getComponentWithDetails(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete component', async () => {
      mockRepository.remove.mockResolvedValue(undefined);

      await service.delete(1);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('restore', () => {
    it('should restore component by setting isActive to true', async () => {
      mockRepository.update.mockResolvedValue({ id: 1, isActive: true });

      await service.restore(1);
      expect(repository.update).toHaveBeenCalledWith(1, { isActive: true });
    });
  });
}); 