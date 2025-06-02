import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DevelopmentMicroservice } from './development-microservice.entity';

@Entity('microservices')
export class Microservice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  repository: string;

  @Column({ length: 100, nullable: true })
  technology: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => DevelopmentMicroservice, devMicro => devMicro.microservice)
  developmentMicroservices: DevelopmentMicroservice[];
}
