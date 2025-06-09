export interface Environment {
  id: number;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateEnvironmentDto {
  name: string;
  description: string;
  color?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateEnvironmentDto {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
  isActive?: boolean;
}

export interface EnvironmentFilter {
  search?: string;
  isActive?: boolean;
} 