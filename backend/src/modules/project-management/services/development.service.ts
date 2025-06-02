import { Injectable, NotFoundException } from '@nestjs/common';
import { DevelopmentRepository } from '../repositories/development.repository';
import { Development, DevelopmentStatus, DevelopmentPriority } from '../entities/development.entity';
import { DevelopmentFilters } from '../repositories/development.repository.interface';
import { CreateDevelopmentDto, UpdateDevelopmentDto, DevelopmentMetricsResponseDto } from '../dto';

@Injectable()
export class DevelopmentService {
  constructor(private readonly developmentRepository: DevelopmentRepository) {}

  async create(createDto: CreateDevelopmentDto): Promise<Development> {
    const developmentData: Partial<Development> = {
      ...createDto,
      status: createDto.status || DevelopmentStatus.PLANNING,
      priority: createDto.priority || DevelopmentPriority.MEDIUM,
      progress: createDto.progress || 0,
    };

    return this.developmentRepository.create(developmentData);
  }

  async findAll(): Promise<Development[]> {
    return this.developmentRepository.findAll();
  }

  async findWithFilters(filters: DevelopmentFilters): Promise<Development[]> {
    return this.developmentRepository.findWithFilters(filters);
  }

  async findOne(id: number): Promise<Development> {
    const development = await this.developmentRepository.findOne(id);
    if (!development) {
      throw new NotFoundException(`Development with ID ${id} not found`);
    }
    return development;
  }

  async findByStatus(status: DevelopmentStatus): Promise<Development[]> {
    return this.developmentRepository.findByStatus(status);
  }

  async findByPriority(priority: DevelopmentPriority): Promise<Development[]> {
    return this.developmentRepository.findWithFilters({ priority });
  }

  async findByAssignee(assignedToId: number): Promise<Development[]> {
    return this.developmentRepository.findByAssignedUser(assignedToId);
  }

  async findByTeam(teamId: number): Promise<Development[]> {
    return this.developmentRepository.findByTeam(teamId);
  }

  async update(id: number, updateDto: UpdateDevelopmentDto): Promise<Development> {
    await this.findOne(id); // Verificar que existe
    return this.developmentRepository.update(id, updateDto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar que existe
    await this.developmentRepository.remove(id);
  }

  async updateProgress(id: number, progress: number): Promise<Development> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    // Si el progreso es 100, cambiar status a COMPLETED
    const updateData: UpdateDevelopmentDto = { progress };
    if (progress === 100) {
      updateData.status = DevelopmentStatus.COMPLETED;
      updateData.endDate = new Date();
    }

    return this.update(id, updateData);
  }

  async changeStatus(id: number, status: DevelopmentStatus): Promise<Development> {
    const updateData: UpdateDevelopmentDto = { status };
    
    // Si se marca como completado, establecer fecha de fin y progreso 100%
    if (status === DevelopmentStatus.COMPLETED) {
      updateData.endDate = new Date();
      updateData.progress = 100;
    }

    return this.update(id, updateData);
  }

  async getMetrics(): Promise<DevelopmentMetricsResponseDto> {
    return this.developmentRepository.getMetrics();
  }

  async getOverdue(): Promise<Development[]> {
    const now = new Date();
    const developments = await this.developmentRepository.findWithFilters({
      status: DevelopmentStatus.PLANNING // Usar un solo valor en lugar de array
    });
    
    const inProgress = await this.developmentRepository.findWithFilters({
      status: DevelopmentStatus.IN_PROGRESS
    });
    
    const testing = await this.developmentRepository.findWithFilters({
      status: DevelopmentStatus.TESTING
    });

    const allNonCompleted = [...developments, ...inProgress, ...testing];
    
    return allNonCompleted.filter(dev => 
      dev.estimatedDate && 
      dev.estimatedDate < now && 
      dev.status !== DevelopmentStatus.COMPLETED
    );
  }

  async getDevelopmentsByDateRange(startDate: Date, endDate: Date): Promise<Development[]> {
    const allDevelopments = await this.developmentRepository.findAll();
    return allDevelopments.filter(dev => {
      const devStart = dev.startDate || dev.createdAt;
      return devStart >= startDate && devStart <= endDate;
    });
  }
} 