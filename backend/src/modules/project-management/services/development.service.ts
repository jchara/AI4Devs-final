import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';
import {
  CreateDevelopmentDto,
  UpdateDevelopmentDto,
  CreateDevelopmentWithRelationsDto,
  UpdateDevelopmentWithRelationsDto,
} from '../dtos';
import { Development } from '../entities/development.entity';
import { DevelopmentMetrics } from '../interfaces';
import { DevelopmentRepository } from '../repositories/development.repository';
import { DevelopmentFilters } from '../repositories/development.repository.interface';
import { BaseService } from './base.service';
import { EnvironmentRepository } from 'src/modules/infrastructure';
import { DevelopmentComponentService } from './development-component.service';
import { DevelopmentDatabaseService } from './development-database.service';

@Injectable()
export class DevelopmentService extends BaseService<Development> {
  constructor(
    private readonly developmentRepository: DevelopmentRepository,
    private readonly environmentRepository: EnvironmentRepository,
    private readonly developmentComponentService: DevelopmentComponentService,
    private readonly developmentDatabaseService: DevelopmentDatabaseService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super(developmentRepository);
  }

  async findAll(): Promise<Development[]> {
    return await this.developmentRepository.findAll();
  }

  async findWithFilters(filters: DevelopmentFilters): Promise<Development[]> {
    return await this.developmentRepository.findWithFilters(filters);
  }

  async findByStatus(status: DevelopmentStatus): Promise<Development[]> {
    return await this.developmentRepository.findByStatus(status);
  }

  async findByPriority(priority: DevelopmentPriority): Promise<Development[]> {
    return await this.developmentRepository.findBy({
      priority,
    } as Partial<Development>);
  }

  async findByEnvironmentId(environmentId: number): Promise<Development[]> {
    return await this.developmentRepository.findByEnvironment(environmentId);
  }

  async findByAssignedTo(userId: number): Promise<Development[]> {
    return await this.developmentRepository.findByAssignedUser(userId);
  }

  async findByTeam(teamId: number): Promise<Development[]> {
    return await this.developmentRepository.findByTeam(teamId);
  }

  async findByEnvironment(environmentId: number): Promise<Development[]> {
    return await this.developmentRepository.findByEnvironment(environmentId);
  }

  async create(
    createDevelopmentDto: CreateDevelopmentDto,
  ): Promise<Development> {
    return await this.developmentRepository.create(createDevelopmentDto);
  }

  async update(
    id: number,
    updateDevelopmentDto: UpdateDevelopmentDto,
  ): Promise<Development> {
    return await this.developmentRepository.update(id, updateDevelopmentDto);
  }

  async getDevelopmentWithDetails(id: number): Promise<Development> {
    const development = await this.developmentRepository.findOne(id);
    if (!development) {
      throw new BadRequestException(`Development with ID ${id} not found`);
    }
    return development;
  }

  async findOneWithRelations(id: number): Promise<any> {
    const development = await this.developmentRepository.findOne(id);
    if (!development) {
      throw new BadRequestException(`Development with ID ${id} not found`);
    }

    // Obtener componentes asociados
    const components =
      await this.developmentComponentService.findByDevelopment(id);

    // Obtener bases de datos asociadas
    const databases =
      await this.developmentDatabaseService.findDatabasesByDevelopment(id);

    return {
      ...development,
      components: components.map((dc) => ({
        id: dc.id,
        componentId: dc.componentId,
        component: dc.component,
        notes: dc.notes || '',
        changeType: dc.changeType,
        progress: dc.progress,
        version: dc.version,
      })),
      databases: databases.map((dd) => ({
        id: dd.id,
        databaseId: dd.databaseId,
        database: dd.database,
        changeType: dd.changeType,
        scriptDescription: dd.scriptDescription,
        notes: dd.notes || '',
      })),
    };
  }

  async findAllWithRelations(): Promise<any[]> {
    const developments = await this.developmentRepository.findAll();

    // Para cada desarrollo, obtener sus relaciones
    const developmentsWithRelations = await Promise.all(
      developments.map(async (development) => {
        const components =
          await this.developmentComponentService.findByDevelopment(
            development.id,
          );
        const databases =
          await this.developmentDatabaseService.findDatabasesByDevelopment(
            development.id,
          );

        return {
          ...development,
          components: components.map((dc) => ({
            id: dc.id,
            componentId: dc.componentId,
            component: dc.component,
            notes: dc.notes || '',
            changeType: dc.changeType,
            progress: dc.progress,
            version: dc.version,
          })),
          databases: databases.map((dd) => ({
            id: dd.id,
            databaseId: dd.databaseId,
            database: dd.database,
            changeType: dd.changeType,
            scriptDescription: dd.scriptDescription,
            notes: dd.notes || '',
          })),
        };
      }),
    );

    return developmentsWithRelations;
  }

  async updateProgress(id: number, progress: number): Promise<Development> {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const development = await this.findOne(id);
    development.progress = progress;
    return this.developmentRepository.update(id, development);
  }

  async updateStatus(
    id: number,
    status: DevelopmentStatus,
  ): Promise<Development> {
    const development = await this.findOne(id);
    development.status = status;
    return this.developmentRepository.update(id, development);
  }

  async getMetrics(): Promise<DevelopmentMetrics> {
    const metrics = await this.developmentRepository.getMetrics();
    const environments = await this.environmentRepository.findAll();
    const byEnvironment = environments.map((environment) => {
      if (environment.isActive) {
        return {
          environment: environment.name,
          count: metrics.byEnvironment[environment.name] || 0,
        };
      }
    });

    metrics.byEnvironment = byEnvironment.reduce(
      (acc, curr) => {
        if (curr) {
          acc[curr.environment] = curr.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return metrics;
  }

  async getOverdue(): Promise<Development[]> {
    const now = new Date();
    return await this.developmentRepository.findBy({
      endDate: { $lt: now },
      status: { $ne: DevelopmentStatus.COMPLETED },
    } as any);
  }

  async getDevelopmentsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Development[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return await this.developmentRepository.findBy({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    } as any);
  }

  async remove(id: number): Promise<void> {
    await this.developmentRepository.remove(id);
  }

  async changeStatus(
    id: number,
    status: DevelopmentStatus,
  ): Promise<Development> {
    const development = await this.findOne(id);
    if (!development) {
      throw new BadRequestException(`Development with ID ${id} not found`);
    }

    development.status = status;

    // Si el estado es COMPLETED, actualizar progreso y fecha de finalización
    if (status === DevelopmentStatus.COMPLETED) {
      development.progress = 100;
      development.endDate = new Date();
    }

    return this.developmentRepository.update(id, development);
  }

  async filterDevelopments(
    filters: DevelopmentFilters,
  ): Promise<Development[]> {
    return await this.developmentRepository.findWithFilters(filters);
  }

  // Métodos transaccionales para manejar desarrollo con componentes y bases de datos
  async createWithRelations(
    createDto: CreateDevelopmentWithRelationsDto,
  ): Promise<Development> {
    return await this.dataSource.transaction(async () => {
      // 1. Crear el desarrollo
      const { components, databases, ...developmentData } = createDto;
      const development =
        await this.developmentRepository.create(developmentData);

      // 2. Crear relaciones con componentes si existen
      if (components && components.length > 0) {
        for (const componentData of components) {
          // Validar y convertir changeType
          const changeType =
            componentData.changeType &&
            Object.values(DevelopmentComponentChangeType).includes(
              componentData.changeType,
            )
              ? componentData.changeType
              : DevelopmentComponentChangeType.CREATED;

          await this.developmentComponentService.createDevelopmentComponent({
            developmentId: development.id,
            changeType,
            ...componentData,
          });
        }
      }

      // 3. Crear relaciones con bases de datos si existen
      if (databases && databases.length > 0) {
        for (const databaseData of databases) {
          await this.developmentDatabaseService.createDevelopmentDatabase({
            developmentId: development.id,
            ...databaseData,
          });
        }
      }

      // 4. Retornar el desarrollo con todas sus relaciones
      return await this.getDevelopmentWithDetails(development.id);
    });
  }

  async updateWithRelations(
    id: number,
    updateDto: UpdateDevelopmentWithRelationsDto,
  ): Promise<Development> {
    console.log('Iniciando updateWithRelations en servicio:', {
      id,
      updateDto,
    });
    return await this.dataSource.transaction(async () => {
      // 1. Actualizar el desarrollo
      const { components, databases, ...developmentData } = updateDto;
      console.log('Datos separados:', {
        components,
        databases,
        developmentData,
      });
      await this.developmentRepository.update(id, developmentData);

      // 2. Si se proporcionan componentes, reemplazar las relaciones existentes
      if (components !== undefined) {
        // Eliminar relaciones existentes
        const existingComponents =
          await this.developmentComponentService.findByDevelopment(id);
        for (const existing of existingComponents) {
          await this.developmentComponentService.delete(existing.id);
        }

        // Crear nuevas relaciones
        if (components.length > 0) {
          for (const componentData of components) {
            // Validar y convertir changeType para updates
            const changeType =
              componentData.changeType &&
              Object.values(DevelopmentComponentChangeType).includes(
                componentData.changeType,
              )
                ? componentData.changeType
                : DevelopmentComponentChangeType.MODIFIED;

            await this.developmentComponentService.createDevelopmentComponent({
              developmentId: id,
              changeType,
              ...componentData,
            });
          }
        }
      }

      // 3. Si se proporcionan bases de datos, reemplazar las relaciones existentes
      if (databases !== undefined) {
        // Eliminar relaciones existentes
        const existingDatabases =
          await this.developmentDatabaseService.findDatabasesByDevelopment(id);
        for (const existing of existingDatabases) {
          await this.developmentDatabaseService.delete(existing.id);
        }

        // Crear nuevas relaciones
        if (databases.length > 0) {
          for (const databaseData of databases) {
            await this.developmentDatabaseService.createDevelopmentDatabase({
              developmentId: id,
              ...databaseData,
            });
          }
        }
      }

      // 4. Retornar el desarrollo actualizado con todas sus relaciones
      return await this.getDevelopmentWithDetails(id);
    });
  }
}
