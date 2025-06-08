import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentType } from '../../../shared/enums/component-type.enum';
import { DevelopmentComponent } from './development-component.entity';
import { Project } from './project.entity';

@Entity('components')
@Index(['isActive', 'deletedAt'])
@Index(['projectId'])
export class Component {
  @ApiProperty({ description: 'ID del componente' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del componente' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Descripción del componente' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Tipo de componente', enum: ComponentType })
  @Column({
    type: 'enum',
    enum: ComponentType,
    default: ComponentType.MONOLITH
  })
  type: ComponentType;

  @ApiProperty({ description: 'Versión del componente' })
  @Column({ nullable: true })
  version: string;

  @ApiProperty({ description: 'Indica si el componente está activo' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Tecnología del componente' })
  @Column()
  technology: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación' })
  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  projectId: number;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => DevelopmentComponent, developmentComponent => developmentComponent.component)
  developmentComponents: DevelopmentComponent[];
} 