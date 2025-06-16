import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
// import { Database } from '../entities/database.entity'; // Unused import
import { DatabaseRepository } from '../repositories';
import { DatabaseType } from '../../../shared/enums/database-type.enum';
import { CreateDatabaseDto, UpdateDatabaseDto } from '../dtos/database.dto';

// Test environment variables
const TEST_DATABASE_NAME = process.env.TEST_DATABASE_NAME || 'Test Database';
const TEST_DATABASE_DESCRIPTION = process.env.TEST_DATABASE_DESCRIPTION || 'Test database description';
const TEST_PROJECT_ID = parseInt(process.env.TEST_PROJECT_ID || '1');
const TEST_ENVIRONMENT_ID = parseInt(process.env.TEST_ENVIRONMENT_ID || '1');

describe('DatabaseService', () => {
  let service: DatabaseService;
  let repository: DatabaseRepository;

  const mockRepository = {
    findAllWithRelations: jest.fn(),
    findWithRelations: jest.fn(),
    findByEnvironment: jest.fn(),
    findByType: jest.fn(),
    findByProject: jest.fn(),
    findByVersion: jest.fn(),
    findActive: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: DatabaseRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    repository = module.get<DatabaseRepository>(DatabaseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all databases with relations', async () => {
      const mockDatabases = [
        { id: 1, name: 'Database 1', type: DatabaseType.POSTGRES },
        { id: 2, name: 'Database 2', type: DatabaseType.MYSQL },
      ];
      mockRepository.findAllWithRelations.mockResolvedValue(mockDatabases);

      const result = await service.findAll();
      expect(result).toEqual(mockDatabases);
      expect(repository.findAllWithRelations).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return database when found', async () => {
      const mockDatabase = { id: 1, name: 'Test Database', type: DatabaseType.POSTGRES };
      mockRepository.findWithRelations.mockResolvedValue(mockDatabase);

      const result = await service.findOne(1);
      expect(result).toEqual(mockDatabase);
      expect(repository.findWithRelations).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when database not found', async () => {
      mockRepository.findWithRelations.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Database with ID 999 not found');
    });
  });

  describe('findByEnvironmentId', () => {
    it('should return databases for specific environment', async () => {
      const mockDatabases = [
        { id: 1, name: 'DB 1', environmentId: 1 },
        { id: 2, name: 'DB 2', environmentId: 1 },
      ];
      mockRepository.findByEnvironment.mockResolvedValue(mockDatabases);

      const result = await service.findByEnvironmentId(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.findByEnvironment).toHaveBeenCalledWith(1);
    });
  });

  describe('findByType', () => {
    it('should return databases of specific type', async () => {
      const mockDatabases = [
        { id: 1, name: 'PostgreSQL DB', type: DatabaseType.POSTGRES },
      ];
      mockRepository.findByType.mockResolvedValue(mockDatabases);

      const result = await service.findByType(DatabaseType.POSTGRES);
      expect(result).toEqual(mockDatabases);
      expect(repository.findByType).toHaveBeenCalledWith(DatabaseType.POSTGRES);
    });
  });

  describe('create', () => {
    it('should create database with valid type', async () => {
      const createDto: CreateDatabaseDto = {
        name: TEST_DATABASE_NAME,
        type: DatabaseType.POSTGRES,
        description: TEST_DATABASE_DESCRIPTION,
        projectId: TEST_PROJECT_ID,
        environmentId: TEST_ENVIRONMENT_ID,
      };
      const mockDatabase = { id: 1, ...createDto };
      mockRepository.save.mockResolvedValue(mockDatabase);

      const result = await service.create(createDto);
      expect(result).toEqual(mockDatabase);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(createDto));
    });

    it('should throw BadRequestException for invalid database type', async () => {
      const createDto = {
        name: TEST_DATABASE_NAME,
        type: 'INVALID_TYPE' as DatabaseType,
        description: TEST_DATABASE_DESCRIPTION,
        projectId: TEST_PROJECT_ID,
        environmentId: TEST_ENVIRONMENT_ID,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Invalid database type: INVALID_TYPE');
    });
  });

  describe('update', () => {
    it('should update database with valid data', async () => {
      const updateDto: UpdateDatabaseDto = {
        name: 'Updated Database',
        type: DatabaseType.MYSQL,
      };
      const existingDatabase = { id: 1, name: 'Old Database', type: DatabaseType.POSTGRES };
      const updatedDatabase = { ...existingDatabase, ...updateDto };
      
      mockRepository.findWithRelations.mockResolvedValue(existingDatabase);
      mockRepository.save.mockResolvedValue(updatedDatabase);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedDatabase);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
    });

    it('should throw BadRequestException for invalid database type in update', async () => {
      const updateDto = {
        name: 'Updated Database',
        type: 'INVALID_TYPE' as DatabaseType,
      };

      await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(1, updateDto)).rejects.toThrow('Invalid database type: INVALID_TYPE');
    });
  });

  describe('findByProject', () => {
    it('should return databases for specific project', async () => {
      const mockDatabases = [
        { id: 1, name: 'Project DB 1', projectId: 1 },
        { id: 2, name: 'Project DB 2', projectId: 1 },
      ];
      mockRepository.findByProject.mockResolvedValue(mockDatabases);

      const result = await service.findByProject(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.findByProject).toHaveBeenCalledWith(1);
    });
  });

  describe('findByVersion', () => {
    it('should return databases with specific version', async () => {
      const mockDatabases = [
        { id: 1, name: 'Database 1', version: '13.0.0' },
      ];
      mockRepository.findByVersion.mockResolvedValue(mockDatabases);

      const result = await service.findByVersion('13.0.0');
      expect(result).toEqual(mockDatabases);
      expect(repository.findByVersion).toHaveBeenCalledWith('13.0.0');
    });

    it('should throw BadRequestException for invalid version format', async () => {
      await expect(service.findByVersion('invalid')).rejects.toThrow(BadRequestException);
      await expect(service.findByVersion('invalid')).rejects.toThrow('Version must be in format x.y.z');
    });

    it('should accept valid version formats', async () => {
      mockRepository.findByVersion.mockResolvedValue([]);
      
      await service.findByVersion('13.0.0');
      await service.findByVersion('14.2.1');
      
      expect(repository.findByVersion).toHaveBeenCalledTimes(2);
    });
  });

  describe('findActive', () => {
    it('should return only active databases', async () => {
      const mockDatabases = [
        { id: 1, name: 'Active Database', isActive: true },
      ];
      mockRepository.findActive.mockResolvedValue(mockDatabases);

      const result = await service.findActive();
      expect(result).toEqual(mockDatabases);
      expect(repository.findActive).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete database', async () => {
      const mockDatabase = { id: 1, name: 'Test Database' };
      mockRepository.findWithRelations.mockResolvedValue(mockDatabase);
      mockRepository.softDelete.mockResolvedValue(undefined);

      await service.delete(1);
      expect(repository.findWithRelations).toHaveBeenCalledWith(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when database not found for deletion', async () => {
      mockRepository.findWithRelations.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore soft deleted database', async () => {
      mockRepository.restore.mockResolvedValue(undefined);

      await service.restore(1);
      expect(repository.restore).toHaveBeenCalledWith(1);
    });
  });

  describe('getDatabaseWithDetails', () => {
    it('should return database with details', async () => {
      const mockDatabase = { id: 1, name: 'Test Database', type: DatabaseType.POSTGRES };
      mockRepository.findWithRelations.mockResolvedValue(mockDatabase);

      const result = await service.getDatabaseWithDetails(1);
      expect(result).toEqual(mockDatabase);
    });
  });

  describe('getDatabasesByEnvironment', () => {
    it('should return databases for environment', async () => {
      const mockDatabases = [
        { id: 1, name: 'Env DB 1', environmentId: 1 },
      ];
      mockRepository.findByEnvironment.mockResolvedValue(mockDatabases);

      const result = await service.getDatabasesByEnvironment(1);
      expect(result).toEqual(mockDatabases);
      expect(repository.findByEnvironment).toHaveBeenCalledWith(1);
    });
  });
}); 