import { Injectable } from '@angular/core';
import {
  BackendActivityResponse,
  BackendComponentResponse,
  BackendDevelopmentMetricsResponse,
  BackendDevelopmentResponse,
  BackendDevelopmentComponentResponse,
  StatusTranslationMap,
} from '../../shared/interfaces/backend-interfaces';
import {
  ActivityType,
  Component,
  ComponentType,
  DeploymentStatus,
  Development,
  DevelopmentMetrics,
  DevelopmentStatus,
  DevelopmentEnvironment,
  RecentActivity,
  UpcomingDeployment,
} from '../../shared/models/development.model';
import { Team, User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentMapper {
  /**
   * Mapea desarrollo del backend al frontend
   */
  static mapDevelopmentFromBackend(
    backendDev: BackendDevelopmentResponse
  ): Development {
    return {
      id: backendDev.id,
      title: backendDev.title,
      description: backendDev.description,
      status: this.mapStatusFromBackend(backendDev.status),
      priority: backendDev.priority || 'MEDIUM',
      environment: this.mapEnvironmentFromBackend(backendDev.environment),
      environmentId: backendDev.environmentId,
      projectId: backendDev.projectId,
      progress: backendDev.progress,
      isActive: backendDev.isActive,
      jiraUrl: backendDev.jiraUrl,
      branch: backendDev.branch,
      notes: backendDev.notes,
      startDate: new Date(backendDev.startDate || backendDev.createdAt),
      endDate: backendDev.endDate ? new Date(backendDev.endDate) : undefined,
      estimatedDate: new Date(backendDev.estimatedDate || backendDev.createdAt),
      assignedTo: this.mapUserFromBackend(backendDev.assignedTo),
      team: this.mapTeamFromBackend(backendDev.team),
      components: backendDev.components?.map((comp) =>
        this.mapComponentFromBackend(comp)
      ) || [],
      developmentComponents: backendDev.developmentComponents?.map((devComp: BackendDevelopmentComponentResponse) => ({
        id: devComp.id,
        component: this.mapComponentFromBackend(devComp.component),
        changeType: devComp.changeType,
        progress: devComp.progress,
        notes: devComp.notes,
        version: devComp.version,
        isActive: devComp.isActive,
        createdAt: new Date(devComp.createdAt),
        updatedAt: new Date(devComp.updatedAt)
      })) || [],
      recentActivities: [],
      upcomingDeployments: [],
      createdAt: new Date(backendDev.createdAt),
      updatedAt: new Date(backendDev.updatedAt),
      deletedAt: backendDev.deletedAt
        ? new Date(backendDev.deletedAt)
        : undefined,
    };
  }

  /**
   * Mapea desarrollo del frontend al backend para crear/actualizar
   */
  static mapDevelopmentToBackend(
    frontendDev: Partial<Development>
  ): Partial<BackendDevelopmentResponse> {
    const backendData: any = {};

    if (frontendDev.title) backendData.title = frontendDev.title;
    if (frontendDev.description) backendData.description = frontendDev.description;
    if (frontendDev.status) {
      backendData.status = StatusTranslationMap[frontendDev.status];
    }
    if (frontendDev.priority) backendData.priority = frontendDev.priority;
    if (frontendDev.environment) {
      backendData.environmentId = this.mapEnvironmentToId(frontendDev.environment);
    }
    if (frontendDev.jiraUrl) backendData.jiraUrl = frontendDev.jiraUrl;
    if (frontendDev.branch) backendData.branch = frontendDev.branch;
    if (frontendDev.notes) backendData.notes = frontendDev.notes;
    if (frontendDev.startDate) backendData.startDate = frontendDev.startDate.toISOString();
    if (frontendDev.endDate) backendData.endDate = frontendDev.endDate.toISOString();
    if (frontendDev.estimatedDate) backendData.estimatedDate = frontendDev.estimatedDate.toISOString();

    return backendData;
  }

  /**
   * Mapea métricas del backend al frontend
   */
  static mapMetricsFromBackend(
    backendMetrics: BackendDevelopmentMetricsResponse
  ): DevelopmentMetrics {
    return {
      total: backendMetrics.data.total,
      inDevelopment: backendMetrics.data.byStatus.inDevelopment,
      completed: backendMetrics.data.byStatus.completed,
      cancelled: backendMetrics.data.byStatus.cancelled,
      byEnvironment: backendMetrics.data.byEnvironment ?? {},
    };
  }

  /**
   * Mapea actividad del backend al frontend
   */
  static mapActivityFromBackend(
    activity: BackendActivityResponse
  ): RecentActivity {
    return {
      id: activity.id,
      type: this.mapActivityTypeFromBackend(activity.type),
      description: activity.description,
      user: this.mapUserFromBackend(activity.user),
      timestamp: new Date(activity.timestamp),
      createdAt: new Date(activity.timestamp),
      developmentId: activity.developmentId,
      isActive: activity.isActive,
    };
  }

  /**
   * Mapea componente del backend al frontend
   */
  static mapComponentFromBackend(comp: BackendComponentResponse): Component {
    return {
      id: comp.id,
      name: comp.name,
      type: this.mapComponentTypeFromBackend(comp.type),
      technology: comp.technology,
      version: comp.version,
      description: comp.description,
      isActive: comp.isActive,
      createdAt: new Date(comp.createdAt),
      updatedAt: new Date(comp.updatedAt),
    };
  }

  /**
   * Mapea environment ID a enum del frontend
   */
  private static mapEnvironmentFromId(environmentId?: number): DevelopmentEnvironment {
    switch (environmentId) {
      case 1:
        return DevelopmentEnvironment.DEVELOPMENT;
      case 2:
        return DevelopmentEnvironment.TESTING;
      case 3:
        return DevelopmentEnvironment.STAGING;
      case 4:
        return DevelopmentEnvironment.PRODUCTION;
      default:
        return DevelopmentEnvironment.DEVELOPMENT;
    }
  }

  /**
   * Mapea environment del frontend a ID para backend
   */
  private static mapEnvironmentToId(environment: DevelopmentEnvironment): number {
    switch (environment) {
      case DevelopmentEnvironment.DEVELOPMENT:
        return 1;
      case DevelopmentEnvironment.TESTING:
        return 2;
      case DevelopmentEnvironment.STAGING:
        return 3;
      case DevelopmentEnvironment.PRODUCTION:
        return 4;
      default:
        return 1;
    }
  }

  /**
   * Mapea un string a un objeto User
   */
  private static mapUserFromString(userString: string): User {
    return {
      id: 0, // Se asignará cuando se implemente la autenticación
      firstName: userString.split(' ')[0] || '',
      lastName: userString.split(' ').slice(1).join(' ') || '',
      email: '',
      roleId: 1, // ID por defecto
      teamId: 1, // ID por defecto
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Mapea un string a un objeto Team
   */
  private static mapTeamFromString(teamString: string): Team {
    return {
      id: 0, // Se asignará cuando se implemente la gestión de equipos
      name: teamString,
      description: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Mapea el tipo de componente del backend al enum del frontend
   */
  private static mapComponentType(backendType: string): ComponentType {
    switch (backendType.toLowerCase()) {
      case 'microservice':
        return ComponentType.MICROSERVICE;
      case 'microfrontend':
        return ComponentType.MICROFRONTEND;
      case 'monolith':
        return ComponentType.MONOLITH;
      default:
        return ComponentType.MICROSERVICE; // Valor por defecto
    }
  }

  private static mapStatusFromBackend(status: string): DevelopmentStatus {
    switch (status?.toUpperCase()) {
      case 'PLANNING':
        return DevelopmentStatus.PLANNING;
      case 'IN_PROGRESS':
        return DevelopmentStatus.IN_PROGRESS;
      case 'TESTING':
        return DevelopmentStatus.TESTING;
      case 'COMPLETED':
        return DevelopmentStatus.COMPLETED;
      case 'CANCELLED':
        return DevelopmentStatus.CANCELLED;
      default:
        return DevelopmentStatus.PLANNING;
    }
  }

  private static mapEnvironmentFromBackend(environment: any): DevelopmentEnvironment {
    if (!environment) {
      return DevelopmentEnvironment.DEVELOPMENT;
    }

    const envName = typeof environment === 'string' ? environment : environment.name;
    
    // LOG DEBUG: Ver qué valor exacto está llegando
    console.log('🔍 Mapper - environment recibido:', environment);
    console.log('🔍 Mapper - envName extraído:', envName, 'tipo:', typeof envName);
    console.log('🔍 Mapper - envName.toUpperCase():', envName?.toUpperCase());
    
    switch (envName?.toUpperCase()) {
      case 'DEVELOPMENT':
      case 'DESARROLLO':  // Soporte para español
        console.log('✅ Mapper - Mapeando a DEVELOPMENT');
        return DevelopmentEnvironment.DEVELOPMENT;
      case 'TESTING':
      case 'PRUEBAS':     // Soporte para español
        console.log('✅ Mapper - Mapeando a TESTING');
        return DevelopmentEnvironment.TESTING;
      case 'STAGING':
      case 'PREPRODUCCIÓN':  // Soporte para español
        console.log('✅ Mapper - Mapeando a STAGING');
        return DevelopmentEnvironment.STAGING;
      case 'PRODUCTION':
      case 'PRODUCCIÓN':  // Soporte para español
        console.log('✅ Mapper - Mapeando a PRODUCTION');
        return DevelopmentEnvironment.PRODUCTION;
      default:
        console.log('❌ Mapper - Cayendo en default, envName no reconocido:', envName?.toUpperCase());
        return DevelopmentEnvironment.DEVELOPMENT;
    }
  }

  private static mapUserFromBackend(user: any): User {
    if (!user) {
      return {
        id: 0,
        firstName: 'Sin asignar',
        lastName: '',
        email: '',
        roleId: 1,
        teamId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    if (typeof user === 'string') {
      return {
        id: 0,
        firstName: user,
        lastName: '',
        email: '',
        roleId: 1,
        teamId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      id: user.id || 0,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      roleId: user.roleId || 1,
      teamId: user.teamId || 1,
      role: user.role,
      team: user.team,
      isActive: user.isActive ?? true,
      createdAt: new Date(user.createdAt || new Date()),
      updatedAt: new Date(user.updatedAt || new Date()),
    };
  }

  private static mapTeamFromBackend(team: any): Team {
    if (!team) {
      return {
        id: 0,
        name: 'Sin equipo',
        description: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    if (typeof team === 'string') {
      return {
        id: 0,
        name: team,
        description: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      id: team.id || 0,
      name: team.name || '',
      description: team.description || '',
      isActive: team.isActive ?? true,
      createdAt: new Date(team.createdAt || new Date()),
      updatedAt: new Date(team.updatedAt || new Date()),
    };
  }

  private static mapComponentsFromBackend(components: any[]): Component[] {
    if (!Array.isArray(components)) {
      return [];
    }

    return components.map((comp) => ({
      id: comp.id || 0,
      name: comp.name || '',
      type: this.mapComponentType(comp.type),
      technology: comp.technology || '',
      version: comp.version || '',
      description: comp.description || '',
      isActive: comp.isActive || comp.is_active || false,
      createdAt: new Date(comp.createdAt || new Date()),
      updatedAt: new Date(comp.updatedAt || new Date()),
    }));
  }

  private static mapComponentTypeFromBackend(type: string): ComponentType {
    switch (type?.toUpperCase()) {
      case 'MICROSERVICE':
        return ComponentType.MICROSERVICE;
      case 'MICROFRONTEND':
        return ComponentType.MICROFRONTEND;
      case 'MONOLITH':
        return ComponentType.MONOLITH;
      default:
        return ComponentType.MICROSERVICE;
    }
  }

  private static mapActivityTypeFromBackend(type: string): ActivityType {
    switch (type?.toLowerCase()) {
      case 'development_created':
        return ActivityType.DEVELOPMENT_CREATED;
      case 'development_updated':
        return ActivityType.DEVELOPMENT_UPDATED;
      case 'status_changed':
        return ActivityType.STATUS_CHANGED;
      case 'microservice_added':
        return ActivityType.MICROSERVICE_ADDED;
      case 'microservice_removed':
        return ActivityType.MICROSERVICE_REMOVED;
      case 'progress_updated':
        return ActivityType.PROGRESS_UPDATED;
      case 'deployment_scheduled':
        return ActivityType.DEPLOYMENT_SCHEDULED;
      default:
        return ActivityType.DEVELOPMENT_UPDATED;
    }
  }

  static mapUpcomingDeploymentFromBackend(
    deployment: BackendDevelopmentResponse
  ): UpcomingDeployment {
    return {
      id: deployment.id,
      title: deployment.title,
      environment: this.mapEnvironmentFromBackend(deployment.environment),
      status: this.mapDeploymentStatusFromBackend(deployment.status),
      scheduledDate: new Date(deployment.updatedAt),
      isActive: deployment.isActive,
      createdAt: new Date(deployment.createdAt),
      updatedAt: new Date(deployment.updatedAt),
      deployedBy: this.mapUserFromBackend(deployment.assignedTo),
      // TODO: El deploymentType debería venir del backend
      deploymentType: {
        id: 1,
        name: 'Regular',
        description: 'Regular deployment',
        isActive: true,
        createdAt: new Date(deployment.createdAt),
        updatedAt: new Date(deployment.updatedAt),
      },
    };
  }

  private static mapDeploymentStatusFromBackend(
    status: string
  ): DeploymentStatus {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return DeploymentStatus.SCHEDULED;
      case 'IN_PROGRESS':
        return DeploymentStatus.IN_PROGRESS;
      case 'COMPLETED':
        return DeploymentStatus.COMPLETED;
      case 'FAILED':
        return DeploymentStatus.FAILED;
      case 'CANCELLED':
        return DeploymentStatus.CANCELLED;
      default:
        return DeploymentStatus.SCHEDULED;
    }
  }
}
