import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Development, DevelopmentMicroservice, Microservice } from './entities';
import { 
  DevelopmentRepository, 
  MicroserviceRepository, 
  DevelopmentMicroserviceRepository 
} from './repositories';
import { DevelopmentController, MicroserviceController } from './controllers';
import { DevelopmentService, MicroserviceService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Development, DevelopmentMicroservice, Microservice])],
  controllers: [DevelopmentController, MicroserviceController],
  providers: [
    DevelopmentService, 
    MicroserviceService, 
    DevelopmentRepository, 
    MicroserviceRepository, 
    DevelopmentMicroserviceRepository
  ],
  exports: [
    DevelopmentService, 
    MicroserviceService, 
    DevelopmentRepository, 
    MicroserviceRepository, 
    DevelopmentMicroserviceRepository, 
    TypeOrmModule
  ],
})
export class ProjectManagementModule {} 