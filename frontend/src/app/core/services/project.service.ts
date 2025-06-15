import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { 
  Project, 
  ProjectType, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '../../shared/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;
  
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public projects$ = this.projectsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Obtener todos los proyectos
   */
  getProjects(): Observable<Project[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any): Project[] => {
        // Asegurar que siempre obtenemos un array
        let projects: Project[] = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          projects = response.data;
        } else if (Array.isArray(response)) {
          projects = response;
        } else {
          console.warn('Respuesta inesperada del servidor:', response);
          projects = [];
        }
        
        return projects;
      }),
      tap((projects: Project[]) => {
        this.projectsSubject.next(projects);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al cargar proyectos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener proyecto por ID con detalles completos
   */
  getProjectWithDetails(id: number): Observable<Project> {
    return this.http.get<any>(`${this.apiUrl}/${id}/with-details`).pipe(
      tap(response => {
        const project = response.data || response;
        return project;
      }),
      catchError(error => {
        this.handleError('Error al cargar detalles del proyecto', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Buscar proyectos por nombre y tipo
   */
  searchProjects(name?: string, type?: ProjectType): Observable<Project[]> {
    let params = new HttpParams();
    
    if (name) {
      params = params.set('name', name);
    }
    
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      tap(response => {
        // Asegurar que siempre obtenemos un array
        let projects: Project[] = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          projects = response.data;
        } else if (Array.isArray(response)) {
          projects = response;
        } else {
          console.warn('Respuesta inesperada del servidor:', response);
          projects = [];
        }
        
        return projects;
      }),
      catchError(error => {
        this.handleError('Error al buscar proyectos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear nuevo proyecto
   */
  createProject(project: CreateProjectRequest): Observable<Project> {
    this.loadingSubject.next(true);
    
    return this.http.post<any>(this.apiUrl, project).pipe(
      tap(response => {
        const newProject = response.data || response;
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next([...currentProjects, newProject]);
        this.loadingSubject.next(false);
        this.showSuccess('Proyecto creado exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al crear proyecto', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar proyecto existente
   */
  updateProject(id: number, project: UpdateProjectRequest): Observable<Project> {
    this.loadingSubject.next(true);
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, project).pipe(
      tap(response => {
        const updatedProject = response.data || response;
        const currentProjects = this.projectsSubject.value;
        const index = currentProjects.findIndex(p => p.id === id);
        
        if (index !== -1) {
          currentProjects[index] = updatedProject;
          this.projectsSubject.next([...currentProjects]);
        }
        
        this.loadingSubject.next(false);
        this.showSuccess('Proyecto actualizado exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al actualizar proyecto', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar proyecto
   */
  deleteProject(id: number): Observable<void> {
    this.loadingSubject.next(true);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projectsSubject.value;
        const filteredProjects = currentProjects.filter(p => p.id !== id);
        this.projectsSubject.next(filteredProjects);
        this.loadingSubject.next(false);
        this.showSuccess('Proyecto eliminado exitosamente');
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.handleError('Error al eliminar proyecto', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Alternar estado activo/inactivo del proyecto
   */
  toggleProjectStatus(project: Project): Observable<Project> {
    const updateData: UpdateProjectRequest = {
      name: project.name,
      repositoryUrl: project.repositoryUrl,
      type: project.type,
      description: project.description,
      isActive: !project.isActive
    };

    return this.updateProject(project.id, updateData);
  }

  /**
   * Obtener tipos de proyecto disponibles
   */
  getProjectTypes(): ProjectType[] {
    return Object.values(ProjectType);
  }

  /**
   * Obtener etiqueta legible para tipo de proyecto
   */
  getProjectTypeLabel(type: ProjectType): string {
    const labels: Record<ProjectType, string> = {
      [ProjectType.BACKEND]: 'Backend',
      [ProjectType.FRONTEND]: 'Frontend'
    };
    
    return labels[type] || type;
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