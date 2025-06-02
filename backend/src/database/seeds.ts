import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

// Nuevos repositorios de dominio
import { UserRepository, RoleRepository, TeamRepository } from '../modules/identity';
import { DevelopmentRepository, MicroserviceRepository, DevelopmentMicroserviceRepository } from '../modules/project-management';
import { EnvironmentRepository, DeploymentTypeRepository, UpcomingDeploymentRepository } from '../modules/infrastructure';
import { ActivityRepository } from '../modules/activity';

// Enums y tipos
import { DevelopmentStatus, DevelopmentPriority } from '../modules/project-management/entities/development.entity';
import { ActivityType } from '../modules/activity/entities/recent-activity.entity';
import { DeploymentStatus } from '../modules/infrastructure/entities/upcoming-deployment.entity';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Obtener repositorios
  const roleRepository = app.get(RoleRepository);
  const teamRepository = app.get(TeamRepository);
  const userRepository = app.get(UserRepository);
  const environmentRepository = app.get(EnvironmentRepository);
  const microserviceRepository = app.get(MicroserviceRepository);
  const developmentRepository = app.get(DevelopmentRepository);
  const developmentMicroserviceRepository = app.get(DevelopmentMicroserviceRepository);
  const deploymentTypeRepository = app.get(DeploymentTypeRepository);
  const upcomingDeploymentRepository = app.get(UpcomingDeploymentRepository);
  const activityRepository = app.get(ActivityRepository);

  console.log('🌱 Iniciando seeds con nueva arquitectura...');

  try {
    // 1. Crear Roles (verificar si ya existen)
    console.log('👥 Verificando y creando roles...');
    let roles = await roleRepository.findAll();
    
    if (roles.length === 0) {
      roles = await Promise.all([
        roleRepository.create({
          name: 'desarrollador',
          description: 'Desarrollador de software',
        }),
        roleRepository.create({
          name: 'QA',
          description: 'Quality Assurance - Analista de calidad',
        }),
        roleRepository.create({
          name: 'cloud',
          description: 'DevOps/Cloud Engineer - Especialista en infraestructura',
        }),
      ]);
      console.log('✅ Roles creados');
    } else {
      console.log('ℹ️ Roles ya existen, usando existentes');
    }

    // 2. Crear Teams (verificar si ya existen)
    console.log('🏢 Verificando y creando equipos...');
    let teams = await teamRepository.findAll();
    
    if (teams.length === 0) {
      teams = await Promise.all([
        teamRepository.create({
          name: 'Backend Team',
          description: 'Equipo de desarrollo backend',
        }),
        teamRepository.create({
          name: 'Frontend Team',
          description: 'Equipo de desarrollo frontend',
        }),
        teamRepository.create({
          name: 'DevOps Team',
          description: 'Equipo de infraestructura y despliegues',
        }),
        teamRepository.create({
          name: 'QA Team',
          description: 'Equipo de control de calidad',
        }),
      ]);
      console.log('✅ Equipos creados');
    } else {
      console.log('ℹ️ Equipos ya existen, usando existentes');
    }

    // 3. Crear Users (verificar si ya existen)
    console.log('👤 Verificando y creando usuarios...');
    let users = await userRepository.findAll();
    
    if (users.length === 0) {
      users = await Promise.all([
        userRepository.create({
          name: 'JCC',
          email: 'jcc@company.com',
          password: 'password123', // Se hasheará automáticamente
          roleId: roles[0].id, // desarrollador
          teamId: teams[0].id, // Backend Team
        }),
        userRepository.create({
          name: 'JLL',
          email: 'jll@company.com',
          password: 'password123', // Se hasheará automáticamente
          roleId: roles[2].id, // cloud
          teamId: teams[2].id, // DevOps Team
        }),
        userRepository.create({
          name: 'Maria QA',
          email: 'maria@company.com',
          password: 'password123',
          roleId: roles[1].id, // QA
          teamId: teams[3].id, // QA Team
        }),
      ]);
      console.log('✅ Usuarios creados');
    } else {
      console.log('ℹ️ Usuarios ya existen, usando existentes');
    }

    // 4. Crear Tipos de Despliegue (verificar si ya existen)
    console.log('🚀 Verificando y creando tipos de despliegue...');
    let deploymentTypes = await deploymentTypeRepository.findAll();
    
    if (deploymentTypes.length === 0) {
      deploymentTypes = await Promise.all([
        deploymentTypeRepository.create({
          name: 'release',
          description: 'Despliegue de nueva versión',
        }),
        deploymentTypeRepository.create({
          name: 'hotfix',
          description: 'Corrección urgente en producción',
        }),
        deploymentTypeRepository.create({
          name: 'rollback',
          description: 'Reversión a versión anterior',
        }),
        deploymentTypeRepository.create({
          name: 'maintenance',
          description: 'Mantenimiento programado',
        }),
      ]);
      console.log('✅ Tipos de despliegue creados');
    } else {
      console.log('ℹ️ Tipos de despliegue ya existen, usando existentes');
    }

    // 5. Crear Ambientes (verificar si ya existen)
    console.log('📦 Verificando y creando ambientes...');
    let environments = await environmentRepository.findAll();
    
    if (environments.length === 0) {
      environments = await Promise.all([
        environmentRepository.create({
          name: 'Desarrollo',
          description: 'Ambiente de desarrollo local',
          color: '#28a745',
          order: 1,
        }),
        environmentRepository.create({
          name: 'Testing',
          description: 'Ambiente de pruebas de integración',
          color: '#ffc107',
          order: 2,
        }),
        environmentRepository.create({
          name: 'Staging',
          description: 'Ambiente de pre-producción',
          color: '#fd7e14',
          order: 3,
        }),
        environmentRepository.create({
          name: 'Producción',
          description: 'Ambiente de producción',
          color: '#dc3545',
          order: 4,
        }),
      ]);
      console.log('✅ Ambientes creados');
    } else {
      console.log('ℹ️ Ambientes ya existen, usando existentes');
    }

    // 6. Crear Microservicios (verificar si ya existen)
    console.log('🔧 Verificando y creando microservicios...');
    let microservices = await microserviceRepository.findAll();
    
    if (microservices.length === 0) {
      microservices = await Promise.all([
        microserviceRepository.create({
          name: 'user-service',
          description: 'Servicio de gestión de usuarios',
          repository: 'https://github.com/company/user-service',
          technology: 'Node.js + Express',
        }),
        microserviceRepository.create({
          name: 'auth-service',
          description: 'Servicio de autenticación y autorización',
          repository: 'https://github.com/company/auth-service',
          technology: 'Node.js + NestJS',
        }),
        microserviceRepository.create({
          name: 'payment-service',
          description: 'Servicio de procesamiento de pagos',
          repository: 'https://github.com/company/payment-service',
          technology: 'Java + Spring Boot',
        }),
        microserviceRepository.create({
          name: 'notification-service',
          description: 'Servicio de notificaciones',
          repository: 'https://github.com/company/notification-service',
          technology: 'Python + FastAPI',
        }),
        microserviceRepository.create({
          name: 'analytics-service',
          description: 'Servicio de análisis y métricas',
          repository: 'https://github.com/company/analytics-service',
          technology: 'Python + Django',
        }),
      ]);
      console.log('✅ Microservicios creados');
    } else {
      console.log('ℹ️ Microservicios ya existen, usando existentes');
    }

    // 7. Crear Desarrollos (verificar si ya existen)
    console.log('💻 Verificando y creando desarrollos...');
    let developments = await developmentRepository.findAll();
    
    if (developments.length === 0) {
      developments = await Promise.all([
        developmentRepository.create({
          title: 'Implementación de autenticación OAuth 2.0',
          description: 'Migrar el sistema de autenticación actual a OAuth 2.0 para mejorar la seguridad',
          status: DevelopmentStatus.IN_PROGRESS,
          priority: DevelopmentPriority.HIGH,
          environmentId: environments[1].id, // Testing
          progress: 75,
          assignedToId: users[0].id, // JCC
          teamId: teams[0].id, // Backend Team
          repository: 'https://github.com/company/auth-upgrade',
          branch: 'feature/oauth2-implementation',
          startDate: new Date('2024-12-01'),
          estimatedDate: new Date('2025-01-15'),
          notes: 'Pendiente integración con servicios externos',
        }),
        developmentRepository.create({
          title: 'Optimización de consultas de base de datos',
          description: 'Mejorar el rendimiento de las consultas más frecuentes',
          status: DevelopmentStatus.TESTING,
          priority: DevelopmentPriority.MEDIUM,
          environmentId: environments[2].id, // Staging
          progress: 90,
          assignedToId: users[0].id, // JCC
          teamId: teams[0].id, // Backend Team
          repository: 'https://github.com/company/db-optimization',
          branch: 'feature/query-optimization',
          startDate: new Date('2024-11-15'),
          estimatedDate: new Date('2024-12-30'),
          notes: 'Tests de rendimiento completados satisfactoriamente',
        }),
        developmentRepository.create({
          title: 'API de notificaciones push',
          description: 'Desarrollar sistema de notificaciones en tiempo real',
          status: DevelopmentStatus.PLANNING,
          priority: DevelopmentPriority.MEDIUM,
          environmentId: environments[0].id, // Desarrollo
          progress: 25,
          assignedToId: users[0].id, // JCC
          teamId: teams[0].id, // Backend Team
          repository: 'https://github.com/company/push-notifications',
          branch: 'feature/push-api',
          startDate: new Date('2025-01-10'),
          estimatedDate: new Date('2025-02-28'),
          notes: 'Análisis de requisitos completado',
        }),
        developmentRepository.create({
          title: 'Dashboard de monitoreo en tiempo real',
          description: 'Interfaz para visualización de métricas del sistema',
          status: DevelopmentStatus.COMPLETED,
          priority: DevelopmentPriority.LOW,
          environmentId: environments[3].id, // Producción
          progress: 100,
          assignedToId: users[2].id, // Maria QA
          teamId: teams[1].id, // Frontend Team
          repository: 'https://github.com/company/monitoring-dashboard',
          branch: 'main',
          startDate: new Date('2024-10-01'),
          estimatedDate: new Date('2024-11-30'),
          endDate: new Date('2024-11-28'),
          notes: 'Proyecto completado exitosamente',
        }),
      ]);
      console.log('✅ Desarrollos creados');
    } else {
      console.log('ℹ️ Desarrollos ya existen, usando existentes');
    }

    // 8. Crear relaciones Development-Microservice
    console.log('🔗 Creando relaciones desarrollo-microservicios...');
    const developmentMicroservices = await Promise.all([
      // OAuth 2.0 - auth-service
      developmentMicroserviceRepository.create({
        developmentId: developments[0].id,
        microserviceId: microservices[1].id, // auth-service
        progress: 75,
        version: '2.1.0-beta',
        notes: 'Integración OAuth completada, pendiente testing',
      }),
      // OAuth 2.0 - user-service
      developmentMicroserviceRepository.create({
        developmentId: developments[0].id,
        microserviceId: microservices[0].id, // user-service
        progress: 50,
        version: '1.8.0-alpha',
        notes: 'Actualización de endpoints de usuario',
      }),
      // DB Optimization - user-service
      developmentMicroserviceRepository.create({
        developmentId: developments[1].id,
        microserviceId: microservices[0].id, // user-service
        progress: 100,
        version: '1.7.2',
        notes: 'Optimización de consultas completada',
      }),
      // Push Notifications - notification-service
      developmentMicroserviceRepository.create({
        developmentId: developments[2].id,
        microserviceId: microservices[3].id, // notification-service
        progress: 25,
        version: '1.2.0-dev',
        notes: 'Diseño de arquitectura en progreso',
      }),
      // Dashboard - analytics-service
      developmentMicroserviceRepository.create({
        developmentId: developments[3].id,
        microserviceId: microservices[4].id, // analytics-service
        progress: 100,
        version: '2.0.0',
        notes: 'Integración completada y desplegada',
      }),
    ]);

    // 9. Crear Próximos Despliegues
    console.log('📅 Creando próximos despliegues...');
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 3);
    
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 7);
    
    const futureDate3 = new Date();
    futureDate3.setDate(futureDate3.getDate() + 14);

    const upcomingDeployments = await Promise.all([
      upcomingDeploymentRepository.create({
        title: 'Deploy OAuth 2.0 a Staging',
        description: 'Despliegue de la nueva funcionalidad de autenticación',
        status: DeploymentStatus.SCHEDULED,
        scheduledDate: futureDate1,
        version: '2.1.0-beta',
        notes: 'Requiere coordinación con equipo de QA',
        developmentId: developments[0].id,
        environmentId: environments[2].id, // Staging
        deployedById: users[1].id, // JLL
        deploymentTypeId: deploymentTypes[0].id, // release
      }),
      upcomingDeploymentRepository.create({
        title: 'Hotfix en Producción - User Service',
        description: 'Corrección urgente en servicio de usuarios',
        status: DeploymentStatus.SCHEDULED,
        scheduledDate: futureDate2,
        version: '1.7.3-hotfix',
        notes: 'Corrección crítica de seguridad',
        environmentId: environments[3].id, // Producción
        deployedById: users[1].id, // JLL
        deploymentTypeId: deploymentTypes[1].id, // hotfix
      }),
      upcomingDeploymentRepository.create({
        title: 'Release Push Notifications v1.2.0',
        description: 'Primera versión del sistema de notificaciones',
        status: DeploymentStatus.SCHEDULED,
        scheduledDate: futureDate3,
        version: '1.2.0',
        notes: 'Deploy programado después de testing completo',
        developmentId: developments[2].id,
        environmentId: environments[1].id, // Testing
        deployedById: users[1].id, // JLL
        deploymentTypeId: deploymentTypes[0].id, // release
      }),
    ]);

    // 10. Crear Actividades
    console.log('📝 Creando actividades recientes...');
    const activities = await Promise.all([
      activityRepository.create({
        type: ActivityType.DEVELOPMENT_CREATED,
        description: 'Se creó el desarrollo "Implementación de autenticación OAuth 2.0"',
        developmentId: developments[0].id,
        performedById: users[0].id, // JCC
        metadata: { 
          priority: DevelopmentPriority.HIGH,
          environment: 'Testing' 
        },
      }),
      activityRepository.create({
        type: ActivityType.STATUS_CHANGED,
        description: 'Estado del desarrollo cambiado a "En Testing"',
        developmentId: developments[1].id,
        performedById: users[2].id, // Maria QA
        metadata: { 
          previousStatus: DevelopmentStatus.IN_PROGRESS,
          newStatus: DevelopmentStatus.TESTING 
        },
      }),
      activityRepository.create({
        type: ActivityType.PROGRESS_UPDATED,
        description: 'Progreso actualizado al 75%',
        developmentId: developments[0].id,
        performedById: users[0].id, // JCC
        metadata: { 
          previousProgress: 50,
          newProgress: 75 
        },
      }),
      activityRepository.create({
        type: ActivityType.DEPLOYMENT_SCHEDULED,
        description: 'Despliegue programado para OAuth 2.0',
        developmentId: developments[0].id,
        performedById: users[1].id, // JLL
        metadata: { 
          deploymentDate: futureDate1.toISOString(),
          environment: 'Staging' 
        },
      }),
      activityRepository.create({
        type: ActivityType.MICROSERVICE_ADDED,
        description: 'Microservicio auth-service asociado al desarrollo',
        developmentId: developments[0].id,
        performedById: users[0].id, // JCC
        metadata: { 
          microservice: 'auth-service',
          version: '2.1.0-beta' 
        },
      }),
    ]);

    console.log('✅ Seeds completados exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${roles.length} roles disponibles`);
    console.log(`   - ${teams.length} equipos disponibles`);
    console.log(`   - ${users.length} usuarios disponibles`);
    console.log(`   - ${deploymentTypes.length} tipos de despliegue disponibles`);
    console.log(`   - ${environments.length} ambientes disponibles`);
    console.log(`   - ${microservices.length} microservicios disponibles`);
    console.log(`   - ${developments.length} desarrollos disponibles`);
    console.log(`   - ${developmentMicroservices.length} relaciones desarrollo-microservicio creadas`);
    console.log(`   - ${upcomingDeployments.length} despliegues programados`);
    console.log(`   - ${activities.length} actividades registradas`);

  } catch (error) {
    console.error('❌ Error durante la ejecución de seeds:', error);
    throw error;
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  runSeeds()
    .then(() => {
      console.log('🎉 Seeds ejecutados correctamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en seeds:', error);
      process.exit(1);
    });
}
