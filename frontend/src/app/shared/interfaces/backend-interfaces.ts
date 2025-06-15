// =============================================================================
// BACKEND RESPONSE INTERFACES
// =============================================================================

import { DevelopmentEnvironment, DevelopmentStatus, ComponentType, ActivityType } from '../models/development.model';

export interface BackendDevelopmentResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  environment: string;
  environmentId?: number;
  projectId?: number;
  progress: number;
  isActive: boolean;
  jiraUrl?: string;
  branch?: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  estimatedDate?: string;
  assignedTo?: string;
  team?: string;
  components?: BackendComponentResponse[];
  developmentComponents?: any[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface BackendDevelopmentComponentResponse {
  id: number;
  component: BackendComponentResponse;
  changeType: string;
  progress: number;
  notes: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendComponentResponse {
  id: number;
  name: string;
  type: string;
  technology: string;
  version: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendDevelopmentMetricsResponse {
  data: {
    total: number;
    byStatus: {
      completed: number;
      inDevelopment: number;
      cancelled: number;
    };
    byEnvironment?: Record<string, number>;
  };
}

export interface BackendActivityResponse {
  id: number;
  type: string;
  description: string;
  user: any; // Puede ser string o objeto
  timestamp: string;
  developmentId: number;
  isActive: boolean;
}

export interface BackendProjectResponse {
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
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface BackendUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendTeamResponse {
  id: number;
  name: string;
  description: string;
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

export const StatusTranslationMap: { [key: string]: string } = {
  [BackendDevelopmentStatus.PLANNING]: 'PLANNING',
  [BackendDevelopmentStatus.IN_PROGRESS]: 'IN_PROGRESS',
  [BackendDevelopmentStatus.TESTING]: 'TESTING',
  [BackendDevelopmentStatus.COMPLETED]: 'COMPLETED',
  [BackendDevelopmentStatus.CANCELLED]: 'CANCELLED'
};

// Mapa inverso para cuando necesitemos enviar datos al backend
export const StatusToBackendMap = {
  'En Planificación': BackendDevelopmentStatus.PLANNING,
  'En Desarrollo': BackendDevelopmentStatus.IN_PROGRESS,
  'En Pruebas': BackendDevelopmentStatus.TESTING,
  'Completado': BackendDevelopmentStatus.COMPLETED,
  'Archivado': BackendDevelopmentStatus.CANCELLED
} as const;

export interface BackendEnvironment {
  id: number;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface BackendProject {
  id: number;
  name: string;
  technology?: string;
  description?: string;
  repository?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendDevelopmentProject {
  id: number;
  project: BackendProject;
  progress: number;
  notes?: string;
  version?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BackendDevelopment {
  id: number;
  name: string;
  description: string;
  status: BackendDevelopmentStatus;
  progress: number;
  startDate: string;
  endDate?: string;
  environment: BackendEnvironment;
  developmentProjects: BackendDevelopmentProject[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendActivity {
  id: number;
  type: string;
  description: string;
  developmentId?: number;
  createdAt: string;
}

export interface BackendUpcomingDeployment {
  id: number;
  development: BackendDevelopment;
  environment: BackendEnvironment;
  scheduledDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
} 