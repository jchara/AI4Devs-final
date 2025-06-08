import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentService } from './development.service';
import { Development } from '../entities/development.entity';
import { DevelopmentStatus } from '../enums/development-status.enum';
import { DevelopmentPriority } from '../enums/development-priority.enum';
import { NotFoundException } from '@nestjs/common';

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

      const result = await service.findByAssignedTo('user1');
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

      const result = await service.findByTeam('team1');
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
}); 