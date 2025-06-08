import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.repository.remove(id);
  }

  async delete(id: number): Promise<void> {
    return this.repository.remove(id);
  }

  async restore(id: number): Promise<void> {
    await this.repository.update(id, { isActive: true } as unknown as Partial<T>);
  }

  async findBy(criteria: Partial<T>): Promise<T[]> {
    return this.repository.findBy(criteria);
  }
}
