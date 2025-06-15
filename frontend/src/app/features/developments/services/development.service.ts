import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  forkJoin,
} from 'rxjs';
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
  metrics: {
    total: number;
    inDevelopment: number;
    completed: number;
    cancelled: number;
  };
  developments: Development[];
  chartData: ChartData[];
  recentActivities: RecentActivity[];
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
        if (!response || !response.data || !Array.isArray(response.data)) {
          console.error(
            'La respuesta del backend no tiene el formato esperado:',
            response
          );
          return [];
        }
        return response.data.map((dev: any) => {
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
            cancelled: 0,
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
      .get<any>('api/activities/recent', { limit: 10 })
      .pipe(
        map((response) => {
          
          // Si la respuesta es un array directamente
          if (Array.isArray(response)) {
            return response.map((activity: any) => this.mapActivityFromBackend(activity));
          }
          
          // Si la respuesta tiene una propiedad data
          if (response && Array.isArray(response.data)) {
            return response.data.map((activity: any) => this.mapActivityFromBackend(activity));
          }
          
          // Si no hay datos, devolver array vacío
          return [];
        }),
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
    return this.apiService.post<any>('developments', development).pipe(
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
    return this.apiService.patch<any>(`developments/${id}`, development).pipe(
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
    return this.apiService.delete(`developments/${id}`).pipe(
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

  getDashboardData(): Observable<DashboardData> {
    this.loadingSubject.next(true);

    return forkJoin({
      metrics: this.getMetrics(),
      developments: this.getDevelopments(),
      recentActivities: this.getRecentActivity(),
    }).pipe(
      map(({ metrics, developments, recentActivities }) => ({
        metrics,
        developments: Array.isArray(developments) ? developments : [],
        recentActivities: Array.isArray(recentActivities)
          ? recentActivities
          : [],
        chartData: this.generateChartDataFromMetrics(metrics),
      })),
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        console.error('Error loading dashboard data:', error);
        this.loadingSubject.next(false);
        return of({
          metrics: {
            total: 0,
            inDevelopment: 0,
            completed: 0,
            cancelled: 0,
          },
          developments: [],
          recentActivities: [],
          chartData: [],
        });
      })
    );
  }

  private generateChartDataFromMetrics(metrics: any): ChartData[] {
    if (!metrics || !metrics.byEnvironment) return [];
    const chartData = Object.entries(metrics.byEnvironment).map(
      ([environment, count]) => ({
        environment: environment as string,
        count: Number(count),
        color: this.getEnvironmentColor(environment),
      })
    );
    return chartData;
  }

  private getEnvironmentColor(environment: string): string {
    const env = environment.toLowerCase();
    if (env.includes('dev') || env.includes('desar')) return '#2196f3';
    if (env.includes('stag')) return '#ff9800';
    if (env.includes('prod') || env.includes('produc')) return '#4caf50';
    if (env.includes('test')) return '#9c27b0';
    return '#757575';
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
      deletedAt: backendDev.deletedAt
        ? new Date(backendDev.deletedAt)
        : undefined,
    };
  }

  private mapActivityFromBackend(
    activity: any
  ): RecentActivity {
    return {
      id: activity.id,
      type: this.mapActivityTypeFromBackend(activity.type),
      description: activity.description,
      user: activity.performedBy ? {
        id: activity.performedBy.id,
        firstName: activity.performedBy.firstName || 'Usuario',
        lastName: activity.performedBy.lastName || 'Desconocido',
        email: activity.performedBy.email || '',
        isActive: activity.performedBy.isActive || true,
        createdAt: new Date(activity.performedBy.createdAt || new Date()),
        updatedAt: new Date(activity.performedBy.updatedAt || new Date()),
        role: activity.performedBy.role?.name || 'DEVELOPER',
      } : this.mapUserFromString('Usuario Desconocido'),
      timestamp: new Date(activity.createdAt),
      createdAt: new Date(activity.createdAt),
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

  private mapEnvironmentFromBackend(
    environment: string
  ): DevelopmentEnvironment {
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
