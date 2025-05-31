export interface Desarrollo {
  id: string;
  nombre: string;
  estado: EstadoDesarrollo;
  ambiente: Ambiente;
  fecha: Date;
  descripcion?: string;
  microservicio?: string;
  version?: string;
}

export interface MetricaDesarrollo {
  total: number;
  enQA: number;
  enProduccion: number;
  pendientes: number;
}

export interface ActividadReciente {
  id: string;
  tipo: TipoActividad;
  descripcion: string;
  fecha: Date;
  desarrolloId?: string;
}

export interface ProximoDespliegue {
  id: string;
  nombre: string;
  ambiente: Ambiente;
  fechaProgramada: Date;
  estado: EstadoDespliegue;
}

export interface DatosGrafico {
  ambiente: string;
  cantidad: number;
  color: string;
}

export enum EstadoDesarrollo {
  DESARROLLO = 'Desarrollo',
  EN_QA = 'En QA',
  PRODUCCION = 'Producción',
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado'
}

export enum Ambiente {
  DEVELOPMENT = 'Development',
  TESTING = 'Testing',
  STAGING = 'Staging',
  PRODUCTION = 'Production'
}

export enum TipoActividad {
  DESPLIEGUE = 'Despliegue',
  ACTUALIZACION = 'Actualización',
  REVISION = 'Revisión',
  COMPLETADO = 'Completado'
}

export enum EstadoDespliegue {
  PROGRAMADO = 'Programado',
  EN_PROCESO = 'En Proceso',
  COMPLETADO = 'Completado',
  FALLIDO = 'Fallido'
} 