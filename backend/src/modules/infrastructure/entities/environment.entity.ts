import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Development } from '../../project-management/entities/development.entity';

@Entity('environments')
export class Environment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 20, default: '#007bff' })
  color: string;

  @Column({ default: 1 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Development, development => development.environment)
  developments: Development[];
}
