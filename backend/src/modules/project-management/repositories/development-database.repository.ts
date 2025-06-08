import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { DevelopmentDatabase } from '../entities/development-database.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { DatabaseChangeType } from '../../../shared/enums';

@Injectable()
export class DevelopmentDatabaseRepository extends BaseRepository<DevelopmentDatabase> {
  constructor(
    @InjectRepository(DevelopmentDatabase)
    private readonly developmentDatabaseRepository: Repository<DevelopmentDatabase>,
  ) {
    super(developmentDatabaseRepository);
  }

  async save(entity: DevelopmentDatabase): Promise<DevelopmentDatabase> {
    return this.developmentDatabaseRepository.save(entity);
  }

  async findDevelopmentDatabases(): Promise<DevelopmentDatabase[]> {
    const where: FindOptionsWhere<DevelopmentDatabase> = {
      isActive: true,
    };
    const order: FindOptionsOrder<DevelopmentDatabase> = {
      createdAt: 'DESC',
    };

    return this.developmentDatabaseRepository.find({
      where,
      relations: ['development', 'database'],
      order,
    });
  }

  async findDatabasesByDevelopment(developmentId: number): Promise<DevelopmentDatabase[]> {
    const where: FindOptionsWhere<DevelopmentDatabase> = {
      development: { id: developmentId },
      isActive: true,
    };
    const order: FindOptionsOrder<DevelopmentDatabase> = {
      createdAt: 'DESC',
    };

    return this.developmentDatabaseRepository.find({
      where,
      relations: ['development', 'database'],
      order,
    });
  }

  async findDatabasesByDatabase(databaseId: number): Promise<DevelopmentDatabase[]> {
    const where: FindOptionsWhere<DevelopmentDatabase> = {
      database: { id: databaseId },
      isActive: true,
    };
    const order: FindOptionsOrder<DevelopmentDatabase> = {
      createdAt: 'DESC',
    };

    return this.developmentDatabaseRepository.find({
      where,
      relations: ['development', 'database'],
      order,
    });
  }

  async findByChangeType(changeType: DatabaseChangeType): Promise<DevelopmentDatabase[]> {
    const where: FindOptionsWhere<DevelopmentDatabase> = {
      changeType,
      isActive: true,
    };
    return this.developmentDatabaseRepository.find({
      where,
      relations: ['development', 'database'],
    });
  }

  async findWithRelations(id: number): Promise<DevelopmentDatabase | null> {
    return this.developmentDatabaseRepository.findOne({
      where: { id },
      relations: ['development', 'database'],
    });
  }

  async findAllWithRelations(): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseRepository.find({
      relations: ['development', 'database'],
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.developmentDatabaseRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.developmentDatabaseRepository.restore(id);
  }
} 