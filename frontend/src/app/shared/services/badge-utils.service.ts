import { Injectable } from '@angular/core';
import {
  ActivityType,
  DevelopmentStatus,
  DevelopmentEnvironment,
} from '../models/development.model';

@Injectable({
  providedIn: 'root',
})
export class BadgeUtilsService {
  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getStatusBadgeClass(status: DevelopmentStatus | string): string {
    // Si es string, convertir a DevelopmentStatus equivalente
    if (typeof status === 'string') {
      switch (status) {
        case DevelopmentStatus.IN_PROGRESS:
        case 'in_progress':
          return 'badge-desarrollo';
        case DevelopmentStatus.CANCELLED:
        case 'cancelled':
          return 'badge-archivado';
        case DevelopmentStatus.COMPLETED:
        case 'completed':
          return 'badge-completado';
        case DevelopmentStatus.PLANNING:
        case 'planning':
          return 'badge-planificacion';
        case DevelopmentStatus.TESTING:
        case 'testing':
          return 'badge-pruebas';
        default:
          return '';
      }
    }

    switch (status) {
      case DevelopmentStatus.IN_PROGRESS:
        return 'badge-desarrollo';
      case DevelopmentStatus.CANCELLED:
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
  getEnvironmentBadgeClass(environment: DevelopmentEnvironment): string {
    switch (environment) {
      case DevelopmentEnvironment.DEVELOPMENT:
        return 'ambiente-development';
      case DevelopmentEnvironment.TESTING:
        return 'ambiente-testing';
      case DevelopmentEnvironment.STAGING:
        return 'ambiente-staging';
      case DevelopmentEnvironment.PRODUCTION:
        return 'ambiente-production';
      default:
        return '';
    }
  }

  /**
   * Obtiene la clase CSS para el ambiente (versión legacy)
   */
  getEnvironmentClass(environment: DevelopmentEnvironment): string {
    switch (environment) {
      case DevelopmentEnvironment.DEVELOPMENT:
        return 'development';
      case DevelopmentEnvironment.TESTING:
        return 'testing';
      case DevelopmentEnvironment.STAGING:
        return 'staging';
      case DevelopmentEnvironment.PRODUCTION:
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
      case ActivityType.DEVELOPMENT_CREATED:
        return 'creation';
      case ActivityType.DEVELOPMENT_UPDATED:
        return 'update';
      case ActivityType.STATUS_CHANGED:
        return 'status';
      case ActivityType.MICROSERVICE_ADDED:
        return 'microservice-added';
      case ActivityType.MICROSERVICE_REMOVED:
        return 'microservice-removed';
      case ActivityType.PROGRESS_UPDATED:
        return 'progress';
      case ActivityType.DEPLOYMENT_SCHEDULED:
        return 'deployment';
      default:
        return '';
    }
  }

  /**
   * Formatea una fecha en formato español
   */
  formatDate(date: Date | undefined | null): string {
    // Manejar casos donde la fecha es undefined o null
    if (!date) {
      return 'No especificada';
    }
    
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  /**
   * Trunca un texto a una longitud máxima
   */
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }
}
