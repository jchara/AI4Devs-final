import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Development } from './development.entity';
import { Microservice } from './microservice.entity';

@Entity('development_microservices')
export class DevelopmentMicroservice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 50, nullable: true })
  version: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Development, development => development.developmentMicroservices)
  @JoinColumn({ name: 'developmentId' })
  development: Development;

  @Column()
  developmentId: number;

  @ManyToOne(() => Microservice, microservice => microservice.developmentMicroservices)
  @JoinColumn({ name: 'microserviceId' })
  microservice: Microservice;

  @Column()
  microserviceId: number;
}
