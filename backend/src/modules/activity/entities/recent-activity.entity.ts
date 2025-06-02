import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Development } from '../../project-management/entities/development.entity';
import { User } from '../../identity/entities/user.entity';

export enum ActivityType {
  DEVELOPMENT_CREATED = 'development_created',
  DEVELOPMENT_UPDATED = 'development_updated',
  STATUS_CHANGED = 'status_changed',
  MICROSERVICE_ADDED = 'microservice_added',
  MICROSERVICE_REMOVED = 'microservice_removed',
  PROGRESS_UPDATED = 'progress_updated',
  DEPLOYMENT_SCHEDULED = 'deployment_scheduled'
}

@Entity('recent_activities')
export class RecentActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ActivityType
  })
  type: ActivityType;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Development, { nullable: true })
  @JoinColumn({ name: 'developmentId' })
  development: Development;

  @Column({ nullable: true })
  developmentId: number;

  @ManyToOne(() => User, user => user.activities, { nullable: true })
  @JoinColumn({ name: 'performedById' })
  performedBy: User;

  @Column({ nullable: true })
  performedById: number;
}
