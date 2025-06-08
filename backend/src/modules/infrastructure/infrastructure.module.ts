import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment, DeploymentType, UpcomingDeployment } from './entities';
import { 
  EnvironmentRepository, 
  DeploymentTypeRepository, 
  UpcomingDeploymentRepository 
} from './repositories';
import { EnvironmentService } from './services';
import { EnvironmentController } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Environment, DeploymentType, UpcomingDeployment])
  ],
  providers: [
    EnvironmentRepository, 
    DeploymentTypeRepository, 
    UpcomingDeploymentRepository,
    EnvironmentService
  ],
  controllers: [EnvironmentController],
  exports: [
    EnvironmentRepository, 
    DeploymentTypeRepository, 
    UpcomingDeploymentRepository, 
    EnvironmentService,
    TypeOrmModule
  ],
})
export class InfrastructureModule {} 