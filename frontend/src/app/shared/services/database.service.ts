import { Injectable } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

export interface Database {
  id: number;
  name: string;
  description?: string;
  type: string;
  host?: string;
  port?: number;
  environmentId?: number;
  environmentName?: string;
  isActive: boolean;
}

export enum DatabaseChangeType {
  SCHEMA_CHANGE = 'schema_change',
  DATA_MIGRATION = 'data_migration',
  STORED_PROCEDURE = 'stored_procedure',
  FUNCTION = 'function',
  TRIGGER = 'trigger'
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  /**
   * Obtener todas las bases de datos activas
   */
  getActiveDatabases(): Observable<Database[]> {
    return this.apiService.get<any>('databases').pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response.filter(db => db.isActive);
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data.filter((db: any) => db.isActive);
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error al obtener bases de datos:', error);
        this.notificationService.showError('Error al cargar bases de datos');
        return of([]);
      })
    );
  }

  /**
   * Obtener bases de datos por ambiente
   */
  getDatabasesByEnvironment(environmentId: number): Observable<Database[]> {
    return this.apiService.get<any>(`databases/environment/${environmentId}`).pipe(
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
        console.error('Error al obtener bases de datos por ambiente:', error);
        return of([]);
      })
    );
  }
} 