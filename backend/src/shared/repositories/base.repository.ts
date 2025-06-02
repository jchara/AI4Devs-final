import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BaseRepositoryInterface } from './base.repository.interface';

export abstract class BaseRepository<T extends ObjectLiteral> implements BaseRepositoryInterface<T> {
  constructor(protected repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find({
      where: { isActive: true } as unknown as FindOptionsWhere<T>,
    });
  }

  async findOne(id: number): Promise<T | null> {
    return this.repository.findOne({
      where: { id, isActive: true } as unknown as FindOptionsWhere<T>,
    });
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as any);
    const savedEntity = await this.repository.save(newEntity);
    return Array.isArray(savedEntity) ? savedEntity[0] : savedEntity;
  }

  async update(id: number, entityData: Partial<T>): Promise<T> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    Object.assign(entity, entityData);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    Object.assign(entity, { isActive: false });
    await this.repository.save(entity);
  }

  async findBy(criteria: Partial<T>): Promise<T[]> {
    return this.repository.find({
      where: { ...criteria, isActive: true } as unknown as FindOptionsWhere<T>,
    });
  }
} 