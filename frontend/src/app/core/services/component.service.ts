import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { 
  Component, 
  ComponentType, 
  CreateComponentRequest, 
  UpdateComponentRequest 
} from '../../shared/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private readonly apiUrl = `${environment.apiUrl}/components`;
  
  private componentsSubject = new BehaviorSubject<Component[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public components$ = this.componentsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Obtener todos los componentes
   */
  getComponents(): Observable<Component[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<Component[]>(this.apiUrl).pipe(
      tap(components => {
        this.componentsSubject.next(components);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al cargar componentes', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener componentes por proyecto
   */
  getComponentsByProject(projectId: number): Observable<Component[]> {
    return this.http.get<Component[]>(`${this.apiUrl}/project/${projectId}`).pipe(
      catchError(error => {
        this.handleError('Error al cargar componentes del proyecto', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener componente por ID
   */
  getComponent(id: number): Observable<Component> {
    return this.http.get<Component>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.handleError('Error al cargar componente', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear nuevo componente
   */
  createComponent(component: CreateComponentRequest): Observable<Component> {
    this.loadingSubject.next(true);
    
    return this.http.post<Component>(this.apiUrl, component).pipe(
      tap(newComponent => {
        const currentComponents = this.componentsSubject.value;
        this.componentsSubject.next([...currentComponents, newComponent]);
        this.loadingSubject.next(false);
        this.showSuccess('Componente creado exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al crear componente', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar componente existente
   */
  updateComponent(id: number, component: UpdateComponentRequest): Observable<Component> {
    this.loadingSubject.next(true);
    
    return this.http.patch<Component>(`${this.apiUrl}/${id}`, component).pipe(
      tap(updatedComponent => {
        const currentComponents = this.componentsSubject.value;
        const index = currentComponents.findIndex(c => c.id === id);
        
        if (index !== -1) {
          currentComponents[index] = updatedComponent;
          this.componentsSubject.next([...currentComponents]);
        }
        
        this.loadingSubject.next(false);
        this.showSuccess('Componente actualizado exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al actualizar componente', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar componente
   */
  deleteComponent(id: number): Observable<void> {
    this.loadingSubject.next(true);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentComponents = this.componentsSubject.value;
        const filteredComponents = currentComponents.filter(c => c.id !== id);
        this.componentsSubject.next(filteredComponents);
        this.loadingSubject.next(false);
        this.showSuccess('Componente eliminado exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al eliminar componente', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener tipos de componente disponibles
   */
  getComponentTypes(): ComponentType[] {
    return Object.values(ComponentType);
  }

  /**
   * Obtener etiqueta legible para tipo de componente
   */
  getComponentTypeLabel(type: ComponentType): string {
    const labels: Record<ComponentType, string> = {
      [ComponentType.MICROSERVICE]: 'Microservicio',
      [ComponentType.MICROFRONTEND]: 'Microfrontend',
      [ComponentType.MONOLITH]: 'Monolito'
    };
    
    return labels[type] || type;
  }

  /**
   * Obtener icono para tipo de componente
   */
  getComponentTypeIcon(type: ComponentType): string {
    const icons: Record<ComponentType, string> = {
      [ComponentType.MICROSERVICE]: 'api',
      [ComponentType.MICROFRONTEND]: 'web',
      [ComponentType.MONOLITH]: 'layers'
    };
    
    return icons[type] || 'code';
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    
    let errorMessage = message;
    if (error?.error?.message) {
      errorMessage += `: ${error.error.message}`;
    } else if (error?.message) {
      errorMessage += `: ${error.message}`;
    }
    
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
} 