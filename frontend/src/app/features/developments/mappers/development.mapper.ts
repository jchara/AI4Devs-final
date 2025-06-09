import { BackendEnvironment } from '../../../shared/interfaces/backend-interfaces';
import { Development } from '../models/development.model';
import { Environment } from '../models/environment.model';

export class DevelopmentMapper {
  static mapDevelopmentFromBackend(data: any): Development {
    return {
      id: String(data.id),
      name: data.title || data.name,
      description: data.description,
      environment: this.mapEnvironmentFromBackend(data.environment),
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  private static mapEnvironmentFromBackend(
    environment: BackendEnvironment
  ): Environment {
    if (!environment || !environment.name) {
      return Environment.DEVELOPMENT;
    }

    const envName = environment.name.toUpperCase();

    switch (envName) {
      case 'PRODUCCIÓN':
      case 'PRODUCCION':
      case 'PRODUCTION':
        return Environment.PRODUCTION;
      case 'STAGING':
        return Environment.STAGING;
      case 'DESARROLLO':
      case 'TESTING':
      case 'DEVELOPMENT':
      default:
        return Environment.DEVELOPMENT;
    }
  }
}
