import { 
  BackendDevelopmentResponse, 
  BackendDevelopmentMetricsResponse,
  BackendActivityResponse,
  BackendMicroserviceResponse,
  BackendDevelopmentMicroserviceResponse,
  StatusTranslationMap,
  StatusToBackendMap,
  BackendDevelopmentStatus
} from '../models/backend-interfaces';
import { 
  Development, 
  DevelopmentMetrics, 
  RecentActivity,
  Microservice,
  DevelopmentMicroservice,
  DevelopmentStatus,
  ActivityType,
  Environment
} from '../../features/developments/models/development.model';

export class DevelopmentMapper {

  /**
   * Mapea desarrollo del backend al frontend
   */
  static mapDevelopmentFromBackend(backendDev: BackendDevelopmentResponse, externalMicroservices: Microservice[] = []): Development {
    // Obtener los microservicios del desarrollo si existen en la respuesta
    let microservices: Microservice[] = [];
    let developmentMicroservices: DevelopmentMicroservice[] = [];
    
    if (backendDev.developmentMicroservices && backendDev.developmentMicroservices.length > 0) {
      // Mapeamos los microservicios que vienen con el desarrollo
      microservices = backendDev.developmentMicroservices.map(devMicro => ({
        id: devMicro.microservice.id.toString(),
        name: devMicro.microservice.name,
        technology: devMicro.microservice.technology,
        description: devMicro.microservice.description,
        repository: devMicro.microservice.repository
      }));
      
      // Mapeamos la relación desarrollo-microservicio
      developmentMicroservices = backendDev.developmentMicroservices.map(devMicro => ({
        id: devMicro.id.toString(),
        microservice: {
          id: devMicro.microservice.id.toString(),
          name: devMicro.microservice.name,
          technology: devMicro.microservice.technology,
          description: devMicro.microservice.description,
          repository: devMicro.microservice.repository
        },
        progress: devMicro.progress,
        notes: devMicro.notes,
        version: devMicro.version
      }));
    } else {
      // Si no hay microservicios en la respuesta, usamos los externos (compatibilidad)
      microservices = externalMicroservices;
    }

    return {
      id: backendDev.id.toString(),
      title: backendDev.title,
      description: backendDev.description,
      status: StatusTranslationMap[backendDev.status] as DevelopmentStatus,
      environment: this.mapEnvironmentFromId(backendDev.environmentId),
      createdDate: new Date(backendDev.createdAt),
      updatedDate: new Date(backendDev.updatedAt),
      microservices: microservices,
      developmentMicroservices: developmentMicroservices.length > 0 ? developmentMicroservices : undefined,
      progress: `${backendDev.progress}%`,
      jiraUrl: backendDev.jiraUrl
    };
  }

  /**
   * Mapea desarrollo del frontend al backend para crear/actualizar
   */
  static mapDevelopmentToBackend(frontendDev: Partial<Development>): Partial<BackendDevelopmentResponse> {
    const backendData: any = {};
    
    if (frontendDev.title) backendData.title = frontendDev.title;
    if (frontendDev.description) backendData.description = frontendDev.description;
    if (frontendDev.status) {
      backendData.status = StatusToBackendMap[frontendDev.status];
    }
    if (frontendDev.environment) {
      backendData.environmentId = this.mapEnvironmentToId(frontendDev.environment);
    }
    if (frontendDev.jiraUrl) backendData.jiraUrl = frontendDev.jiraUrl;

    return backendData;
  }

  /**
   * Mapea métricas del backend al frontend
   */
  static mapMetricsFromBackend(backendMetrics: BackendDevelopmentMetricsResponse): DevelopmentMetrics {
    // Sumar estados del backend que corresponden a "En Desarrollo" en frontend
    const inDevelopment = (backendMetrics.byStatus[BackendDevelopmentStatus.PLANNING] || 0) +
                         (backendMetrics.byStatus[BackendDevelopmentStatus.IN_PROGRESS] || 0) +
                         (backendMetrics.byStatus[BackendDevelopmentStatus.TESTING] || 0);

    return {
      total: backendMetrics.totalDevelopments,
      inDevelopment: inDevelopment,
      completed: backendMetrics.byStatus[BackendDevelopmentStatus.COMPLETED] || 0,
      archived: backendMetrics.byStatus[BackendDevelopmentStatus.CANCELLED] || 0
    };
  }

  /**
   * Mapea actividad del backend al frontend
   */
  static mapActivityFromBackend(backendActivity: BackendActivityResponse): RecentActivity {
    return {
      id: backendActivity.id.toString(),
      type: this.mapActivityType(backendActivity.type),
      description: backendActivity.description,
      date: new Date(backendActivity.createdAt),
      developmentId: backendActivity.developmentId?.toString()
    };
  }

  /**
   * Mapea microservicio del backend al frontend
   */
  static mapMicroserviceFromBackend(backendMicroservice: BackendMicroserviceResponse): Microservice {
    return {
      id: backendMicroservice.id.toString(),
      name: backendMicroservice.name,
      technology: backendMicroservice.technology
    };
  }

  /**
   * Mapea environment ID a enum del frontend
   */
  private static mapEnvironmentFromId(environmentId?: number): Environment {
    switch (environmentId) {
      case 1: return Environment.DEVELOPMENT;
      case 2: return Environment.TESTING;
      case 3: return Environment.STAGING;
      case 4: return Environment.PRODUCTION;
      default: return Environment.DEVELOPMENT;
    }
  }

  /**
   * Mapea environment del frontend a ID para backend
   */
  private static mapEnvironmentToId(environment: Environment): number {
    switch (environment) {
      case Environment.DEVELOPMENT: return 1;
      case Environment.TESTING: return 2;
      case Environment.STAGING: return 3;
      case Environment.PRODUCTION: return 4;
      default: return 1;
    }
  }

  /**
   * Mapea tipo de actividad
   */
  private static mapActivityType(backendType: string): ActivityType {
    switch (backendType.toLowerCase()) {
      case 'deployment':
      case 'deploy':
        return ActivityType.DEPLOYMENT;
      case 'update':
      case 'modified':
        return ActivityType.UPDATE;
      case 'review':
      case 'reviewed':
        return ActivityType.REVIEW;
      case 'completed':
      case 'finished':
        return ActivityType.COMPLETED;
      default:
        return ActivityType.UPDATE;
    }
  }
} 