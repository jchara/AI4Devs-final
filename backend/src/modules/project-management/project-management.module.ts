import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Development, DevelopmentMicroservice, Microservice } from './entities';
import { 
  DevelopmentRepository, 
  MicroserviceRepository, 
  DevelopmentMicroserviceRepository 
} from './repositories';
import { DevelopmentController } from './controllers';
import { DevelopmentService } from './services/development.service';

@Module({
  imports: [TypeOrmModule.forFeature([Development, DevelopmentMicroservice, Microservice])],
  controllers: [DevelopmentController],
  providers: [DevelopmentService, DevelopmentRepository, MicroserviceRepository, DevelopmentMicroserviceRepository],
  exports: [DevelopmentService, DevelopmentRepository, MicroserviceRepository, DevelopmentMicroserviceRepository, TypeOrmModule],
})
export class ProjectManagementModule {} 