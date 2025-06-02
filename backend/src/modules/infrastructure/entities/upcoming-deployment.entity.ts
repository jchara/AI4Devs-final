import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Development } from '../../project-management/entities/development.entity';
import { Environment } from './environment.entity';
import { User } from '../../identity/entities/user.entity';
import { DeploymentType } from './deployment-type.entity';

export enum DeploymentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

@Entity('upcoming_deployments')
export class UpcomingDeployment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DeploymentStatus,
    default: DeploymentStatus.SCHEDULED
  })
  status: DeploymentStatus;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualDate: Date;

  @Column({ length: 50, nullable: true })
  version: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Development, { nullable: true })
  @JoinColumn({ name: 'developmentId' })
  development: Development;

  @Column({ nullable: true })
  developmentId: number;

  @ManyToOne(() => Environment)
  @JoinColumn({ name: 'environmentId' })
  environment: Environment;

  @Column()
  environmentId: number;

  @ManyToOne(() => User, user => user.deployments, { nullable: true })
  @JoinColumn({ name: 'deployedById' })
  deployedBy: User;

  @Column({ nullable: true })
  deployedById: number;

  @ManyToOne(() => DeploymentType, type => type.deployments, { nullable: true })
  @JoinColumn({ name: 'deploymentTypeId' })
  deploymentType: DeploymentType;

  @Column({ nullable: true })
  deploymentTypeId: number;
}
