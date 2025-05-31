import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Desarrollo, 
  MetricaDesarrollo, 
  ActividadReciente, 
  ProximoDespliegue, 
  DatosGrafico,
  EstadoDesarrollo,
  Ambiente,
  TipoActividad,
  EstadoDespliegue
} from '../models/desarrollo.model';

@Injectable({
  providedIn: 'root'
})
export class DesarrolloService {

  private mockDesarrollos: Desarrollo[] = [
    {
      id: '1',
      nombre: 'Auth Service',
      estado: EstadoDesarrollo.EN_QA,
      ambiente: Ambiente.TESTING,
      fecha: new Date('2024-01-15'),
      descripcion: 'Servicio de autenticación con JWT',
      microservicio: 'auth-service',
      version: 'v2.1.0'
    },
    {
      id: '2',
      nombre: 'Payment API',
      estado: EstadoDesarrollo.PRODUCCION,
      ambiente: Ambiente.PRODUCTION,
      fecha: new Date('2024-01-14'),
      descripcion: 'API de pagos integrada',
      microservicio: 'payment-api',
      version: 'v1.5.2'
    },
    {
      id: '3',
      nombre: 'User Service',
      estado: EstadoDesarrollo.DESARROLLO,
      ambiente: Ambiente.DEVELOPMENT,
      fecha: new Date('2024-01-13'),
      descripcion: 'Gestión de usuarios y perfiles',
      microservicio: 'user-service',
      version: 'v3.0.0-beta'
    },
    {
      id: '4',
      nombre: 'Notification Service',
      estado: EstadoDesarrollo.PENDIENTE,
      ambiente: Ambiente.DEVELOPMENT,
      fecha: new Date('2024-01-12'),
      descripcion: 'Sistema de notificaciones push',
      microservicio: 'notification-service',
      version: 'v1.0.0'
    },
    {
      id: '5',
      nombre: 'Analytics API',
      estado: EstadoDesarrollo.EN_QA,
      ambiente: Ambiente.TESTING,
      fecha: new Date('2024-01-11'),
      descripcion: 'API de analytics y métricas',
      microservicio: 'analytics-api',
      version: 'v2.3.1'
    }
  ];

  private mockActividades: ActividadReciente[] = [
    {
      id: '1',
      tipo: TipoActividad.DESPLIEGUE,
      descripcion: 'Auth Service desplegado a QA',
      fecha: new Date('2024-01-15T10:30:00'),
      desarrolloId: '1'
    },
    {
      id: '2',
      tipo: TipoActividad.ACTUALIZACION,
      descripcion: 'Nueva versión de Payment API',
      fecha: new Date('2024-01-14T16:45:00'),
      desarrolloId: '2'
    },
    {
      id: '3',
      tipo: TipoActividad.REVISION,
      descripcion: 'User Service en revisión',
      fecha: new Date('2024-01-13T09:15:00'),
      desarrolloId: '3'
    }
  ];

  private mockProximosDespliegues: ProximoDespliegue[] = [
    {
      id: '1',
      nombre: 'Notification Service',
      ambiente: Ambiente.STAGING,
      fechaProgramada: new Date('2024-01-20'),
      estado: EstadoDespliegue.PROGRAMADO
    },
    {
      id: '2',
      nombre: 'Analytics API',
      ambiente: Ambiente.PRODUCTION,
      fechaProgramada: new Date('2024-01-22'),
      estado: EstadoDespliegue.PROGRAMADO
    },
    {
      id: '3',
      nombre: 'Search Service',
      ambiente: Ambiente.TESTING,
      fechaProgramada: new Date('2024-01-25'),
      estado: EstadoDespliegue.PROGRAMADO
    }
  ];

  constructor() { }

  getDesarrollos(): Observable<Desarrollo[]> {
    return of(this.mockDesarrollos);
  }

  getMetricas(): Observable<MetricaDesarrollo> {
    const total = this.mockDesarrollos.length;
    const enQA = this.mockDesarrollos.filter(d => d.estado === EstadoDesarrollo.EN_QA).length;
    const enProduccion = this.mockDesarrollos.filter(d => d.estado === EstadoDesarrollo.PRODUCCION).length;
    const pendientes = this.mockDesarrollos.filter(d => d.estado === EstadoDesarrollo.PENDIENTE).length;

    const metricas: MetricaDesarrollo = {
      total: total + 19, // Para mostrar 24 como en las imágenes
      enQA: enQA + 6, // Para mostrar 8
      enProduccion: enProduccion + 11, // Para mostrar 12
      pendientes: pendientes + 1 // Para mostrar 4
    };

    return of(metricas);
  }

  getActividadReciente(): Observable<ActividadReciente[]> {
    return of(this.mockActividades);
  }

  getProximosDespliegues(): Observable<ProximoDespliegue[]> {
    return of(this.mockProximosDespliegues);
  }

  getDatosGrafico(): Observable<DatosGrafico[]> {
    const datos: DatosGrafico[] = [
      {
        ambiente: 'Development',
        cantidad: 8,
        color: '#66C6EA'
      },
      {
        ambiente: 'Testing',
        cantidad: 5,
        color: '#7D2BE3'
      },
      {
        ambiente: 'Staging',
        cantidad: 3,
        color: '#FF9800'
      },
      {
        ambiente: 'Production',
        cantidad: 12,
        color: '#4CAF50'
      }
    ];

    return of(datos);
  }

  getDesarrolloById(id: string): Observable<Desarrollo | undefined> {
    const desarrollo = this.mockDesarrollos.find(d => d.id === id);
    return of(desarrollo);
  }

  // Métodos preparados para futura integración con API
  // createDesarrollo(desarrollo: Omit<Desarrollo, 'id'>): Observable<Desarrollo> {
  //   return this.http.post<Desarrollo>('/api/desarrollos', desarrollo);
  // }

  // updateDesarrollo(id: string, desarrollo: Partial<Desarrollo>): Observable<Desarrollo> {
  //   return this.http.put<Desarrollo>(`/api/desarrollos/${id}`, desarrollo);
  // }

  // deleteDesarrollo(id: string): Observable<void> {
  //   return this.http.delete<void>(`/api/desarrollos/${id}`);
  // }
}
