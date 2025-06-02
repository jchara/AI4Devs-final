// =============================================================================
// BACKEND RESPONSE INTERFACES
// =============================================================================

export interface BackendDevelopmentResponse {
  id: number;
  title: string;
  description?: string;
  status: BackendDevelopmentStatus;
  priority: BackendDevelopmentPriority;
  progress: number;
  environmentId?: number;
  assignedToId?: number;
  teamId?: number;
  repository?: string;
  branch?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  estimatedDate?: string;
  endDate?: string;
}

export interface BackendDevelopmentMetricsResponse {
  totalDevelopments: number;
  byStatus: Record<BackendDevelopmentStatus, number>;
  byPriority: Record<BackendDevelopmentPriority, number>;
  averageProgress: number;
  completedThisMonth: number;
  overdue: number;
}

export interface BackendActivityResponse {
  id: number;
  description: string;
  createdAt: string;
  userId?: number;
  developmentId?: number;
  type: string;
}

export interface BackendMicroserviceResponse {
  id: number;
  name: string;
  description?: string;
  technology?: string;
  repository?: string;
  port?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendEnvironmentResponse {
  id: number;
  name: string;
  description?: string;
  url?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// BACKEND ENUMS
// =============================================================================

export enum BackendDevelopmentStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum BackendDevelopmentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// =============================================================================
// STATUS TRANSLATION MAP
// =============================================================================

export const StatusTranslationMap = {
  [BackendDevelopmentStatus.PLANNING]: 'En Desarrollo',
  [BackendDevelopmentStatus.IN_PROGRESS]: 'En Desarrollo',
  [BackendDevelopmentStatus.TESTING]: 'En Desarrollo',
  [BackendDevelopmentStatus.COMPLETED]: 'Completado',
  [BackendDevelopmentStatus.CANCELLED]: 'Archivado'
} as const;

// Mapa inverso para cuando necesitemos enviar datos al backend
export const StatusToBackendMap = {
  'En Desarrollo': BackendDevelopmentStatus.IN_PROGRESS,
  'Completado': BackendDevelopmentStatus.COMPLETED,
  'Archivado': BackendDevelopmentStatus.CANCELLED
} as const; 