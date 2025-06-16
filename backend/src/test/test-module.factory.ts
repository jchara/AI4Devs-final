import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTestConfig } from './test-config.helper';

// Importar todas las entidades
import { User } from '../modules/identity/entities/user.entity';
import { Role } from '../modules/identity/entities/role.entity';
import { Team } from '../modules/identity/entities/team.entity';
import { Project } from '../modules/project-management/entities/project.entity';
import { Component } from '../modules/project-management/entities/component.entity';
import { Database } from '../modules/project-management/entities/database.entity';
import { Development } from '../modules/project-management/entities/development.entity';
import { DevelopmentComponent } from '../modules/project-management/entities/development-component.entity';
import { DevelopmentDatabase } from '../modules/project-management/entities/development-database.entity';
import { Environment } from '../modules/infrastructure/entities/environment.entity';
import { UpcomingDeployment } from '../modules/infrastructure/entities/upcoming-deployment.entity';
import { DeploymentType } from '../modules/infrastructure/entities/deployment-type.entity';
import { RecentActivity } from '../modules/activity/entities/recent-activity.entity';

export interface TestModuleConfig {
  providers: any[];
  imports: any[];
}

/**
 * Crea configuración para tests de integración con BD real
 */
export const createIntegrationTestModule = (): TestModuleConfig => {
  return {
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test', // Archivo específico para tests
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'password'),
          database: configService.get('DB_DATABASE_TEST', 'devtracker_test'), // BD específica para tests
          entities: [
            User, Role, Team, Project, Component, Database,
            Development, DevelopmentComponent, DevelopmentDatabase,
            Environment, UpcomingDeployment, DeploymentType, RecentActivity
          ],
          synchronize: true, // Solo para tests
          dropSchema: true, // Limpiar BD en cada test
          logging: false,
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([
        User, Role, Team, Project, Component, Database,
        Development, DevelopmentComponent, DevelopmentDatabase,
        Environment, UpcomingDeployment, DeploymentType, RecentActivity
      ]),
    ],
    providers: [],
  };
};

/**
 * Crea configuración para tests unitarios con mocks
 */
export const createUnitTestModule = (): TestModuleConfig => {
  return {
    imports: [],
    providers: [
      // Mocks de repositorios
      {
        provide: 'UserRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'RoleRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'TeamRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'ProjectRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'ComponentRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'DatabaseRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'DevelopmentRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'DevelopmentComponentRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'DevelopmentDatabaseRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'EnvironmentRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'UpcomingDeploymentRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'DeploymentTypeRepository',
        useValue: createMockRepository(),
      },
      {
        provide: 'RecentActivityRepository',
        useValue: createMockRepository(),
      },
    ],
  };
};

/**
 * Factory principal que decide qué configuración usar
 */
export const createTestModule = (additionalProviders: any[] = []): TestingModuleBuilder => {
  const testConfig = getTestConfig();
  
  let moduleConfig: TestModuleConfig;
  
  if (testConfig.useRealDatabase) {
    console.log('🔗 Using Integration Test Module (Real Database)');
    moduleConfig = createIntegrationTestModule();
  } else {
    console.log('🎭 Using Unit Test Module (Mocked Dependencies)');
    moduleConfig = createUnitTestModule();
  }
  
  return Test.createTestingModule({
    imports: moduleConfig.imports,
    providers: [
      ...moduleConfig.providers,
      ...additionalProviders,
    ],
  });
};

/**
 * Crea un mock genérico de repositorio con métodos comunes
 */
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  count: jest.fn(),
  findAndCount: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    execute: jest.fn(),
  })),
});

/**
 * Crea mocks específicos para servicios complejos
 */
export const createMockService = (methods: string[]) => {
  const mockService = {};
  methods.forEach(method => {
    mockService[method] = jest.fn();
  });
  return mockService;
}; 