import { Repository, FindOptionsWhere, ObjectLiteral, IsNull } from 'typeorm';
import { BaseRepositoryInterface } from './base.repository.interface';

export abstract class BaseRepository<T extends ObjectLiteral> implements BaseRepositoryInterface<T> {
  constructor(protected repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    const hasDeletedAt = this.repository.metadata.columns.some(
      column => column.propertyName === 'deletedAt'
    );

    return this.repository.find({
      where: {
        isActive: true,
        ...(hasDeletedAt ? { deletedAt: IsNull() } : {}),
      } as unknown as FindOptionsWhere<T>,
    });
  }

  async findOne(id: number): Promise<T | null> {
    const hasDeletedAt = this.repository.metadata.columns.some(
      column => column.propertyName === 'deletedAt'
    );

    return this.repository.findOne({
      where: {
        id,
        ...(hasDeletedAt ? { deletedAt: IsNull() } : {}),
      } as unknown as FindOptionsWhere<T>,
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
    const hasDeletedAt = this.repository.metadata.columns.some(
      column => column.propertyName === 'deletedAt'
    );

    return this.repository.find({
      where: {
        ...criteria, 
        isActive: true,
        ...(hasDeletedAt ? { deletedAt: IsNull() } : {}),
      } as unknown as FindOptionsWhere<T>,
    });
  }
} 