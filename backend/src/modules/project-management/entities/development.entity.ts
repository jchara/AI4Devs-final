import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Environment } from '../../infrastructure/entities/environment.entity';
import { DevelopmentMicroservice } from './development-microservice.entity';
import { User } from '../../identity/entities/user.entity';
import { Team } from '../../identity/entities/team.entity';

export enum DevelopmentStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum DevelopmentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

@Entity('developments')
export class Development {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DevelopmentStatus,
    default: DevelopmentStatus.PLANNING
  })
  status: DevelopmentStatus;

  @Column({
    type: 'enum',
    enum: DevelopmentPriority,
    default: DevelopmentPriority.MEDIUM
  })
  priority: DevelopmentPriority;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  estimatedDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column({ length: 255, nullable: true })
  repository: string;

  @Column({ length: 100, nullable: true })
  branch: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Environment, environment => environment.developments)
  @JoinColumn({ name: 'environmentId' })
  environment: Environment;

  @Column()
  environmentId: number;

  @ManyToOne(() => User, user => user.developments, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: number;

  @ManyToOne(() => Team, team => team.developments, { nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ nullable: true })
  teamId: number;

  @OneToMany(() => DevelopmentMicroservice, devMicro => devMicro.development)
  developmentMicroservices: DevelopmentMicroservice[];
}
