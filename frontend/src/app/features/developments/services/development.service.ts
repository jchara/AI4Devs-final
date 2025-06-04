import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, map, catchError } from 'rxjs';
import { Development, DevelopmentMetrics, RecentActivity, UpcomingDeployment, ChartData, Microservice, DevelopmentFilter, DevelopmentSort, PaginatedResponse, DevelopmentStatus, Environment, ActivityType, DeploymentStatus } from '../models/development.model';
import { ApiService } from '../../../core/services/api.service';
import { DevelopmentMapper } from '../../../core/mappers/development.mapper';
import { 
  BackendDevelopmentResponse, 
  BackendDevelopmentMetricsResponse,
  BackendActivityResponse,
  BackendMicroserviceResponse,
  StatusToBackendMap
} from '../../../core/models/backend-interfaces';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentService {

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  /**
   * Obtener todos los desarrollos
   */
  getDevelopments(): Observable<Development[]> {
    return this.apiService.get<BackendDevelopmentResponse[]>('developments').pipe(
      map(developments => {
        return developments.map(dev => 
          DevelopmentMapper.mapDevelopmentFromBackend(dev)
        );
      }),
      catchError(error => {
        console.error('Error getting developments:', error);
        return of(this.getFallbackDevelopments());
      })
    );
  }

  /**
   * Obtener desarrollos paginados con filtros
   */
  getPaginatedDevelopments(
    filters?: DevelopmentFilter,
    pagination?: { page: number; pageSize: number },
    sort?: DevelopmentSort
  ): Observable<PaginatedResponse<Development>> {
    // Construir parámetros para el backend
    const params: any = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.status && filters.status !== 'all') {
      params.status = StatusToBackendMap[filters.status as DevelopmentStatus];
    }
    
    return this.apiService.get<BackendDevelopmentResponse[]>('developments', params).pipe(
      map(developments => {
        let mappedDevelopments = developments.map(dev => 
          DevelopmentMapper.mapDevelopmentFromBackend(dev)
        );

        // Aplicar filtros adicionales que no soporta el backend
        if (filters?.environment) {
          mappedDevelopments = mappedDevelopments.filter(d => d.environment === filters.environment);
        }

        // Aplicar ordenamiento local
        if (sort) {
          mappedDevelopments.sort((a, b) => {
            const aValue = this.getPropertyValue(a, sort.field);
            const bValue = this.getPropertyValue(b, sort.field);
            
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sort.direction === 'desc' ? -comparison : comparison;
          });
        }

        // Aplicar paginación local
        const { page = 0, pageSize = 20 } = pagination || {};
        const total = mappedDevelopments.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = page * pageSize;
        const paginatedData = mappedDevelopments.slice(startIndex, startIndex + pageSize);

        return {
          data: paginatedData,
          pagination: {
            page,
            pageSize,
            total,
            totalPages
          }
        };
      }),
      catchError(error => {
        console.error('Error getting paginated developments:', error);
        return of(this.getFallbackPaginatedResponse(pagination));
      })
    );
  }

  /**
   * Obtener métricas de desarrollos
   */
  getMetrics(): Observable<DevelopmentMetrics> {
    return this.apiService.get<BackendDevelopmentMetricsResponse>('developments/metrics').pipe(
      map(backendMetrics => DevelopmentMapper.mapMetricsFromBackend(backendMetrics)),
      catchError(error => {
        console.error('Error getting metrics:', error);
        return of(this.getFallbackMetrics());
      })
    );
  }

  /**
   * Obtener actividades recientes
   */
  getRecentActivity(): Observable<RecentActivity[]> {
    return this.apiService.get<BackendActivityResponse[]>('api/activities', { limit: 10 }).pipe(
      map(activities => activities.map(activity => 
        DevelopmentMapper.mapActivityFromBackend(activity)
      )),
      catchError(error => {
        console.error('Error getting recent activities:', error);
        return of(this.getFallbackRecentActivities());
      })
    );
  }

  /**
   * Obtener próximos despliegues (temporalmente mock hasta que esté el endpoint)
   */
  getUpcomingDeployments(): Observable<UpcomingDeployment[]> {
    // TODO: Implementar cuando esté disponible el endpoint
    return of(this.getFallbackUpcomingDeployments());
  }

  /**
   * Obtener datos para gráficos
   */
  getChartData(): Observable<ChartData[]> {
    // Usar métricas para generar datos del gráfico
    return this.getDevelopments().pipe(
      map(developments => {
        const environmentCounts = developments.reduce((acc, dev) => {
          const env = dev.environment;
          acc[env] = (acc[env] || 0) + 1;
          return acc;
        }, {} as Record<Environment, number>);

        return [
          {
            environment: 'Local',
            count: environmentCounts[Environment.DEVELOPMENT] || 0,
            color: '#66C6EA'
          },
          {
            environment: 'Testing',
            count: environmentCounts[Environment.TESTING] || 0,
            color: '#7D2BE3'
          },
          {
            environment: 'QA',
            count: environmentCounts[Environment.STAGING] || 0,
            color: '#FF9800'
          },
          {
            environment: 'Production',
            count: environmentCounts[Environment.PRODUCTION] || 0,
            color: '#4CAF50'
          }
        ];
      }),
      catchError(error => {
        console.error('Error getting chart data:', error);
        return of(this.getFallbackChartData());
      })
    );
  }

  /**
   * Obtener desarrollo por ID
   */
  getDevelopmentById(id: string): Observable<Development | undefined> {
    return this.apiService.get<BackendDevelopmentResponse>(`developments/${id}`).pipe(
      map(development => 
        DevelopmentMapper.mapDevelopmentFromBackend(development)
      ),
      catchError(error => {
        console.error('Error getting development by id:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Obtener microservicios
   */
  getMicroservices(): Observable<Microservice[]> {
    return this.getMicroservicesData();
  }

  /**
   * Crear desarrollo
   */
  createDevelopment(development: Omit<Development, 'id' | 'createdDate' | 'updatedDate'>): Observable<Development> {
    const backendData = DevelopmentMapper.mapDevelopmentToBackend(development);
    
    return this.apiService.post<BackendDevelopmentResponse>('developments', backendData).pipe(
      map(response => {
        this.notificationService.showSuccess('Desarrollo creado exitosamente');
        return DevelopmentMapper.mapDevelopmentFromBackend(response, development.microservices);
      })
    );
  }

  /**
   * Actualizar desarrollo
   */
  updateDevelopment(id: string, development: Partial<Development>): Observable<Development> {
    const backendData = DevelopmentMapper.mapDevelopmentToBackend(development);
    
    return this.apiService.patch<BackendDevelopmentResponse>(`developments/${id}`, backendData).pipe(
      map(response => {
        this.notificationService.showSuccess('Desarrollo actualizado exitosamente');
        return DevelopmentMapper.mapDevelopmentFromBackend(response);
      })
    );
  }

  /**
   * Eliminar desarrollo
   */
  deleteDevelopment(id: string): Observable<void> {
    return this.apiService.delete<void>(`developments/${id}`).pipe(
      map(() => {
        this.notificationService.showSuccess('Desarrollo eliminado exitosamente');
      })
    );
  }

  /**
   * Cambiar estado de desarrollo
   */
  changeStatus(id: string, newStatus: DevelopmentStatus): Observable<Development> {
    const backendStatus = StatusToBackendMap[newStatus];
    
    return this.apiService.patch<BackendDevelopmentResponse>(`developments/${id}/status`, { 
      status: backendStatus 
    }).pipe(
      map(response => {
        this.notificationService.showSuccess(`Estado cambiado a: ${newStatus}`);
        return DevelopmentMapper.mapDevelopmentFromBackend(response);
      })
    );
  }

  // =============================================================================
  // MÉTODOS PRIVADOS Y FALLBACKS
  // =============================================================================

  /**
   * Obtener microservicios desde el backend
   */
  private getMicroservicesData(): Observable<Microservice[]> {
    // TODO: Cambiar cuando esté disponible el endpoint de microservicios
    return of(this.getFallbackMicroservices());
  }

  private getPropertyValue(obj: Development, field: keyof Development): any {
    return obj[field];
  }

  // Fallbacks para cuando falla el backend
  private getFallbackDevelopments(): Development[] {
    return [
      {
        id: '1',
        title: 'API de notificaciones push',
        status: DevelopmentStatus.DEVELOPMENT,
        environment: Environment.TESTING,
        createdDate: new Date('2024-02-06T21:41:00'),
        updatedDate: new Date('2024-03-06T08:09:00'),
        description: 'Desarrollar sistema de notificaciones en tiempo real',
        microservices: [
          { id: '1', name: 'Auth Service', technology: 'NestJS' },
          { id: '2', name: 'User Service', technology: 'Python' },
          { id: '3', name: 'Payment Service', technology: 'Node.js' }
        ],
        progress: '25.00%',
        jiraUrl: 'https://devtracker.atlassian.net/browse/DT-123'
      }
    ];
  }

  private getFallbackPaginatedResponse(pagination?: { page: number; pageSize: number }): PaginatedResponse<Development> {
    const fallbackData = this.getFallbackDevelopments();
    const { page = 0, pageSize = 20 } = pagination || {};
    
    return {
      data: fallbackData,
      pagination: {
        page,
        pageSize,
        total: fallbackData.length,
        totalPages: Math.ceil(fallbackData.length / pageSize)
      }
    };
  }

  private getFallbackMetrics(): DevelopmentMetrics {
    return {
      total: 1,
      inDevelopment: 1,
      archived: 0,
      completed: 0
    };
  }

  private getFallbackRecentActivities(): RecentActivity[] {
    return [
      {
        id: '1',
        type: ActivityType.COMPLETED,
        description: 'Sin actividad',
        date: new Date(),
        developmentId: '1'
      }
    ];
  }

  private getFallbackUpcomingDeployments(): UpcomingDeployment[] {
    return [
      {
        id: '1',
        name: 'Sin despliegues',
        environment: Environment.PRODUCTION,
        scheduledDate: new Date(),
        status: DeploymentStatus.SCHEDULED
      }
    ];
  }

  private getFallbackChartData(): ChartData[] {
    return [
      { environment: 'Local', count: 0, color: '#66C6EA' },
      { environment: 'Testing', count: 0, color: '#7D2BE3' },
      { environment: 'QA', count: 0, color: '#FF9800' },
      { environment: 'Production', count: 0, color: '#4CAF50' }
    ];
  }

  private getFallbackMicroservices(): Microservice[] {
    return [
      { id: '1', name: 'Auth Service', technology: 'NestJS' },
      { id: '2', name: 'User Service', technology: 'Python' },
      { id: '3', name: 'Payment Service', technology: 'Node.js' }
    ];
  }
}
