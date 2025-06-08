import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Team } from './team.entity';
import { RecentActivity } from '../../activity/entities/recent-activity.entity';
import { Development } from '../../project-management/entities/development.entity';
import { UpcomingDeployment } from '../../infrastructure/entities/upcoming-deployment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  roleId: number;

  @ManyToOne(() => Team, (team) => team.users)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  teamId: number;

  @OneToMany(() => Development, (development) => development.assignedTo)
  assignedDevelopments: Development[];

  @OneToMany(() => RecentActivity, (activity) => activity.performedBy)
  activities: RecentActivity[];

  @OneToMany(() => UpcomingDeployment, (deployment) => deployment.deployedBy)
  deployments: UpcomingDeployment[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
} 