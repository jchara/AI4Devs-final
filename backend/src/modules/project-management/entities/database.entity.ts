import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseType } from '../../../shared/enums/database-type.enum';
import { DevelopmentDatabase } from './development-database.entity';
import { Environment } from '../../infrastructure/entities/environment.entity';
import { Project } from './project.entity';

@Entity('databases')
export class Database {
  @ApiProperty({ description: 'ID de la base de datos' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la base de datos' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Descripción de la base de datos' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Tipo de base de datos', enum: DatabaseType })
  @Column({
    type: 'enum',
    enum: DatabaseType,
    default: DatabaseType.POSTGRES
  })
  type: DatabaseType;

  @ApiProperty({ description: 'Versión de la base de datos' })
  @Column({ nullable: true })
  version: string;

  @ApiProperty({ description: 'Indica si la base de datos está activa' })
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  environmentId: number;

  @Column({ nullable: true })
  projectId: number;

  @ManyToOne(() => Environment, { eager: true })
  @JoinColumn({ name: 'environmentId' })
  environment: Environment;

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación' })
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => DevelopmentDatabase, developmentDatabase => developmentDatabase.database)
  developmentDatabases: DevelopmentDatabase[];
} 