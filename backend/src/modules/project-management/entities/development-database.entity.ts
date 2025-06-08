import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Database } from './database.entity';
import { Development } from './development.entity';
import { DatabaseChangeType } from '../../../shared/enums';

@Entity('development_databases')
@Index(['developmentId'])
export class DevelopmentDatabase {
  @ApiProperty({ description: 'ID del desarrollo de base de datos' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del desarrollo' })
  @Column()
  developmentId: number;

  @ApiProperty({ description: 'ID de la base de datos' })
  @Column()
  databaseId: number;

  @ApiProperty({ description: 'Tipo de cambio', enum: DatabaseChangeType })
  @Column({
    type: 'enum',
    enum: DatabaseChangeType,
  })
  changeType: DatabaseChangeType;

  @ApiProperty({ description: 'Descripción del cambio' })
  @Column('text')
  scriptDescription: string;

  @ApiProperty({ description: 'Notas del cambio' })
  @Column('text', { nullable: true })
  notes: string;

  @ApiProperty({ description: 'Estado del cambio' })
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

  // Relaciones
  @ManyToOne(() => Development, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'developmentId' })
  development: Development;

  @ManyToOne(() => Database, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'databaseId' })
  database: Database;
}
