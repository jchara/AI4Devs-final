import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = 'users';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los usuarios activos
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get<any>(this.endpoint).pipe(
      map(response => {
        // El backend devuelve { data: [...], metadata: {...} }
        const users = response.data || response;
        return Array.isArray(users) ? users.filter(user => user.isActive) : [];
      })
    );
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(id: number): Observable<User> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data || response)
    );
  }

  /**
   * Obtiene solo usuarios activos
   */
  getActiveUsers(): Observable<User[]> {
    return this.getUsers(); // Ya filtra por activos
  }
} 