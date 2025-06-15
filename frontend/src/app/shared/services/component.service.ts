import { Injectable } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

export interface Component {
  id: number;
  name: string;
  description?: string;
  type: string;
  technology?: string;
  version?: string;
  projectId?: number;
  projectName?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  /**
   * Obtener todos los componentes activos
   */
  getActiveComponents(): Observable<Component[]> {
    return this.apiService.get<any>('components').pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response.filter(comp => comp.isActive);
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data.filter((comp: any) => comp.isActive);
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error al obtener componentes:', error);
        this.notificationService.showError('Error al cargar componentes');
        return of([]);
      })
    );
  }

  /**
   * Obtener componentes por proyecto
   */
  getComponentsByProject(projectId: number): Observable<Component[]> {
    return this.apiService.get<any>(`components/project/${projectId}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error al obtener componentes por proyecto:', error);
        return of([]);
      })
    );
  }
} 