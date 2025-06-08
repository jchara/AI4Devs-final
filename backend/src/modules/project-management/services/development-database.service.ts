import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseChangeType } from '../../../shared/enums';
import {
  CreateDevelopmentDatabaseDto,
  UpdateDevelopmentDatabaseDto,
} from '../dtos/development-database.dto';
import { DevelopmentDatabase } from '../entities/development-database.entity';
import { DevelopmentDatabaseRepository } from '../repositories';
import { BaseService } from './base.service';

@Injectable()
export class DevelopmentDatabaseService extends BaseService<DevelopmentDatabase> {
  constructor(
    private readonly developmentDatabaseRepository: DevelopmentDatabaseRepository,
  ) {
    super(developmentDatabaseRepository);
  }

  async findDevelopmentDatabases(): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseRepository.findDevelopmentDatabases();
  }

  async findDevelopmentDatabaseById(id: number): Promise<DevelopmentDatabase> {
    const database =
      await this.developmentDatabaseRepository.findWithRelations(id);

    if (!database) {
      throw new NotFoundException(
        `Development database with ID ${id} not found`,
      );
    }

    return database;
  }

  async findDatabasesByDevelopment(
    developmentId: number,
  ): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseRepository.findDatabasesByDevelopment(
      developmentId,
    );
  }

  async createDevelopmentDatabase(
    createDto: CreateDevelopmentDatabaseDto,
  ): Promise<DevelopmentDatabase> {
    const database = new DevelopmentDatabase();
    database.developmentId = createDto.developmentId;
    database.databaseId = createDto.databaseId;
    database.changeType = createDto.changeType;
    database.scriptDescription = createDto.scriptDescription || '';
    database.notes = createDto.notes || '';
    database.isActive = true;

    try {
      return await this.developmentDatabaseRepository.save(database);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException(
          'A database with these properties already exists',
        );
      }
      throw error;
    }
  }

  async updateDevelopmentDatabase(
    id: number,
    updateDto: UpdateDevelopmentDatabaseDto,
  ): Promise<DevelopmentDatabase> {
    const database = await this.findDevelopmentDatabaseById(id);

    Object.assign(database, updateDto);

    try {
      return await this.developmentDatabaseRepository.save(database);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException(
          'A database with these properties already exists',
        );
      }
      throw error;
    }
  }

  async removeDevelopmentDatabase(id: number): Promise<void> {
    const database = await this.findDevelopmentDatabaseById(id);
    if (database) {
      database.isActive = false;
      await this.developmentDatabaseRepository.save(database);
    }
  }

  async findByChangeType(
    changeType: DatabaseChangeType,
  ): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseRepository.findByChangeType(changeType);
  }

  async findAll(): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseRepository.findAllWithRelations();
  }

  async findOne(id: number): Promise<DevelopmentDatabase> {
    return this.findDevelopmentDatabaseById(id);
  }

  async update(
    id: number,
    updateDto: UpdateDevelopmentDatabaseDto,
  ): Promise<DevelopmentDatabase> {
    return this.updateDevelopmentDatabase(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.developmentDatabaseRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.developmentDatabaseRepository.restore(id);
  }

  async findDatabasesByDatabase(
    databaseId: number,
  ): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseRepository.findDatabasesByDatabase(
      databaseId,
    );
  }
}
