import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Component, 
  ComponentType, 
  CreateComponentRequest, 
  UpdateComponentRequest,
  ComponentSearchFilters
} from '../../shared/models/component.model';
import { NotificationService } from './notification.service';

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
    private notificationService: NotificationService
  ) {}

  /**
   * Obtener todos los componentes
   */
  getComponents(): Observable<Component[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<any>(this.apiUrl).pipe(
      tap(response => {
        const components = response.data || response;
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
    return this.http.get<any>(`${this.apiUrl}/project/${projectId}`).pipe(
      tap(response => {
        const components = response.data || response;
        return components;
      }),
      catchError(error => {
        this.handleError('Error al cargar componentes del proyecto', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener componente por ID con detalles completos
   */
  getComponentWithDetails(id: number): Observable<Component> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`).pipe(
      tap(response => {
        const component = response.data || response;
        return component;
      }),
      catchError(error => {
        this.handleError('Error al cargar detalles del componente', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Buscar componentes por filtros
   */
  searchComponents(filters: ComponentSearchFilters): Observable<Component[]> {
    let params = new HttpParams();
    
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    
    if (filters.type) {
      params = params.set('type', filters.type);
    }

    if (filters.technology) {
      params = params.set('technology', filters.technology);
    }

    if (filters.projectId) {
      params = params.set('projectId', filters.projectId.toString());
    }

    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      tap(response => {
        const components = response.data || response;
        return components;
      }),
      catchError(error => {
        this.handleError('Error al buscar componentes', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear nuevo componente
   */
  createComponent(component: CreateComponentRequest): Observable<Component> {
    this.loadingSubject.next(true);
    
    return this.http.post<any>(this.apiUrl, component).pipe(
      tap(response => {
        const newComponent = response.data || response;
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
    
    return this.http.patch<any>(`${this.apiUrl}/${id}`, component).pipe(
      tap(response => {
        const updatedComponent = response.data || response;
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
   * Alternar estado activo/inactivo del componente
   */
  toggleComponentStatus(component: Component): Observable<Component> {
    const updateData: UpdateComponentRequest = {
      name: component.name,
      description: component.description,
      type: component.type,
      version: component.version,
      technology: component.technology,
      projectId: component.projectId,
      isActive: !component.isActive
    };

    return this.updateComponent(component.id, updateData);
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
      [ComponentType.MICROSERVICE]: 'dns',
      [ComponentType.MICROFRONTEND]: 'web',
      [ComponentType.MONOLITH]: 'storage'
    };
    
    return icons[type] || 'code';
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.notificationService.showError(message);
  }

  private showSuccess(message: string): void {
    this.notificationService.showSuccess(message);
  }
} 