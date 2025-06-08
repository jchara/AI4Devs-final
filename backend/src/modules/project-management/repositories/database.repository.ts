import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '../entities/database.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { DatabaseType } from '../../../shared/enums/database-type.enum';

@Injectable()
export class DatabaseRepository extends BaseRepository<Database> {
  constructor(
    @InjectRepository(Database)
    private readonly databaseRepository: Repository<Database>,
  ) {
    super(databaseRepository);
  }

  async findWithRelations(id: number): Promise<Database | null> {
    return this.databaseRepository.findOne({
      where: { id },
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async findAllWithRelations(): Promise<Database[]> {
    return this.databaseRepository.find({
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async findByEnvironment(environmentId: number): Promise<Database[]> {
    return this.databaseRepository.find({
      where: { environment: { id: environmentId } },
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async findByType(type: DatabaseType): Promise<Database[]> {
    return this.databaseRepository.find({
      where: { type },
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async findByProject(projectId: number): Promise<Database[]> {
    return this.databaseRepository.find({
      where: { projectId },
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async findByVersion(version: string): Promise<Database[]> {
    return this.databaseRepository.find({
      where: { version },
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async findActive(): Promise<Database[]> {
    return this.databaseRepository.find({
      where: { isActive: true },
      relations: ['environment', 'project', 'developmentDatabases'],
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.databaseRepository.restore(id);
  }

  async save(entity: Database): Promise<Database> {
    return this.databaseRepository.save(entity);
  }
} 