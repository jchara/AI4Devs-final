import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  Development, 
  Microservice,
  DevelopmentMetrics, 
  RecentActivity, 
  UpcomingDeployment, 
  ChartData,
  DevelopmentStatus,
  Environment,
  ActivityType,
  DeploymentStatus,
  DevelopmentFilter,
  DevelopmentPagination,
  DevelopmentSort,
  PaginatedResponse
} from '../models/development.model';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentService {

  private mockMicroservices: Microservice[] = [
    { id: '1', name: 'Auth Service', technology: 'NestJS', icon: 'nestjs' },
    { id: '2', name: 'Payment API', technology: 'Node.js', icon: 'nodejs' },
    { id: '3', name: 'User Service', technology: 'Python', icon: 'python' },
    { id: '4', name: 'Notification Service', technology: 'NestJS', icon: 'nestjs' },
    { id: '5', name: 'Analytics API', technology: 'Python', icon: 'python' },
    { id: '6', name: 'File Service', technology: 'Node.js', icon: 'nodejs' }
  ];

  private mockDevelopments: Development[] = [
    {
      id: '1',
      name: 'Sistema de Autenticación Segura',
      status: DevelopmentStatus.DEVELOPMENT,
      environment: Environment.TESTING,
      createdDate: new Date('2024-01-10'),
      updatedDate: new Date('2024-01-15'),
      author: 'Carlos Mendoza',
      description: 'Implementación de autenticación JWT con refresh tokens y 2FA',
      microservices: [this.mockMicroservices[0]],
      version: 'v2.1.0'
    },
    {
      id: '2',
      name: 'Pasarela de Pagos Integrada',
      status: DevelopmentStatus.COMPLETED,
      environment: Environment.PRODUCTION,
      createdDate: new Date('2024-01-05'),
      updatedDate: new Date('2024-01-14'),
      author: 'Ana García',
      description: 'Integración con múltiples proveedores de pago',
      microservices: [this.mockMicroservices[1]],
      version: 'v1.5.2'
    },
    {
      id: '3',
      name: 'Gestión de Perfiles de Usuario',
      status: DevelopmentStatus.DEVELOPMENT,
      environment: Environment.DEVELOPMENT,
      createdDate: new Date('2024-01-08'),
      updatedDate: new Date('2024-01-13'),
      author: 'Luis Rodriguez',
      description: 'Sistema completo de gestión de perfiles y preferencias',
      microservices: [this.mockMicroservices[2]],
      version: 'v3.0.0-beta'
    },
    {
      id: '4',
      name: 'Sistema de Notificaciones Push',
      status: DevelopmentStatus.ARCHIVED,
      environment: Environment.DEVELOPMENT,
      createdDate: new Date('2024-01-06'),
      updatedDate: new Date('2024-01-12'),
      author: 'María López',
      description: 'Notificaciones en tiempo real multiplataforma',
      microservices: [this.mockMicroservices[3]],
      version: 'v1.0.0'
    },
    {
      id: '5',
      name: 'Dashboard de Analytics',
      status: DevelopmentStatus.DEVELOPMENT,
      environment: Environment.TESTING,
      createdDate: new Date('2024-01-04'),
      updatedDate: new Date('2024-01-11'),
      author: 'David Morales',
      description: 'Análisis de datos y métricas en tiempo real',
      microservices: [this.mockMicroservices[4]],
      version: 'v2.3.1'
    },
    {
      id: '6',
      name: 'Gestor de Archivos en la Nube',
      status: DevelopmentStatus.DEVELOPMENT,
      environment: Environment.DEVELOPMENT,
      createdDate: new Date('2024-01-07'),
      updatedDate: new Date('2024-01-16'),
      author: 'Sofia Ruiz',
      description: 'Upload, procesamiento y almacenamiento de archivos',
      microservices: [this.mockMicroservices[5]],
      version: 'v1.2.0'
    },
    {
      id: '7',
      name: 'API de Integración Empresarial',
      status: DevelopmentStatus.COMPLETED,
      environment: Environment.PRODUCTION,
      createdDate: new Date('2024-01-03'),
      updatedDate: new Date('2024-01-17'),
      author: 'Roberto Silva',
      description: 'Conectores para sistemas externos empresariales',
      microservices: [this.mockMicroservices[0], this.mockMicroservices[1]],
      version: 'v1.8.0'
    },
    {
      id: '8',
      name: 'Motor de Recomendaciones',
      status: DevelopmentStatus.ARCHIVED,
      environment: Environment.TESTING,
      createdDate: new Date('2024-01-09'),
      updatedDate: new Date('2024-01-18'),
      author: 'Elena Vega',
      description: 'IA para recomendaciones personalizadas',
      microservices: [this.mockMicroservices[4], this.mockMicroservices[2]],
      version: 'v0.9.0'
    }
  ];

  private mockRecentActivities: RecentActivity[] = [
    {
      id: '1',
      type: ActivityType.DEPLOYMENT,
      description: 'Auth Service desplegado a QA',
      date: new Date('2024-01-15T10:30:00'),
      developmentId: '1'
    },
    {
      id: '2',
      type: ActivityType.UPDATE,
      description: 'Nueva versión de Payment API',
      date: new Date('2024-01-14T16:45:00'),
      developmentId: '2'
    },
    {
      id: '3',
      type: ActivityType.REVIEW,
      description: 'User Service en revisión',
      date: new Date('2024-01-13T09:15:00'),
      developmentId: '3'
    }
  ];

  private mockUpcomingDeployments: UpcomingDeployment[] = [
    {
      id: '1',
      name: 'Notification Service',
      environment: Environment.STAGING,
      scheduledDate: new Date('2024-01-20'),
      status: DeploymentStatus.SCHEDULED
    },
    {
      id: '2',
      name: 'Analytics API',
      environment: Environment.PRODUCTION,
      scheduledDate: new Date('2024-01-22'),
      status: DeploymentStatus.SCHEDULED
    },
    {
      id: '3',
      name: 'Search Service',
      environment: Environment.TESTING,
      scheduledDate: new Date('2024-01-25'),
      status: DeploymentStatus.SCHEDULED
    }
  ];

  constructor() { }

  getDevelopments(): Observable<Development[]> {
    return of(this.mockDevelopments).pipe(delay(300));
  }

  getPaginatedDevelopments(
    filters?: DevelopmentFilter,
    pagination?: { page: number; pageSize: number },
    sort?: DevelopmentSort
  ): Observable<PaginatedResponse<Development>> {
    let filteredDevelopments = [...this.mockDevelopments];

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredDevelopments = filteredDevelopments.filter(d =>
          d.name.toLowerCase().includes(searchTerm) ||
          d.description?.toLowerCase().includes(searchTerm) ||
          d.author.toLowerCase().includes(searchTerm) ||
          d.microservices.some(m => m.name.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.status && filters.status !== 'all') {
        filteredDevelopments = filteredDevelopments.filter(d => d.status === filters.status);
      }

      if (filters.environment) {
        filteredDevelopments = filteredDevelopments.filter(d => d.environment === filters.environment);
      }

      if (filters.author) {
        filteredDevelopments = filteredDevelopments.filter(d => d.author === filters.author);
      }
    }

    // Apply sorting
    if (sort) {
      filteredDevelopments.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sort.direction === 'asc' ? 1 : -1;
        if (bVal == null) return sort.direction === 'asc' ? -1 : 1;
        
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const pageSize = pagination?.pageSize || 20;
    const page = pagination?.page || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const total = filteredDevelopments.length;
    const totalPages = Math.ceil(total / pageSize);

    const paginatedData = filteredDevelopments.slice(start, end);

    const response: PaginatedResponse<Development> = {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    };

    return of(response).pipe(delay(300));
  }

  getMetrics(): Observable<DevelopmentMetrics> {
    const total = this.mockDevelopments.length;
    const inDevelopment = this.mockDevelopments.filter(d => d.status === DevelopmentStatus.DEVELOPMENT).length;
    const archived = this.mockDevelopments.filter(d => d.status === DevelopmentStatus.ARCHIVED).length;
    const completed = this.mockDevelopments.filter(d => d.status === DevelopmentStatus.COMPLETED).length;

    const metrics: DevelopmentMetrics = {
      total: total + 16, // 24 total como en el dashboard
      inDevelopment: inDevelopment + 5, // 8 en desarrollo
      archived: archived + 10, // 12 archivados
      completed: completed + 8 // 10 completados
    };

    return of(metrics).pipe(delay(200));
  }

  getRecentActivity(): Observable<RecentActivity[]> {
    return of(this.mockRecentActivities).pipe(delay(200));
  }

  getUpcomingDeployments(): Observable<UpcomingDeployment[]> {
    return of(this.mockUpcomingDeployments).pipe(delay(200));
  }

  getChartData(): Observable<ChartData[]> {
    const data: ChartData[] = [
      {
        environment: 'Local',
        count: 8,
        color: '#66C6EA'
      },
      {
        environment: 'Testing',
        count: 5,
        color: '#7D2BE3'
      },
      {
        environment: 'QA',
        count: 3,
        color: '#FF9800'
      },
      {
        environment: 'Production',
        count: 12,
        color: '#4CAF50'
      }
    ];

    return of(data).pipe(delay(200));
  }

  getDevelopmentById(id: string): Observable<Development | undefined> {
    const development = this.mockDevelopments.find(d => d.id === id);
    return of(development).pipe(delay(200));
  }

  getMicroservices(): Observable<Microservice[]> {
    return of(this.mockMicroservices).pipe(delay(200));
  }

  getAuthors(): Observable<string[]> {
    const authors = [...new Set(this.mockDevelopments.map(d => d.author))];
    return of(authors).pipe(delay(200));
  }

  createDevelopment(development: Omit<Development, 'id' | 'createdDate' | 'updatedDate'>): Observable<Development> {
    // Simulate creation
    const newDevelopment: Development = {
      ...development,
      id: Date.now().toString(),
      createdDate: new Date(),
      updatedDate: new Date()
    };
    
    this.mockDevelopments.unshift(newDevelopment);
    return of(newDevelopment).pipe(delay(500));
  }

  updateDevelopment(id: string, development: Partial<Development>): Observable<Development> {
    const index = this.mockDevelopments.findIndex(d => d.id === id);
    if (index !== -1) {
      this.mockDevelopments[index] = {
        ...this.mockDevelopments[index],
        ...development,
        updatedDate: new Date()
      };
      return of(this.mockDevelopments[index]).pipe(delay(500));
    }
    throw new Error('Development not found');
  }

  deleteDevelopment(id: string): Observable<void> {
    const index = this.mockDevelopments.findIndex(d => d.id === id);
    if (index !== -1) {
      this.mockDevelopments.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }

  changeStatus(id: string, newStatus: DevelopmentStatus): Observable<Development> {
    return this.updateDevelopment(id, { status: newStatus });
  }
}
