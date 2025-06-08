import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';
import {
  CreateDevelopmentComponentDto,
  UpdateDevelopmentComponentDto,
} from '../dtos/development-component.dto';
import { DevelopmentComponent } from '../entities/development-component.entity';
import { ComponentType } from '../../../shared/enums';
import { DevelopmentComponentRepository } from '../repositories';
import { BaseService } from './base.service';

@Injectable()
export class DevelopmentComponentService extends BaseService<DevelopmentComponent> {
  constructor(
    private readonly developmentComponentRepository: DevelopmentComponentRepository,
  ) {
    super(developmentComponentRepository);
  }

  async findAll(): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findAllWithRelations();
  }

  async findOne(id: number): Promise<DevelopmentComponent> {
    const developmentComponent = await this.developmentComponentRepository.findWithRelations(id);
    if (!developmentComponent) {
      throw new NotFoundException(
        `DevelopmentComponent with ID ${id} not found`,
      );
    }
    return developmentComponent;
  }

  async update(
    id: number,
    updateDto: UpdateDevelopmentComponentDto,
  ): Promise<DevelopmentComponent> {
    const developmentComponent = await this.findOne(id);
    Object.assign(developmentComponent, updateDto);
    return this.developmentComponentRepository.save(developmentComponent);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.developmentComponentRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.developmentComponentRepository.restore(id);
  }

  async findByDevelopment(
    developmentId: number,
  ): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findByDevelopment(developmentId);
  }

  async findByComponent(componentId: number): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findByComponent(componentId);
  }

  async findByChangeType(
    changeType: DevelopmentComponentChangeType,
  ): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findByChangeType(changeType);
  }

  async findByType(type: ComponentType): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findByType(type);
  }

  async findDevelopmentComponents(): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findActive();
  }

  async findDevelopmentComponentById(
    id: number,
  ): Promise<DevelopmentComponent> {
    return this.findOne(id);
  }

  async findComponentsByDevelopment(
    developmentId: number,
  ): Promise<DevelopmentComponent[]> {
    return this.developmentComponentRepository.findByDevelopment(developmentId);
  }

  async createDevelopmentComponent(
    createDto: CreateDevelopmentComponentDto,
  ): Promise<DevelopmentComponent> {
    const component = new DevelopmentComponent();
    Object.assign(component, { ...createDto, isActive: true });

    try {
      return await this.developmentComponentRepository.save(component);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException(
          'A component with these properties already exists',
        );
      }
      throw error;
    }
  }

  async removeDevelopmentComponent(id: number): Promise<void> {
    const component = await this.findOne(id);
    if (component) {
      component.isActive = false;
      await this.developmentComponentRepository.save(component);
    }
  }
}
