export interface BaseRepositoryInterface<T> {
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  remove(id: number): Promise<void>;
  findBy(criteria: Partial<T>): Promise<T[]>;
} 