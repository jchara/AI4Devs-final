import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Development, DevelopmentStatus, DevelopmentPriority } from '../entities/development.entity';
import { DevelopmentRepositoryInterface, DevelopmentFilters } from './development.repository.interface';
import { DevelopmentMetricsResponseDto } from '../dto';

@Injectable()
export class DevelopmentRepository extends BaseRepository<Development> implements DevelopmentRepositoryInterface {
  constructor(
    @InjectRepository(Development)
    private developmentRepository: Repository<Development>,
  ) {
    super(developmentRepository);
  }

  // Relaciones estándar para usar en todos los métodos
  private readonly standardRelations = [
    'environment', 
    'assignedTo', 
    'team', 
    'developmentMicroservices', 
    'developmentMicroservices.microservice'
  ];

  async findWithFilters(filters: DevelopmentFilters): Promise<Development[]> {
    const where: FindOptionsWhere<Development> = { isActive: true };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.environmentId) {
      where.environmentId = filters.environmentId;
    }
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }
    if (filters.teamId) {
      where.teamId = filters.teamId;
    }
    if (filters.search) {
      where.title = Like(`%${filters.search}%`);
    }

    return this.developmentRepository.find({
      where,
      relations: this.standardRelations,
      order: { updatedAt: 'DESC' },
    });
  }

  async findByStatus(status: DevelopmentStatus): Promise<Development[]> {
    return this.developmentRepository.find({
      where: { status, isActive: true },
      relations: this.standardRelations,
    });
  }

  async findByTeam(teamId: number): Promise<Development[]> {
    return this.developmentRepository.find({
      where: { teamId, isActive: true },
      relations: this.standardRelations,
    });
  }

  async findByAssignedUser(userId: number): Promise<Development[]> {
    return this.developmentRepository.find({
      where: { assignedToId: userId, isActive: true },
      relations: this.standardRelations,
    });
  }

  async findByEnvironment(environmentId: number): Promise<Development[]> {
    return this.developmentRepository.find({
      where: { environmentId, isActive: true },
      relations: this.standardRelations,
    });
  }

  async getMetrics(): Promise<DevelopmentMetricsResponseDto> {
    const totalDevelopments = await this.developmentRepository.count({ where: { isActive: true } });
    
    // Contar por estado
    const planning = await this.developmentRepository.count({ 
      where: { status: DevelopmentStatus.PLANNING, isActive: true } 
    });
    const inProgress = await this.developmentRepository.count({ 
      where: { status: DevelopmentStatus.IN_PROGRESS, isActive: true } 
    });
    const testing = await this.developmentRepository.count({ 
      where: { status: DevelopmentStatus.TESTING, isActive: true } 
    });
    const completed = await this.developmentRepository.count({ 
      where: { status: DevelopmentStatus.COMPLETED, isActive: true } 
    });
    const cancelled = await this.developmentRepository.count({ 
      where: { status: DevelopmentStatus.CANCELLED, isActive: true } 
    });

    // Contar por prioridad
    const lowPriority = await this.developmentRepository.count({ 
      where: { priority: DevelopmentPriority.LOW, isActive: true } 
    });
    const mediumPriority = await this.developmentRepository.count({ 
      where: { priority: DevelopmentPriority.MEDIUM, isActive: true } 
    });
    const highPriority = await this.developmentRepository.count({ 
      where: { priority: DevelopmentPriority.HIGH, isActive: true } 
    });
    const criticalPriority = await this.developmentRepository.count({ 
      where: { priority: DevelopmentPriority.CRITICAL, isActive: true } 
    });

    // Calcular progreso promedio
    const developments = await this.developmentRepository.find({ 
      where: { isActive: true },
      select: ['progress']
    });
    const averageProgress = developments.length > 0 
      ? developments.reduce((sum, dev) => sum + dev.progress, 0) / developments.length 
      : 0;

    // Completados este mes
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const completedThisMonth = await this.developmentRepository
      .createQueryBuilder('development')
      .where('development.status = :status', { status: DevelopmentStatus.COMPLETED })
      .andWhere('development.isActive = :isActive', { isActive: true })
      .andWhere('development.endDate >= :currentMonth', { currentMonth })
      .getCount();

    // Desarrollos vencidos
    const now = new Date();
    const overdue = await this.developmentRepository
      .createQueryBuilder('development')
      .where('development.isActive = :isActive', { isActive: true })
      .andWhere('development.status != :completedStatus', { completedStatus: DevelopmentStatus.COMPLETED })
      .andWhere('development.estimatedDate < :now', { now })
      .getCount();

    return {
      totalDevelopments,
      byStatus: {
        [DevelopmentStatus.PLANNING]: planning,
        [DevelopmentStatus.IN_PROGRESS]: inProgress,
        [DevelopmentStatus.TESTING]: testing,
        [DevelopmentStatus.COMPLETED]: completed,
        [DevelopmentStatus.CANCELLED]: cancelled,
      },
      byPriority: {
        [DevelopmentPriority.LOW]: lowPriority,
        [DevelopmentPriority.MEDIUM]: mediumPriority,
        [DevelopmentPriority.HIGH]: highPriority,
        [DevelopmentPriority.CRITICAL]: criticalPriority,
      },
      averageProgress: Math.round(averageProgress * 100) / 100,
      completedThisMonth,
      overdue,
    };
  }

  async findAll(): Promise<Development[]> {
    return this.developmentRepository.find({
      where: { isActive: true },
      relations: this.standardRelations,
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Development | null> {
    return this.developmentRepository.findOne({
      where: { id, isActive: true },
      relations: this.standardRelations,
    });
  }
} 