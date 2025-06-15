import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DeploymentType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DeploymentTypeService {
  private readonly endpoint = 'deployment-types';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los tipos de despliegue
   */
  getDeploymentTypes(): Observable<DeploymentType[]> {
    return this.apiService.get<DeploymentType[]>(this.endpoint);
  }

  /**
   * Obtiene un tipo de despliegue por ID
   */
  getDeploymentTypeById(id: number): Observable<DeploymentType> {
    return this.apiService.get<DeploymentType>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene solo tipos de despliegue activos
   */
  getActiveDeploymentTypes(): Observable<DeploymentType[]> {
    return this.apiService.get<DeploymentType[]>(`${this.endpoint}?isActive=true`);
  }
} 