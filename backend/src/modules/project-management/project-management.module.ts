import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from '../activity/activity.module';
import { RecentActivity } from '../activity/entities/recent-activity.entity';
import { Role, Team, User } from '../identity';
import { DeploymentType, Environment } from '../infrastructure';
import { UpcomingDeployment } from '../infrastructure/entities/upcoming-deployment.entity';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { Component } from './entities/component.entity';
import { Database } from './entities/database.entity';
import { DevelopmentComponent } from './entities/development-component.entity';
import { DevelopmentDatabase } from './entities/development-database.entity';
import { Development } from './entities/development.entity';
import { Project } from './entities/project.entity';

// Controllers
import { ComponentController } from './controllers/component.controller';
import { DatabaseController } from './controllers/database.controller';
import { DevelopmentComponentController } from './controllers/development-component.controller';
import { DevelopmentDatabaseController } from './controllers/development-database.controller';
import { DevelopmentController } from './controllers/development.controller';
import { ProjectController } from './controllers/project.controller';

// Repositories
import { ComponentRepository } from './repositories/component.repository';
import { DatabaseRepository } from './repositories/database.repository';
import { DevelopmentComponentRepository } from './repositories/development-component.repository';
import { DevelopmentDatabaseRepository } from './repositories/development-database.repository';
import { DevelopmentRepository } from './repositories/development.repository';
import { ProjectRepository } from './repositories/project.repository';
import { TeamRepository } from './repositories/team.repository';

// Services
import { ComponentService } from './services/component.service';
import { DatabaseService } from './services/database.service';
import { DevelopmentComponentService } from './services/development-component.service';
import { DevelopmentDatabaseService } from './services/development-database.service';
import { DevelopmentService } from './services/development.service';
import { ProjectService } from './services/project.service';
import { TeamService } from './services/team.service';

@Module({
  imports: [
    InfrastructureModule,
    ActivityModule,
    TypeOrmModule.forFeature([
      User,
      Role,
      Team,
      Project,
      Development,
      Component,
      Database,
      DevelopmentComponent,
      DevelopmentDatabase,
      RecentActivity,
      UpcomingDeployment,
      DeploymentType,
      Environment,
    ]),
  ],
  controllers: [
    ProjectController,
    ComponentController,
    DatabaseController,
    DevelopmentController,
    DevelopmentComponentController,
    DevelopmentDatabaseController,
  ],
  providers: [
    ProjectService,
    ComponentService,
    DatabaseService,
    DevelopmentService,
    DevelopmentComponentService,
    DevelopmentDatabaseService,
    ProjectRepository,
    ComponentRepository,
    DatabaseRepository,
    DevelopmentComponentRepository,
    DevelopmentDatabaseRepository,
    DevelopmentRepository,
    TeamService,
    TeamRepository,
  ],
  exports: [
    ProjectService,
    ComponentService,
    DatabaseService,
    DevelopmentService,
    DevelopmentComponentService,
    DevelopmentDatabaseService,
    ProjectRepository,
    ComponentRepository,
    DatabaseRepository,
    DevelopmentComponentRepository,
    DevelopmentDatabaseRepository,
    DevelopmentRepository,
    TeamService,
    TeamRepository,
  ],
})
export class ProjectManagementModule {}
