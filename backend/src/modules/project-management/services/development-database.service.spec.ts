import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentDatabaseService } from './development-database.service';
import { DevelopmentDatabase } from '../entities/development-database.entity';
import { DatabaseChangeType } from '../../../shared/enums/database-change-type.enum';
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

  describe('findDatabasesByDevelopment', () => {
    it('should return databases for a development', async () => {
      const mockDatabases = [
        { id: 1, developmentId: 1, changeType: DatabaseChangeType.SCHEMA_CHANGE },
        { id: 2, developmentId: 1, changeType: DatabaseChangeType.DATA_MIGRATION },
      ];
      mockRepository.find.mockResolvedValue(mockDatabases);

      const result = await service.findDatabasesByDevelopment(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.find).toHaveBeenCalledWith({
        where: { development: { id: 1 } },
        relations: ['database'],
      });
    });
  });

  describe('create', () => {
    it('should create a new development database relation', async () => {
      const createDto = {
        developmentId: 1,
        databaseId: 1,
                 changeType: DatabaseChangeType.SCHEMA_CHANGE,
        scriptDescription: 'Test script',
      };
      const mockDevelopmentDatabase = { id: 1, ...createDto };
      mockRepository.save.mockResolvedValue(mockDevelopmentDatabase);

      const result = await service.create(createDto);
      expect(result).toEqual(mockDevelopmentDatabase);
      expect(repository.save).toHaveBeenCalled();
    });
  });
}); 