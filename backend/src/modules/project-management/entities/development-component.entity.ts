import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Component } from './component.entity';
import { Development } from './development.entity';
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';

@Entity('development_components')
@Index(['developmentId'])
export class DevelopmentComponent {
  @ApiProperty({ description: 'ID del desarrollo de componente' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del desarrollo' })
  @Column()
  developmentId: number;

  @ApiProperty({ description: 'ID del componente' })
  @Column()
  componentId: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: DevelopmentComponentChangeType })
  @Column({
    type: 'enum',
    enum: DevelopmentComponentChangeType
  })
  changeType: DevelopmentComponentChangeType;

  @ApiProperty({ description: 'Progreso del desarrollo' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @ApiProperty({ description: 'Notas del desarrollo' })
  @Column('text', { nullable: true })
  notes: string;

  @ApiProperty({ description: 'Versión del desarrollo' })
  @Column({ nullable: true })
  version: string;

  @ApiProperty({ description: 'Estado del desarrollo' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación' })
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Development, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'developmentId' })
  development: Development;

  @ManyToOne(() => Component, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'componentId' })
  component: Component;
} 