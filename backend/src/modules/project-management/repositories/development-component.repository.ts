import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { DevelopmentComponent } from '../entities/development-component.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';
import { ComponentType } from '../../../shared/enums';

@Injectable()
export class DevelopmentComponentRepository extends BaseRepository<DevelopmentComponent> {
  constructor(
    @InjectRepository(DevelopmentComponent)
    private readonly developmentComponentRepository: Repository<DevelopmentComponent>,
  ) {
    super(developmentComponentRepository);
  }

  async findWithRelations(id: number): Promise<DevelopmentComponent | null> {
    return this.developmentComponentRepository.findOne({
      where: { id },
      relations: ['development', 'component'],
    });
  }

  async findAllWithRelations(): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.find({
      relations: ['development', 'component'],
    });
  }

  async findByDevelopment(developmentId: number): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.find({
      where: { developmentId },
      relations: ['development', 'component'],
    });
  }

  async findByComponent(componentId: number): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.find({
      where: { componentId },
      relations: ['development', 'component'],
    });
  }

  async findByChangeType(changeType: DevelopmentComponentChangeType): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.find({
      where: { changeType },
      relations: ['development', 'component'],
    });
  }

  async findByType(type: ComponentType): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.find({
      where: { component: { type } },
      relations: ['development', 'component'],
    });
  }

  async findActive(): Promise<DevelopmentComponent[]> {
    const where: FindOptionsWhere<DevelopmentComponent> = {
      isActive: true,
    };
    const order: FindOptionsOrder<DevelopmentComponent> = {
      createdAt: 'DESC',
    };

    return this.developmentComponentRepository.find({
      where,
      relations: ['development', 'component'],
      order,
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.developmentComponentRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.developmentComponentRepository.restore(id);
  }

  async save(entity: DevelopmentComponent): Promise<DevelopmentComponent> {
    return this.developmentComponentRepository.save(entity);
  }
} 