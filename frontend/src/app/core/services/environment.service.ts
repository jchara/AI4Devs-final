import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, switchMap } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { Environment, CreateEnvironmentDto, UpdateEnvironmentDto, EnvironmentFilter } from '../models/environment.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private environmentsSubject = new BehaviorSubject<Environment[]>([]);
  public environments$ = this.environmentsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  getEnvironments(filter?: EnvironmentFilter): Observable<Environment[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<Environment[]>('environments', filter).pipe(
      tap(environments => {
        // Ordenar por el campo order y luego por nombre
        const sortedEnvironments = environments.sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.name.localeCompare(b.name);
        });
        this.environmentsSubject.next(sortedEnvironments);
      }),
      catchError(error => {
        this.notificationService.showError('Error al cargar los ambientes');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getEnvironmentById(id: number): Observable<Environment> {
    this.loadingSubject.next(true);
    return this.apiService.get<Environment>(`environments/${id}`).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar el ambiente');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  createEnvironment(environment: CreateEnvironmentDto): Observable<Environment> {
    this.loadingSubject.next(true);
    return this.apiService.post<Environment>('environments', environment).pipe(
      tap(newEnvironment => {
        const currentEnvironments = this.environmentsSubject.getValue();
        this.environmentsSubject.next([...currentEnvironments, newEnvironment]);
        this.notificationService.showSuccess('Ambiente creado correctamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al crear el ambiente');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updateEnvironment(id: number, environment: UpdateEnvironmentDto): Observable<Environment> {
    this.loadingSubject.next(true);
    return this.apiService.patch<Environment>(`environments/${id}`, environment).pipe(
      tap(updatedEnvironment => {
        const currentEnvironments = this.environmentsSubject.getValue();
        const updatedEnvironments = currentEnvironments.map(env => 
          env.id === updatedEnvironment.id ? updatedEnvironment : env
        );
        this.environmentsSubject.next(updatedEnvironments);
        this.notificationService.showSuccess('Ambiente actualizado correctamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al actualizar el ambiente');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  deleteEnvironment(id: number): Observable<void> {
    this.loadingSubject.next(true);
    return this.apiService.delete<void>(`environments/${id}`).pipe(
      tap(() => {
        const currentEnvironments = this.environmentsSubject.getValue();
        const updatedEnvironments = currentEnvironments.filter(env => env.id !== id);
        this.environmentsSubject.next(updatedEnvironments);
        this.notificationService.showSuccess('Ambiente eliminado correctamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al eliminar el ambiente');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  toggleActive(id: number, isActive: boolean): Observable<Environment> {
    return this.updateEnvironment(id, { isActive });
  }

  updateOrder(id: number, newOrder: number): Observable<Environment> {
    return this.updateEnvironment(id, { order: newOrder });
  }

  updateAndRefresh(id: number, data: UpdateEnvironmentDto) {
    return this.updateEnvironment(id, data).pipe(
      switchMap(() => this.getEnvironments())
    );
  }
} 