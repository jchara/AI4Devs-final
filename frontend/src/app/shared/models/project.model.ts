export interface Project {
  id: number;
  name: string;
  repositoryUrl: string;
  type: ProjectType;
  description?: string;
  isActive: boolean;
  components?: Component[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Component {
  id: number;
  projectId: number;
  name: string;
  type: ComponentType;
  description?: string;
  technology?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectType {
  BACKEND = 'backend',
  FRONTEND = 'frontend'
}

export enum ComponentType {
  MICROSERVICE = 'microservice',
  MICROFRONTEND = 'microfrontend',
  MONOLITH = 'monolith'
}

export interface CreateProjectRequest {
  name: string;
  repositoryUrl: string;
  type: ProjectType;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  repositoryUrl?: string;
  type?: ProjectType;
  description?: string;
  isActive?: boolean;
}

export interface CreateComponentRequest {
  projectId: number;
  name: string;
  type: ComponentType;
  description?: string;
  technology?: string;
}

export interface UpdateComponentRequest {
  name?: string;
  type?: ComponentType;
  description?: string;
  technology?: string;
} 