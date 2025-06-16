import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentService } from './development.service';
import { Development } from '../entities/development.entity';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { NotFoundException } from '@nestjs/common';

// Test environment variables
const TEST_USER_ID = parseInt(process.env.TEST_USER_ID || '1');
const TEST_TEAM_ID = parseInt(process.env.TEST_TEAM_ID || '1');

describe('DevelopmentService', () => {
  let service: DevelopmentService;
  let repository: Repository<Development>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    findByEnvironment: jest.fn(),
    findByAssignedUser: jest.fn(),
    findByTeam: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevelopmentService,
        {
          provide: getRepositoryToken(Development),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DevelopmentService>(DevelopmentService);
    repository = module.get<Repository<Development>>(getRepositoryToken(Development));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByStatus', () => {
    it('should return developments with the specified status', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Development 1', status: DevelopmentStatus.IN_PROGRESS },
      ];
      mockRepository.find.mockResolvedValue(mockDevelopments);

      const result = await service.findByStatus(DevelopmentStatus.IN_PROGRESS);
      expect(result).toEqual(mockDevelopments);
      expect(repository.find).toHaveBeenCalledWith({
        where: { status: DevelopmentStatus.IN_PROGRESS },
      });
    });
  });

  describe('findByPriority', () => {
    it('should return developments with the specified priority', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Development 1', priority: DevelopmentPriority.HIGH },
      ];
      mockRepository.find.mockResolvedValue(mockDevelopments);

      const result = await service.findByPriority(DevelopmentPriority.HIGH);
      expect(result).toEqual(mockDevelopments);
      expect(repository.find).toHaveBeenCalledWith({
        where: { priority: DevelopmentPriority.HIGH },
      });
    });
  });

  describe('findByEnvironment', () => {
    it('should return developments for an environment', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Development 1', environmentId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockDevelopments);

      const result = await service.findByEnvironment(1);
      expect(result).toEqual(mockDevelopments);
      expect(repository.find).toHaveBeenCalledWith({
        where: { environment: { id: 1 } },
      });
    });
  });

  describe('findByAssignedTo', () => {
    it('should return developments assigned to a user', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Development 1', assignedTo: 'user1' },
      ];
      mockRepository.find.mockResolvedValue(mockDevelopments);

      const result = await service.findByAssignedTo(TEST_USER_ID);
      expect(result).toEqual(mockDevelopments);
      expect(repository.find).toHaveBeenCalledWith({
        where: { assignedTo: 'user1' },
      });
    });
  });

  describe('findByTeam', () => {
    it('should return developments for a team', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Development 1', team: 'team1' },
      ];
      mockRepository.find.mockResolvedValue(mockDevelopments);

      const result = await service.findByTeam(TEST_TEAM_ID);
      expect(result).toEqual(mockDevelopments);
      expect(repository.find).toHaveBeenCalledWith({
        where: { team: 'team1' },
      });
    });
  });

  describe('getDevelopmentWithDetails', () => {
    it('should return development with all relations', async () => {
      const mockDevelopment = {
        id: 1,
        title: 'Test Development',
        components: [],
        databases: [],
      };
      mockRepository.findOne.mockResolvedValue(mockDevelopment);

      const result = await service.getDevelopmentWithDetails(1);
      expect(result).toEqual(mockDevelopment);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['project', 'environment', 'components', 'databases'],
      });
    });

    it('should throw NotFoundException when development not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getDevelopmentWithDetails(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProgress', () => {
    it('should update development progress', async () => {
      const mockDevelopment = {
        id: 1,
        title: 'Test Development',
        progress: 50,
      };
      mockRepository.findOne.mockResolvedValue(mockDevelopment);
      mockRepository.save.mockResolvedValue({ ...mockDevelopment, progress: 75 });

      const result = await service.updateProgress(1, 75);
      expect(result.progress).toBe(75);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockDevelopment,
        progress: 75,
      });
    });
  });

  describe('updateStatus', () => {
    it('should update development status', async () => {
      const mockDevelopment = {
        id: 1,
        title: 'Test Development',
        status: DevelopmentStatus.IN_PROGRESS,
      };
      mockRepository.findOne.mockResolvedValue(mockDevelopment);
      mockRepository.save.mockResolvedValue({
        ...mockDevelopment,
        status: DevelopmentStatus.COMPLETED,
      });

      const result = await service.updateStatus(1, DevelopmentStatus.COMPLETED);
      expect(result.status).toBe(DevelopmentStatus.COMPLETED);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockDevelopment,
        status: DevelopmentStatus.COMPLETED,
      });
    });
  });

  describe('updateProgress', () => {
    it('should validate progress range', async () => {
      await expect(service.updateProgress(1, -10)).rejects.toThrow('Progress must be between 0 and 100');
      await expect(service.updateProgress(1, 150)).rejects.toThrow('Progress must be between 0 and 100');
    });

    it('should update progress within valid range', async () => {
      const mockDevelopment = { id: 1, title: 'Test', progress: 50 };
      mockRepository.findOne.mockResolvedValue(mockDevelopment);
      mockRepository.update.mockResolvedValue({ ...mockDevelopment, progress: 75 });

      const result = await service.updateProgress(1, 75);
      expect(result.progress).toBe(75);
    });
  });

  describe('findByEnvironmentId', () => {
    it('should return developments for specific environment', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Dev 1', environmentId: 1 },
        { id: 2, title: 'Dev 2', environmentId: 1 },
      ];
      mockRepository.findByEnvironment = jest.fn().mockResolvedValue(mockDevelopments);

      const result = await service.findByEnvironmentId(1);
      expect(result).toEqual(mockDevelopments);
      expect(mockRepository.findByEnvironment).toHaveBeenCalledWith(1);
    });
  });

  describe('findByAssignedTo', () => {
    it('should return developments assigned to specific user', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Dev 1', assignedToId: 1 },
      ];
      mockRepository.findByAssignedUser = jest.fn().mockResolvedValue(mockDevelopments);

      const result = await service.findByAssignedTo(1);
      expect(result).toEqual(mockDevelopments);
      expect(mockRepository.findByAssignedUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findByTeam', () => {
    it('should return developments for specific team', async () => {
      const mockDevelopments = [
        { id: 1, title: 'Dev 1', teamId: 1 },
      ];
      mockRepository.findByTeam = jest.fn().mockResolvedValue(mockDevelopments);

      const result = await service.findByTeam(1);
      expect(result).toEqual(mockDevelopments);
      expect(mockRepository.findByTeam).toHaveBeenCalledWith(1);
    });
  });
}); 