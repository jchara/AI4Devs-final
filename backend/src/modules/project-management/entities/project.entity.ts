import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, Index } from 'typeorm';
import { Component } from './component.entity';
import { ProjectType } from '../../../shared/enums/project-type.enum';

@Entity('projects')
@Index(['isActive', 'deletedAt'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  repositoryUrl: string;

  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.BACKEND
  })
  type: ProjectType;

  @Column('text')
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Component, component => component.project)
  components: Component[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
} 