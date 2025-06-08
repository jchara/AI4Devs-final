import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Database } from '../entities/database.entity';
import { BaseService } from './base.service';
import { CreateDatabaseDto, UpdateDatabaseDto } from '../dtos';
import { DatabaseType } from '../../../shared/enums/database-type.enum';
import { DatabaseRepository } from '../repositories';

@Injectable()
export class DatabaseService extends BaseService<Database> {
  constructor(private readonly databaseRepository: DatabaseRepository) {
    super(databaseRepository);
  }

  async findByEnvironmentId(environmentId: number): Promise<Database[]> {
    return this.databaseRepository.findByEnvironment(environmentId);
  }

  async findByType(type: DatabaseType): Promise<Database[]> {
    return this.databaseRepository.findByType(type);
  }

  async create(createDatabaseDto: CreateDatabaseDto): Promise<Database> {
    if (!Object.values(DatabaseType).includes(createDatabaseDto.type)) {
      throw new BadRequestException(
        `Invalid database type: ${createDatabaseDto.type}`,
      );
    }
    const database = new Database();
    Object.assign(database, createDatabaseDto);
    return this.databaseRepository.save(database);
  }

  async update(
    id: number,
    updateDatabaseDto: UpdateDatabaseDto,
  ): Promise<Database> {
    if (
      updateDatabaseDto.type &&
      !Object.values(DatabaseType).includes(updateDatabaseDto.type)
    ) {
      throw new BadRequestException(
        `Invalid database type: ${updateDatabaseDto.type}`,
      );
    }
    const database = await this.findOne(id);
    Object.assign(database, updateDatabaseDto);
    return this.databaseRepository.save(database);
  }

  async getDatabasesByEnvironment(environmentId: number): Promise<Database[]> {
    return this.databaseRepository.findByEnvironment(environmentId);
  }

  async getDatabaseWithDetails(id: number): Promise<Database> {
    return this.findOne(id);
  }

  async findOne(id: number): Promise<Database> {
    const database = await this.databaseRepository.findWithRelations(id);
    if (!database) {
      throw new NotFoundException(`Database with ID ${id} not found`);
    }
    return database;
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.databaseRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.databaseRepository.restore(id);
  }

  async findByProject(projectId: number): Promise<Database[]> {
    return this.databaseRepository.findByProject(projectId);
  }

  async findByVersion(version: string): Promise<Database[]> {
    if (!version.match(/^\d+\.\d+\.\d+$/)) {
      throw new BadRequestException('Version must be in format x.y.z');
    }
    return this.databaseRepository.findByVersion(version);
  }

  async findActive(): Promise<Database[]> {
    return this.databaseRepository.findActive();
  }
}
