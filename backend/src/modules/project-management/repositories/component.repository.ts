import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentType } from '../../../shared/enums/component-type.enum';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Component } from '../entities/component.entity';

@Injectable()
export class ComponentRepository extends BaseRepository<Component> {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {
    super(componentRepository);
  }

  async findByName(name: string): Promise<Component | null> {
    return this.componentRepository.findOne({
      where: { name },
      relations: ['project', 'developmentComponents'],
    });
  }

  async findByType(type: ComponentType): Promise<Component[]> {
    return this.componentRepository.find({
      where: { type },
      relations: ['project', 'developmentComponents'],
    });
  }

  async findByProject(projectId: number): Promise<Component[]> {
    return this.componentRepository.find({
      where: { projectId },
      relations: ['project', 'developmentComponents'],
    });
  }
}
