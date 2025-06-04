export interface Microservice {
  id: string;
  name: string;
  technology?: string;
  description?: string;
  repository?: string;
}

export interface DevelopmentMicroservice {
  id: string;
  microservice: Microservice;
  progress?: number;
  notes?: string;
  version?: string;
}

export interface Development {
  id: string;
  title: string;
  status: DevelopmentStatus;
  environment: Environment;
  createdDate: Date;
  updatedDate: Date;
  description?: string;
  microservices: Microservice[];
  developmentMicroservices?: DevelopmentMicroservice[];
  progress?: string;
  jiraUrl?: string;
}

export interface DevelopmentMetrics {
  total: number;
  inDevelopment: number;
  archived: number;
  completed: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  date: Date;
  developmentId?: string;
}

export interface UpcomingDeployment {
  id: string;
  name: string;
  environment: Environment;
  scheduledDate: Date;
  status: DeploymentStatus;
}

export interface ChartData {
  environment: string;
  count: number;
  color: string;
}

// Filter and search interfaces
export interface DevelopmentFilter {
  search?: string;
  status?: DevelopmentStatus | 'all';
  environment?: Environment;
}

// Pagination interface
export interface DevelopmentPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Sorting interface
export interface DevelopmentSort {
  field: keyof Development;
  direction: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: DevelopmentPagination;
}

export enum DevelopmentStatus {
  PLANNING = 'En Planificación',
  DEVELOPMENT = 'En Desarrollo',
  TESTING = 'En Pruebas',
  ARCHIVED = 'Archivado',
  COMPLETED = 'Completado'
}

export enum Environment {
  DEVELOPMENT = 'Local',
  TESTING = 'Testing',
  STAGING = 'QA',
  PRODUCTION = 'Producción'
}

export enum ActivityType {
  DEPLOYMENT = 'Despliegue',
  UPDATE = 'Actualización',
  REVIEW = 'Revisión',
  COMPLETED = 'Completado'
}

export enum DeploymentStatus {
  SCHEDULED = 'Programado',
  IN_PROGRESS = 'En Proceso',
  COMPLETED = 'Completado',
  FAILED = 'Fallido'
} 