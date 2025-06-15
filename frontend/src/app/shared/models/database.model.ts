export enum DatabaseType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql'
}

export interface Database {
  id: number;
  name: string;
  description: string;
  type: DatabaseType;
  version?: string;
  isActive: boolean;
  environmentId?: number;
  projectId?: number;
  environment?: {
    id: number;
    name: string;
    color: string;
  };
  project?: {
    id: number;
    name: string;
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateDatabaseRequest {
  name: string;
  description: string;
  type: DatabaseType;
  version?: string;
  environmentId?: number;
  projectId?: number;
  isActive?: boolean;
}

export interface UpdateDatabaseRequest {
  name?: string;
  description?: string;
  type?: DatabaseType;
  version?: string;
  environmentId?: number;
  projectId?: number;
  isActive?: boolean;
}

export interface DatabaseSearchFilters {
  name?: string;
  type?: DatabaseType;
  environmentId?: number;
  projectId?: number;
  isActive?: boolean;
} 