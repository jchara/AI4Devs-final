import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Component } from '../entities/component.entity';
import { BaseService } from './base.service';
import { CreateComponentDto, UpdateComponentDto } from '../dtos';
import { ComponentType } from '../../../shared/enums/component-type.enum';
import { ComponentRepository } from '../repositories/component.repository';

@Injectable()
export class ComponentService extends BaseService<Component> {
  constructor(private readonly componentRepository: ComponentRepository) {
    super(componentRepository);
  }

  async findByProject(projectId: number): Promise<Component[]> {
    return await this.componentRepository.findByProject(projectId);
  }

  async findByType(type: ComponentType): Promise<Component[]> {
    return await this.componentRepository.findBy({
      type,
    } as Partial<Component>);
  }

  async findByVersion(version: string): Promise<Component[]> {
    if (!version.match(/^\d+\.\d+\.\d+$/)) {
      throw new BadRequestException('Version must be in format x.y.z');
    }
    return await this.componentRepository.findBy({
      version,
    } as Partial<Component>);
  }

  async findActive(): Promise<Component[]> {
    return await this.componentRepository.findBy({
      isActive: true,
    } as Partial<Component>);
  }

  async createComponent(
    createComponentDto: CreateComponentDto,
  ): Promise<Component> {
    if (!Object.values(ComponentType).includes(createComponentDto.type)) {
      throw new BadRequestException(
        `Invalid component type: ${createComponentDto.type}`,
      );
    }
    return await this.create(createComponentDto);
  }

  async updateComponent(
    id: number,
    updateComponentDto: UpdateComponentDto,
  ): Promise<Component> {
    if (
      updateComponentDto.type &&
      !Object.values(ComponentType).includes(updateComponentDto.type)
    ) {
      throw new BadRequestException(
        `Invalid component type: ${updateComponentDto.type}`,
      );
    }
    return await this.update(id, updateComponentDto);
  }

  async getComponentsByProject(projectId: number): Promise<Component[]> {
    return await this.componentRepository.findByProject(projectId);
  }

  async getComponentWithDetails(id: number): Promise<Component> {
    const component = await this.findOne(id);
    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
    return component;
  }

  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    return await this.componentRepository.create(createComponentDto);
  }

  async findAll(): Promise<Component[]> {
    return await this.componentRepository.findAll();
  }

  async findOne(id: number): Promise<Component> {
    const component = await this.componentRepository.findOne(id);
    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
    return component;
  }

  async update(
    id: number,
    updateComponentDto: UpdateComponentDto,
  ): Promise<Component> {
    const component = await this.findOne(id);
    Object.assign(component, updateComponentDto);
    return await this.componentRepository.update(id, component);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id); // Verificar que existe antes de eliminar
    await this.componentRepository.remove(id);
  }

  async restore(id: number): Promise<void> {
    await this.componentRepository.update(id, {
      isActive: true,
    } as Partial<Component>);
  }
}
