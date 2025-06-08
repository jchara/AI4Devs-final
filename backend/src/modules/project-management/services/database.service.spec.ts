import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from './database.service';
import { Database } from '../entities/database.entity';
import { DatabaseType } from '../enums/database-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let repository: Repository<Database>;

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
        DatabaseService,
        {
          provide: getRepositoryToken(Database),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    repository = module.get<Repository<Database>>(getRepositoryToken(Database));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEnvironment', () => {
    it('should return databases for an environment', async () => {
      const mockDatabases = [
        { id: 1, name: 'Database 1', environmentId: 1 },
        { id: 2, name: 'Database 2', environmentId: 1 },
      ];
      mockRepository.find.mockResolvedValue(mockDatabases);

      const result = await service.findByEnvironment(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.find).toHaveBeenCalledWith({
        where: { environment: { id: 1 } },
      });
    });
  });

  describe('findByType', () => {
    it('should return databases of the specified type', async () => {
      const mockDatabases = [
        { id: 1, name: 'Database 1', type: DatabaseType.POSTGRESQL },
      ];
      mockRepository.find.mockResolvedValue(mockDatabases);

      const result = await service.findByType(DatabaseType.POSTGRESQL);
      expect(result).toEqual(mockDatabases);
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: DatabaseType.POSTGRESQL },
      });
    });
  });

  describe('getDatabaseWithDetails', () => {
    it('should return database with all relations', async () => {
      const mockDatabase = {
        id: 1,
        name: 'Test Database',
        developments: [],
      };
      mockRepository.findOne.mockResolvedValue(mockDatabase);

      const result = await service.getDatabaseWithDetails(1);
      expect(result).toEqual(mockDatabase);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['environment', 'developments'],
      });
    });

    it('should throw NotFoundException when database not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getDatabaseWithDetails(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 