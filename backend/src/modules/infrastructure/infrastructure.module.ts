import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment, DeploymentType, UpcomingDeployment } from './entities';
import { 
  EnvironmentRepository, 
  DeploymentTypeRepository, 
  UpcomingDeploymentRepository 
} from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Environment, DeploymentType, UpcomingDeployment])],
  providers: [EnvironmentRepository, DeploymentTypeRepository, UpcomingDeploymentRepository],
  exports: [EnvironmentRepository, DeploymentTypeRepository, UpcomingDeploymentRepository, TypeOrmModule],
})
export class InfrastructureModule {} 