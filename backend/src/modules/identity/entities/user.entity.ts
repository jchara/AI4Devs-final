import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Team } from './team.entity';
import { Development } from '../../project-management/entities/development.entity';
import { RecentActivity } from '../../activity/entities/recent-activity.entity';
import { UpcomingDeployment } from '../../infrastructure/entities/upcoming-deployment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  roleId: number;

  @ManyToOne(() => Team, team => team.users)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  teamId: number;

  @OneToMany(() => Development, development => development.assignedTo)
  developments: Development[];

  @OneToMany(() => RecentActivity, activity => activity.performedBy)
  activities: RecentActivity[];

  @OneToMany(() => UpcomingDeployment, deployment => deployment.deployedBy)
  deployments: UpcomingDeployment[];
} 