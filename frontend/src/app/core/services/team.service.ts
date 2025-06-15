import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Team } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly endpoint = 'teams';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los equipos
   */
  getTeams(): Observable<Team[]> {
    return this.apiService.get<any>(this.endpoint).pipe(
      map(response => {
        // El backend devuelve { data: [...], metadata: {...} }
        const teams = response.data || response;
        return Array.isArray(teams) ? teams.filter(team => team.isActive) : [];
      })
    );
  }

  /**
   * Obtiene un equipo por ID
   */
  getTeamById(id: number): Observable<Team> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data || response)
    );
  }

  /**
   * Obtiene solo equipos activos
   */
  getActiveTeams(): Observable<Team[]> {
    return this.getTeams(); // Ya filtra por activos
  }
} 