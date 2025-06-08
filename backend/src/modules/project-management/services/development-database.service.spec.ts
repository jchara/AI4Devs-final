import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentDatabaseService } from './development-database.service';
import { DevelopmentDatabase } from '../entities/development-database.entity';
import { DatabaseChangeType } from '../enums/database-change-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('DevelopmentDatabaseService', () => {
  let service: DevelopmentDatabaseService;
  let repository: Repository<DevelopmentDatabase>;

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
        DevelopmentDatabaseService,
        {
          provide: getRepositoryToken(DevelopmentDatabase),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DevelopmentDatabaseService>(DevelopmentDatabaseService);
    repository = module.get<Repository<DevelopmentDatabase>>(getRepositoryToken(DevelopmentDatabase));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByDevelopmentId', () => {
    it('should return databases for a development', async () => {
      const mockDatabases = [
        { id: 1, developmentId: 1 },
        { id: 2, developmentId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockDatabases);

      const result = await service.findByDevelopmentId(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.find).toHaveBeenCalledWith({
        where: { development: { id: 1 } },
      });
    });
  });

  describe('findByDatabaseId', () => {
    it('should return developments for a database', async () => {
      const mockDatabases = [
        { id: 1, databaseId: 1 },
        { id: 2, databaseId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockDatabases);

      const result = await service.findByDatabaseId(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.find).toHaveBeenCalledWith({
        where: { database: { id: 1 } },
      });
    });
  });

  describe('findByChangeType', () => {
    it('should return databases with the specified change type', async () => {
      const mockDatabases = [
        { id: 1, changeType: DatabaseChangeType.CREATE },
      ];
      mockRepository.find.mockResolvedValue(mockDatabases);

      const result = await service.findByChangeType(DatabaseChangeType.CREATE);
      expect(result).toEqual(mockDatabases);
      expect(repository.find).toHaveBeenCalledWith({
        where: { changeType: DatabaseChangeType.CREATE },
      });
    });
  });

  describe('getDevelopmentDatabaseWithDetails', () => {
    it('should return database with all relations', async () => {
      const mockDatabase = {
        id: 1,
        development: { id: 1 },
        database: { id: 1 },
      };
      mockRepository.findOne.mockResolvedValue(mockDatabase);

      const result = await service.getDevelopmentDatabaseWithDetails(1);
      expect(result).toEqual(mockDatabase);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['development', 'database'],
      });
    });

    it('should throw NotFoundException when database not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getDevelopmentDatabaseWithDetails(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 