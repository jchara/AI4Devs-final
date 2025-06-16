import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Database, 
  DatabaseType, 
  CreateDatabaseRequest, 
  UpdateDatabaseRequest,
  DatabaseSearchFilters
} from '../../shared/models/database.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly apiUrl = `${environment.apiUrl}/databases`;
  
  private databasesSubject = new BehaviorSubject<Database[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public databases$ = this.databasesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  /**
   * Obtener todas las bases de datos
   */
  getDatabases(): Observable<Database[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<any>(this.apiUrl).pipe(
      tap(response => {
        // Asegurar que siempre obtenemos un array
        let databases: Database[] = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          databases = response.data;
        } else if (Array.isArray(response)) {
          databases = response;
        } else {
          console.warn('Respuesta inesperada del servidor:', response);
          databases = [];
        }
        
        this.databasesSubject.next(databases);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al cargar bases de datos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener bases de datos por ambiente
   */
  getDatabasesByEnvironment(environmentId: number): Observable<Database[]> {
    return this.http.get<any>(`${this.apiUrl}/environment/${environmentId}`).pipe(
      tap(response => {
        // Asegurar que siempre obtenemos un array
        let databases: Database[] = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          databases = response.data;
        } else if (Array.isArray(response)) {
          databases = response;
        } else {
          console.warn('Respuesta inesperada del servidor:', response);
          databases = [];
        }
        
        return databases;
      }),
      catchError(error => {
        this.handleError('Error al cargar bases de datos del ambiente', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener base de datos por ID con detalles completos
   */
  getDatabaseWithDetails(id: number): Observable<Database> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`).pipe(
      tap(response => {
        const database = response.data || response;
        return database;
      }),
      catchError(error => {
        this.handleError('Error al cargar detalles de la base de datos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Buscar bases de datos por filtros
   */
  searchDatabases(filters: DatabaseSearchFilters): Observable<Database[]> {
    let params = new HttpParams();
    
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    
    if (filters.type) {
      params = params.set('type', filters.type);
    }

    if (filters.environmentId) {
      params = params.set('environmentId', filters.environmentId.toString());
    }

    if (filters.projectId) {
      params = params.set('projectId', filters.projectId.toString());
    }

    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      tap(response => {
        // Asegurar que siempre obtenemos un array
        let databases: Database[] = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          databases = response.data;
        } else if (Array.isArray(response)) {
          databases = response;
        } else {
          console.warn('Respuesta inesperada del servidor:', response);
          databases = [];
        }
        
        return databases;
      }),
      catchError(error => {
        this.handleError('Error al buscar bases de datos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear nueva base de datos
   */
  createDatabase(database: CreateDatabaseRequest): Observable<Database> {
    this.loadingSubject.next(true);
    
    return this.http.post<any>(this.apiUrl, database).pipe(
      tap(response => {
        const newDatabase = response.data || response;
        const currentDatabases = this.databasesSubject.value;
        this.databasesSubject.next([...currentDatabases, newDatabase]);
        this.loadingSubject.next(false);
        this.showSuccess('Base de datos creada exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al crear base de datos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar base de datos existente
   */
  updateDatabase(id: number, database: UpdateDatabaseRequest): Observable<Database> {
    this.loadingSubject.next(true);
    
    return this.http.patch<any>(`${this.apiUrl}/${id}`, database).pipe(
      tap(response => {
        const updatedDatabase = response.data || response;
        const currentDatabases = this.databasesSubject.value;
        const index = currentDatabases.findIndex(d => d.id === id);
        
        if (index !== -1) {
          currentDatabases[index] = updatedDatabase;
          this.databasesSubject.next([...currentDatabases]);
        }
        
        this.loadingSubject.next(false);
        this.showSuccess('Base de datos actualizada exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al actualizar base de datos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar base de datos
   */
  deleteDatabase(id: number): Observable<void> {
    this.loadingSubject.next(true);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentDatabases = this.databasesSubject.value;
        const filteredDatabases = currentDatabases.filter(d => d.id !== id);
        this.databasesSubject.next(filteredDatabases);
        this.loadingSubject.next(false);
        this.showSuccess('Base de datos eliminada exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al eliminar base de datos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Alternar estado activo/inactivo de la base de datos
   */
  toggleDatabaseStatus(database: Database): Observable<Database> {
    // Solo enviar el campo que queremos cambiar para evitar errores de validación
    const updateData: UpdateDatabaseRequest = {
      isActive: !database.isActive
    };

    return this.updateDatabase(database.id, updateData);
  }

  /**
   * Obtener tipos de base de datos disponibles
   */
  getDatabaseTypes(): DatabaseType[] {
    return Object.values(DatabaseType);
  }

  /**
   * Obtener etiqueta legible para tipo de base de datos
   */
  getDatabaseTypeLabel(type: DatabaseType): string {
    const labels: Record<DatabaseType, string> = {
      [DatabaseType.POSTGRES]: 'PostgreSQL',
      [DatabaseType.MYSQL]: 'MySQL'
    };
    
    return labels[type] || type;
  }

  /**
   * Obtener icono para tipo de base de datos
   */
  getDatabaseTypeIcon(type: DatabaseType): string {
    const icons: Record<DatabaseType, string> = {
      [DatabaseType.POSTGRES]: 'storage',
      [DatabaseType.MYSQL]: 'database'
    };
    
    return icons[type] || 'storage';
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.notificationService.showError(message);
  }

  private showSuccess(message: string): void {
    this.notificationService.showSuccess(message);
  }
} 