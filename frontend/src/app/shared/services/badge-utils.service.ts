import { Injectable } from '@angular/core';
import { DevelopmentStatus, Environment, ActivityType } from '../../features/developments/models/development.model';

@Injectable({
  providedIn: 'root'
})
export class BadgeUtilsService {

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getStatusBadgeClass(status: DevelopmentStatus): string;
  getStatusBadgeClass(status: string): string;
  getStatusBadgeClass(status: DevelopmentStatus | string): string {
    // Si es string, convertir a DevelopmentStatus equivalente
    if (typeof status === 'string') {
      switch (status) {
        case DevelopmentStatus.DEVELOPMENT:
        case 'En Desarrollo':
          return 'badge-desarrollo';
        case DevelopmentStatus.ARCHIVED:
        case 'Archivado':
          return 'badge-archivado';
        case DevelopmentStatus.COMPLETED:
        case 'Completado':
          return 'badge-completado';
        case DevelopmentStatus.PLANNING:
        case 'En Planificación':
          return 'badge-planificacion';
        case DevelopmentStatus.TESTING:
        case 'En Pruebas':
          return 'badge-pruebas';
        default:
          return '';
      }
    }

    switch (status) {
      case DevelopmentStatus.DEVELOPMENT:
        return 'badge-desarrollo';
      case DevelopmentStatus.ARCHIVED:
        return 'badge-archivado';
      case DevelopmentStatus.COMPLETED:
        return 'badge-completado';
      case DevelopmentStatus.PLANNING:
        return 'badge-planificacion';
      case DevelopmentStatus.TESTING:
        return 'badge-pruebas';
      default:
        return '';
    }
  }

  /**
   * Obtiene la clase CSS para el badge de ambiente
   */
  getEnvironmentBadgeClass(environment: Environment): string {
    switch (environment) {
      case Environment.DEVELOPMENT:
        return 'ambiente-development';
      case Environment.TESTING:
        return 'ambiente-testing';
      case Environment.STAGING:
        return 'ambiente-staging';
      case Environment.PRODUCTION:
        return 'ambiente-production';
      default:
        return '';
    }
  }

  /**
   * Obtiene la clase CSS para el ambiente (versión legacy)
   */
  getEnvironmentClass(environment: Environment): string {
    switch (environment) {
      case Environment.DEVELOPMENT:
        return 'development';
      case Environment.TESTING:
        return 'testing';
      case Environment.STAGING:
        return 'staging';
      case Environment.PRODUCTION:
        return 'production';
      default:
        return '';
    }
  }

  /**
   * Obtiene la clase CSS para el tipo de actividad
   */
  getActivityTypeClass(type: ActivityType): string {
    switch (type) {
      case ActivityType.DEPLOYMENT:
        return 'deployment';
      case ActivityType.UPDATE:
        return 'update';
      case ActivityType.REVIEW:
        return 'review';
      case ActivityType.COMPLETED:
        return 'completed';
      default:
        return '';
    }
  }

  /**
   * Formatea una fecha en formato español
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  /**
   * Trunca un texto a una longitud máxima
   */
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
} 