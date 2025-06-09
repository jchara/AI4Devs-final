import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { DevelopmentMapper } from '../../../core/mappers/development.mapper';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  BackendActivityResponse,
  BackendComponentResponse,
  BackendDevelopmentMetricsResponse,
  BackendDevelopmentResponse,
} from '../../../shared/interfaces/backend-interfaces';
import {
  ActivityType,
  Component,
  ComponentType,
  DeploymentStatus,
  Development,
  DevelopmentFilter,
  DevelopmentMetrics,
  DevelopmentStatus,
  DevelopmentEnvironment,
  PaginatedResponse,
  RecentActivity,
  UpcomingDeployment,
} from '../../../shared/models/development.model';
import { Team, User } from '../../../shared/models/user.model';

interface DashboardData {
  developments: Development[];
  recentActivities: RecentActivity[];
  upcomingDeployments: UpcomingDeployment[];
}

interface ChartData {
  environment: string;
  count: number;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class DevelopmentService {
  private developmentsSubject = new BehaviorSubject<Development[]>([]);
  developments$ = this.developmentsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  /**
   * Obtener todos los desarrollos
   */
  getDevelopments(filter?: DevelopmentFilter): Observable<Development[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<any>('developments', filter).pipe(
      map((response) => {
        console.log('Respuesta completa del backend:', response);
        if (!response || !response.data || !Array.isArray(response.data)) {
          console.error('La respuesta del backend no tiene el formato esperado:', response);
          return [];
        }
        console.log('Datos de desarrollos:', response.data);
        return response.data.map((dev: any) => {
          console.log('Desarrollo individual:', dev);
          console.log('Environment del desarrollo:', dev.environment);
          return DevelopmentMapper.mapDevelopmentFromBackend(dev);
        });
      }),
      tap((developments) => {
        this.developmentsSubject.next(developments);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('Error al obtener desarrollos:', error);
        this.notificationService.showError('Error al obtener desarrollos');
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  /**
   * Obtener desarrollos paginados con filtros
   */
  getPaginatedDevelopments(
    filter?: DevelopmentFilter,
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<Development>> {
    this.loadingSubject.next(true);
    const params = { ...filter, page, pageSize };

    return this.apiService.get<any>('developments', params).pipe(
      map((response) => {
        if (!response || !Array.isArray(response.data)) {
          console.error(
            'La respuesta del backend no tiene el formato esperado:',
            response
          );
          return {
            data: [],
            pagination: {
              page,
              pageSize,
              total: 0,
              totalPages: 0,
            },
          };
        }

        const total = response.total || response.data.length;
        const totalPages = Math.ceil(total / pageSize);

        return {
          data: response.data.map((dev: any) =>
            DevelopmentMapper.mapDevelopmentFromBackend(dev)
          ),
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
        };
      }),
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        console.error('Error al obtener desarrollos paginados:', error);
        this.notificationService.showError('Error al obtener desarrollos');
        this.loadingSubject.next(false);
        return of({
          data: [],
          pagination: {
            page,
            pageSize,
            total: 0,
            totalPages: 0,
          },
        });
      })
    );
  }

  /**
   * Obtener métricas de desarrollos
   */
  getMetrics(): Observable<DevelopmentMetrics> {
    return this.apiService
      .get<BackendDevelopmentMetricsResponse>('developments/metrics')
      .pipe(
        map((backendMetrics) =>
          DevelopmentMapper.mapMetricsFromBackend(backendMetrics)
        ),
        catchError((error) => {
          console.error('Error getting metrics:', error);
          return of({
            total: 0,
            inDevelopment: 0,
            archived: 0,
            completed: 0,
          });
        })
      );
  }

  /**
   * Obtener actividades recientes
   */
  getRecentActivity(): Observable<RecentActivity[]> {
    return this.apiService
      .get<BackendActivityResponse[]>('api/activities', { limit: 10 })
      .pipe(
        map((activities) =>
          activities.map((activity) =>
            DevelopmentMapper.mapActivityFromBackend(activity)
          )
        ),
        catchError((error) => {
          console.error('Error getting recent activities:', error);
          return of([]);
        })
      );
  }

  /**
   * Obtener próximos despliegues
   */
  getUpcomingDeployments(): Observable<UpcomingDeployment[]> {
    return this.apiService
      .get<BackendDevelopmentResponse[]>('deployments/upcoming')
      .pipe(
        map((deployments) =>
          deployments.map(this.mapUpcomingDeploymentFromBackend)
        ),
        catchError((error) => {
          console.error('Error getting upcoming deployments:', error);
          return of([]);
        })
      );
  }

  private mapUpcomingDeploymentFromBackend(
    deployment: BackendDevelopmentResponse
  ): UpcomingDeployment {
    return {
      id: deployment.id,
      title: deployment.title,
      environment: this.mapEnvironmentFromBackend(deployment.environment),
      scheduledDate: new Date(deployment.createdAt),
      status: DeploymentStatus.SCHEDULED,
      isActive: deployment.isActive,
      createdAt: new Date(deployment.createdAt),
      updatedAt: new Date(deployment.updatedAt),
      deployedBy: this.mapUserFromString(
        deployment.assignedTo || 'Sin asignar'
      ),
      deploymentType: {
        id: 1,
        name: 'Regular',
        description: 'Regular deployment',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Obtener datos para gráficos
   */
  getChartData(): Observable<ChartData[]> {
    return this.getDevelopments().pipe(
      map((developments) => {
        const environmentCounts = developments.reduce((acc, dev) => {
          const env = dev.environment;
          acc[env] = (acc[env] || 0) + 1;
          return acc;
        }, {} as Record<DevelopmentEnvironment, number>);

        return [
          {
            environment: 'Local',
            count: environmentCounts[DevelopmentEnvironment.DEVELOPMENT] || 0,
            color: '#66C6EA',
          },
          {
            environment: 'Testing',
            count: environmentCounts[DevelopmentEnvironment.TESTING] || 0,
            color: '#7D2BE3',
          },
          {
            environment: 'QA',
            count: environmentCounts[DevelopmentEnvironment.STAGING] || 0,
            color: '#FF9800',
          },
          {
            environment: 'Production',
            count: environmentCounts[DevelopmentEnvironment.PRODUCTION] || 0,
            color: '#4CAF50',
          },
        ];
      }),
      catchError((error) => {
        console.error('Error getting chart data:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener desarrollo por ID
   */
  getDevelopmentById(id: number): Observable<Development | null> {
    this.loadingSubject.next(true);
    return this.apiService.get<any>(`developments/${id}`).pipe(
      map((response) => DevelopmentMapper.mapDevelopmentFromBackend(response)),
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        console.error('Error al obtener desarrollo:', error);
        this.notificationService.showError('Error al obtener desarrollo');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  /**
   * Obtener componentes
   */
  getComponents(): Observable<Component[]> {
    return this.apiService.get<BackendComponentResponse[]>('components').pipe(
      map((components) =>
        components.map((comp) =>
          DevelopmentMapper.mapComponentFromBackend(comp)
        )
      ),
      catchError((error) => {
        console.error('Error getting components:', error);
        return of([]);
      })
    );
  }

  /**
   * Crear desarrollo
   */
  createDevelopment(
    development: Partial<Development>
  ): Observable<Development | null> {
    this.loadingSubject.next(true);
    return this.apiService.post<any>('/developments', development).pipe(
      map((response) => DevelopmentMapper.mapDevelopmentFromBackend(response)),
      tap((newDevelopment) => {
        const currentDevelopments = this.developmentsSubject.value;
        this.developmentsSubject.next([...currentDevelopments, newDevelopment]);
        this.notificationService.showSuccess('Desarrollo creado exitosamente');
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('Error al crear desarrollo:', error);
        this.notificationService.showError('Error al crear desarrollo');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  /**
   * Actualizar desarrollo
   */
  updateDevelopment(
    id: number,
    development: Partial<Development>
  ): Observable<Development | null> {
    this.loadingSubject.next(true);
    return this.apiService.patch<any>(`/developments/${id}`, development).pipe(
      map((response) => DevelopmentMapper.mapDevelopmentFromBackend(response)),
      tap((updatedDevelopment) => {
        const currentDevelopments = this.developmentsSubject.value;
        const index = currentDevelopments.findIndex((d) => d.id === id);
        if (index !== -1) {
          currentDevelopments[index] = updatedDevelopment;
          this.developmentsSubject.next([...currentDevelopments]);
        }
        this.notificationService.showSuccess(
          'Desarrollo actualizado exitosamente'
        );
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('Error al actualizar desarrollo:', error);
        this.notificationService.showError('Error al actualizar desarrollo');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  /**
   * Eliminar desarrollo (soft delete)
   */
  deleteDevelopment(id: number): Observable<boolean> {
    this.loadingSubject.next(true);
    return this.apiService.delete(`/developments/${id}`).pipe(
      map(() => true),
      tap(() => {
        const currentDevelopments = this.developmentsSubject.value;
        this.developmentsSubject.next(
          currentDevelopments.filter((d) => d.id !== id)
        );
        this.notificationService.showSuccess(
          'Desarrollo eliminado exitosamente'
        );
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('Error al eliminar desarrollo:', error);
        this.notificationService.showError('Error al eliminar desarrollo');
        this.loadingSubject.next(false);
        return of(false);
      })
    );
  }

  /**
   * Cambiar estado de desarrollo
   */
  changeStatus(
    id: number,
    newStatus: DevelopmentStatus
  ): Observable<Development> {
    return this.apiService
      .patch<BackendDevelopmentResponse>(`developments/${id}/status`, {
        status: newStatus,
      })
      .pipe(
        map((response) => {
          this.notificationService.showSuccess(
            'Estado actualizado exitosamente'
          );
          return DevelopmentMapper.mapDevelopmentFromBackend(response);
        })
      );
  }

  /**
   * Obtener valor de propiedad para ordenamiento
   */
  private getPropertyValue(obj: Development, field: keyof Development): any {
    return obj[field];
  }

  getDashboardData(): Observable<any> {
    this.loadingSubject.next(true);
    return this.apiService.get<any>('dashboard').pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        console.error('Error al obtener datos del dashboard:', error);
        this.notificationService.showError(
          'Error al obtener datos del dashboard'
        );
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  private mapDevelopmentFromBackend(
    backendDev: BackendDevelopmentResponse
  ): Development {
    return {
      id: backendDev.id,
      title: backendDev.title,
      description: backendDev.description,
      status: this.mapStatusFromBackend(backendDev.status),
      priority: backendDev.priority || 'MEDIUM',
      environment: this.mapEnvironmentFromBackend(backendDev.environment),
      progress: backendDev.progress,
      isActive: backendDev.isActive,
      jiraUrl: backendDev.jiraUrl,
      branch: backendDev.branch,
      notes: backendDev.notes,
      startDate: new Date(backendDev.startDate || backendDev.createdAt),
      endDate: backendDev.endDate ? new Date(backendDev.endDate) : undefined,
      estimatedDate: new Date(backendDev.estimatedDate || backendDev.createdAt),
      assignedTo: this.mapUserFromString(
        backendDev.assignedTo || 'Sin asignar'
      ),
      team: this.mapTeamFromString(backendDev.team || 'Sin equipo'),
      components:
        backendDev.components?.map((comp: BackendComponentResponse) => ({
          id: comp.id,
          name: comp.name,
          type: this.mapComponentTypeFromBackend(comp.type),
          technology: comp.technology,
          version: comp.version,
          description: comp.description,
          isActive: comp.isActive,
          createdAt: new Date(comp.createdAt),
          updatedAt: new Date(comp.updatedAt),
        })) || [],
      developmentComponents:
        backendDev.developmentComponents?.map((devComp) => ({
          id: devComp.id,
          component: {
            id: devComp.component.id,
            name: devComp.component.name,
            type: this.mapComponentTypeFromBackend(devComp.component.type),
            technology: devComp.component.technology,
            version: devComp.component.version,
            description: devComp.component.description,
            isActive: devComp.component.isActive,
            createdAt: new Date(devComp.component.createdAt),
            updatedAt: new Date(devComp.component.updatedAt),
          },
          changeType: devComp.changeType,
          progress: devComp.progress,
          notes: devComp.notes,
          version: devComp.version,
          isActive: devComp.isActive,
          createdAt: new Date(devComp.createdAt),
          updatedAt: new Date(devComp.updatedAt),
        })) || [],
      recentActivities: [],
      upcomingDeployments: [],
      createdAt: new Date(backendDev.createdAt),
      updatedAt: new Date(backendDev.updatedAt),
      deletedAt: backendDev.deletedAt ? new Date(backendDev.deletedAt) : undefined
    };
  }

  private mapActivityFromBackend(
    activity: BackendActivityResponse
  ): RecentActivity {
    return {
      id: activity.id,
      type: this.mapActivityTypeFromBackend(activity.type),
      description: activity.description,
      user: this.mapUserFromString(activity.user),
      timestamp: new Date(activity.timestamp),
      createdAt: new Date(activity.timestamp),
      developmentId: activity.developmentId,
      isActive: activity.isActive,
    };
  }

  private mapUserFromString(userString: string): User {
    return {
      id: 0,
      firstName: userString.split(' ')[0] || '',
      lastName: userString.split(' ').slice(1).join(' ') || '',
      email: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'DEVELOPER',
    };
  }

  private mapTeamFromString(teamString: string): Team {
    return {
      id: 0,
      name: teamString,
      description: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private mapStatusFromBackend(status: string): DevelopmentStatus {
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

  private mapEnvironmentFromBackend(environment: string): DevelopmentEnvironment {
    switch (environment?.toUpperCase()) {
      case 'DEVELOPMENT':
        return DevelopmentEnvironment.DEVELOPMENT;
      case 'TESTING':
        return DevelopmentEnvironment.TESTING;
      case 'STAGING':
        return DevelopmentEnvironment.STAGING;
      case 'PRODUCTION':
        return DevelopmentEnvironment.PRODUCTION;
      default:
        return DevelopmentEnvironment.DEVELOPMENT;
    }
  }

  private mapComponentTypeFromBackend(type: string): ComponentType {
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

  private mapActivityTypeFromBackend(type: string): ActivityType {
    switch (type?.toUpperCase()) {
      case 'DEVELOPMENT_CREATED':
        return ActivityType.DEVELOPMENT_CREATED;
      case 'DEVELOPMENT_UPDATED':
        return ActivityType.DEVELOPMENT_UPDATED;
      case 'STATUS_CHANGED':
        return ActivityType.STATUS_CHANGED;
      case 'MICROSERVICE_ADDED':
        return ActivityType.MICROSERVICE_ADDED;
      case 'MICROSERVICE_REMOVED':
        return ActivityType.MICROSERVICE_REMOVED;
      case 'PROGRESS_UPDATED':
        return ActivityType.PROGRESS_UPDATED;
      case 'DEPLOYMENT_SCHEDULED':
        return ActivityType.DEPLOYMENT_SCHEDULED;
      default:
        return ActivityType.DEVELOPMENT_UPDATED;
    }
  }
}
