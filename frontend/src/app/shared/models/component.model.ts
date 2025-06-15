export enum ComponentType {
  MICROSERVICE = 'microservice',
  MICROFRONTEND = 'microfrontend',
  MONOLITH = 'monolith'
}

export interface Component {
  id: number;
  name: string;
  description: string;
  type: ComponentType;
  version?: string;
  isActive: boolean;
  technology: string;
  projectId: number;
  project?: {
    id: number;
    name: string;
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateComponentRequest {
  name: string;
  description: string;
  type: ComponentType;
  version?: string;
  technology: string;
  projectId: number;
  isActive: boolean;
}

export interface UpdateComponentRequest {
  name?: string;
  description?: string;
  type?: ComponentType;
  version?: string;
  technology?: string;
  projectId?: number;
  isActive?: boolean;
}

export interface ComponentSearchFilters {
  name?: string;
  type?: ComponentType;
  technology?: string;
  projectId?: number;
  isActive?: boolean;
} 