import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Development } from '../../project-management/entities/development.entity';
import { Database } from '../../project-management/entities/database.entity';
import { UpcomingDeployment } from './upcoming-deployment.entity';

@Entity('environments')
export class Environment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 20, default: '#007bff' })
  color: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Development, development => development.environment)
  developments: Development[];

  @OneToMany(() => Database, database => database.environment)
  databases: Database[];

  @OneToMany(() => UpcomingDeployment, deployment => deployment.environment)
  deployments: UpcomingDeployment[];
}
