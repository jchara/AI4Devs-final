import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Environment } from '../../infrastructure/entities/environment.entity';
import { User } from '../../identity/entities/user.entity';
import { Team } from '../../identity/entities/team.entity';
import { DevelopmentComponent } from './development-component.entity';
import { DevelopmentDatabase } from './development-database.entity';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';
import { RecentActivity } from '../../activity/entities/recent-activity.entity';
import { UpcomingDeployment } from '../../infrastructure/entities/upcoming-deployment.entity';

@Entity('developments')
@Index(['isActive', 'deletedAt'])
export class Development {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: DevelopmentStatus,
    default: DevelopmentStatus.PLANNING,
  })
  status: DevelopmentStatus;

  @Column({
    type: 'enum',
    enum: DevelopmentPriority,
    default: DevelopmentPriority.MEDIUM,
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

  @Column({ nullable: true })
  jiraUrl: string;

  @Column({ nullable: true })
  branch: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  environmentId: number;

  @Column({ nullable: true })
  assignedToId: number;

  @Column({ nullable: true })
  teamId: number;

  @ManyToOne(() => Environment, { eager: true })
  @JoinColumn({ name: 'environmentId' })
  environment: Environment;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @ManyToOne(() => Team, { eager: true })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @OneToMany(
    () => DevelopmentComponent,
    (developmentComponent) => developmentComponent.development,
  )
  developmentComponents: DevelopmentComponent[];

  @OneToMany(
    () => DevelopmentDatabase,
    (developmentDatabase) => developmentDatabase.development,
  )
  developmentDatabases: DevelopmentDatabase[];

  @OneToMany(() => RecentActivity, (activity) => activity.development)
  activities: RecentActivity[];

  @OneToMany(() => UpcomingDeployment, (deployment) => deployment.development)
  deployments: UpcomingDeployment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
