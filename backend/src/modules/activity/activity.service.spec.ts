import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { RecentActivity, ActivityType } from './entities/recent-activity.entity';
import { createTestModule, createMockRepository } from '../../test/test-module.factory';
import { getTestConfig, logTestConfig } from '../../test/test-config.helper';

describe('ActivityService', () => {
  let service: ActivityService;
  let repository: Repository<RecentActivity>;
  let mockRepository: ReturnType<typeof createMockRepository>;

  beforeAll(() => {
    // Log test configuration
    logTestConfig();
  });

  beforeEach(async () => {
    const testConfig = getTestConfig();
    
    if (testConfig.useMocks) {
      // Unit tests with mocks
      mockRepository = createMockRepository();
      
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ActivityService,
          {
            provide: getRepositoryToken(RecentActivity),
            useValue: mockRepository,
          },
        ],
      }).compile();

      service = module.get<ActivityService>(ActivityService);
      repository = module.get<Repository<RecentActivity>>(getRepositoryToken(RecentActivity));
    } else {
      // Integration tests with real database
      const moduleBuilder = await createTestModule([
        ActivityService,
      ]);
      
      const module: TestingModule = await moduleBuilder.compile();
      service = module.get<ActivityService>(ActivityService);
      repository = module.get<Repository<RecentActivity>>(getRepositoryToken(RecentActivity));
    }
  });

  afterEach(() => {
    const testConfig = getTestConfig();
    if (testConfig.useMocks && mockRepository) {
      jest.clearAllMocks();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return activities with default limit', async () => {
      const testConfig = getTestConfig();
      const mockActivities = [
        { id: 1, type: ActivityType.DEVELOPMENT_CREATED, description: 'Test activity' },
        { id: 2, type: ActivityType.STATUS_CHANGED, description: 'Another activity' },
      ];

      if (testConfig.useMocks) {
        mockRepository.find.mockResolvedValue(mockActivities);
      }

      const result = await service.findAll();

      if (testConfig.useMocks) {
        expect(result).toEqual(mockActivities);
        expect(mockRepository.find).toHaveBeenCalledWith({
          order: { createdAt: 'DESC' },
          take: 20,
          relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
        });
      } else {
        // For integration tests, just verify the service works
        expect(Array.isArray(result)).toBe(true);
      }
    });

    it('should return activities with custom limit', async () => {
      const testConfig = getTestConfig();
      const mockActivities = [{ id: 1, type: ActivityType.DEVELOPMENT_CREATED, description: 'Test' }];

      if (testConfig.useMocks) {
        mockRepository.find.mockResolvedValue(mockActivities);
      }

      await service.findAll(5);

      if (testConfig.useMocks) {
        expect(mockRepository.find).toHaveBeenCalledWith({
          order: { createdAt: 'DESC' },
          take: 5,
          relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
        });
      }
    });
  });

  describe('findOne', () => {
    it('should return activity when found', async () => {
      const testConfig = getTestConfig();
      const mockActivity = { id: 1, type: ActivityType.DEVELOPMENT_CREATED, description: 'Test' };

      if (testConfig.useMocks) {
        mockRepository.findOne.mockResolvedValue(mockActivity);
        
        const result = await service.findOne(1);
        expect(result).toEqual(mockActivity);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
        });
      } else {
        // For integration tests, we need to create a real activity first
        const createDto = {
          type: ActivityType.DEVELOPMENT_CREATED,
          description: 'Test activity for integration',
        };
        const created = await service.create(createDto);
        const result = await service.findOne(created.id);
        expect(result).toBeDefined();
        expect(result.id).toBe(created.id);
      }
    });

    it('should throw NotFoundException when activity not found', async () => {
      const testConfig = getTestConfig();

      if (testConfig.useMocks) {
        mockRepository.findOne.mockResolvedValue(null);
      }

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save activity', async () => {
      const testConfig = getTestConfig();
      const createDto = {
        type: ActivityType.DEVELOPMENT_CREATED,
        description: 'New development created',
        developmentId: 1,
        performedById: 1,
      };

      if (testConfig.useMocks) {
        const mockActivity = { id: 1, ...createDto };
        mockRepository.create.mockReturnValue(mockActivity);
        mockRepository.save.mockResolvedValue(mockActivity);

        const result = await service.create(createDto);
        expect(result).toEqual(mockActivity);
        expect(mockRepository.create).toHaveBeenCalledWith(createDto);
        expect(mockRepository.save).toHaveBeenCalledWith(mockActivity);
      } else {
        // For integration tests - create without foreign key references
        const integrationDto = {
          type: ActivityType.DEVELOPMENT_CREATED,
          description: 'New development created',
        };
        const result = await service.create(integrationDto);
        expect(result).toBeDefined();
        expect(result.type).toBe(integrationDto.type);
        expect(result.description).toBe(integrationDto.description);
      }
    });

    it('should create activity without optional fields', async () => {
      const testConfig = getTestConfig();
      const createDto = {
        type: ActivityType.STATUS_CHANGED,
        description: 'Status changed',
      };

      if (testConfig.useMocks) {
        const mockActivity = { id: 2, ...createDto };
        mockRepository.create.mockReturnValue(mockActivity);
        mockRepository.save.mockResolvedValue(mockActivity);

        const result = await service.create(createDto);
        expect(result).toEqual(mockActivity);
        expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      } else {
        // For integration tests
        const result = await service.create(createDto);
        expect(result).toBeDefined();
        expect(result.type).toBe(createDto.type);
        expect(result.description).toBe(createDto.description);
      }
    });
  });

  describe('findByDevelopment', () => {
    it('should return activities for specific development', async () => {
      const testConfig = getTestConfig();
      const mockActivities = [
        { id: 1, developmentId: 1, description: 'Activity 1' },
        { id: 2, developmentId: 1, description: 'Activity 2' },
      ];

      if (testConfig.useMocks) {
        mockRepository.find.mockResolvedValue(mockActivities);

        const result = await service.findByDevelopment(1);
        expect(result).toEqual(mockActivities);
        expect(mockRepository.find).toHaveBeenCalledWith({
          where: { developmentId: 1 },
          order: { createdAt: 'DESC' },
          take: 10,
          relations: ['performedBy', 'performedBy.role', 'performedBy.team'],
        });
      } else {
        // For integration tests
        const result = await service.findByDevelopment(1);
        expect(Array.isArray(result)).toBe(true);
      }
    });

    it('should return activities with custom limit', async () => {
      const testConfig = getTestConfig();

      if (testConfig.useMocks) {
        mockRepository.find.mockResolvedValue([]);
        await service.findByDevelopment(1, 5);
        expect(mockRepository.find).toHaveBeenCalledWith({
          where: { developmentId: 1 },
          order: { createdAt: 'DESC' },
          take: 5,
          relations: ['performedBy', 'performedBy.role', 'performedBy.team'],
        });
      } else {
        // For integration tests
        const result = await service.findByDevelopment(1, 5);
        expect(Array.isArray(result)).toBe(true);
      }
    });
  });

  describe('findByUser', () => {
    it('should return activities for specific user', async () => {
      const testConfig = getTestConfig();
      const mockActivities = [
        { id: 1, performedById: 1, description: 'User activity 1' },
        { id: 2, performedById: 1, description: 'User activity 2' },
      ];

      if (testConfig.useMocks) {
        mockRepository.find.mockResolvedValue(mockActivities);

        const result = await service.findByUser(1);
        expect(result).toEqual(mockActivities);
        expect(mockRepository.find).toHaveBeenCalledWith({
          where: { performedById: 1 },
          order: { createdAt: 'DESC' },
          take: 10,
          relations: ['development', 'performedBy', 'performedBy.role', 'performedBy.team'],
        });
      } else {
        // For integration tests
        const result = await service.findByUser(1);
        expect(Array.isArray(result)).toBe(true);
      }
    });
  });
});
