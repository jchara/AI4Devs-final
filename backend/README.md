# DevTracker Backend API

API REST para el sistema de seguimiento de desarrollos DevTracker, construida con **NestJS**, **TypeORM**, **PostgreSQL** y **arquitectura Domain-Driven Design (DDD)**.

## 🏗️ Arquitectura DDD

Este backend implementa una **arquitectura DDD (Domain-Driven Design)** con **patrón Repository** para máxima escalabilidad y mantenibilidad.

### 📂 Estructura de Dominios

```
src/modules/
├── identity/              🧑‍💼 Gestión de usuarios, roles y equipos
│   ├── entities/          User, Role, Team
│   ├── repositories/      Patrón Repository implementado
│   ├── services/          UserService con validaciones
│   ├── controllers/       UserController RESTful
│   ├── dto/               CreateUserDto, UpdateUserDto
│   └── identity.module.ts
├── project-management/    🚀 Gestión de desarrollos y microservicios
│   ├── entities/          Development, Microservice, DevelopmentMicroservice
│   ├── repositories/      Filtros avanzados y métricas
│   ├── services/          DevelopmentService con lógica de negocio
│   ├── controllers/       DevelopmentController con filtros
│   └── project-management.module.ts
├── infrastructure/        ⚙️ Gestión de ambientes y despliegues
│   ├── entities/          Environment, DeploymentType, UpcomingDeployment
│   ├── repositories/      Patrón Repository implementado
│   └── infrastructure.module.ts
├── activity/              📝 Actividades del sistema
│   ├── entities/          RecentActivity
│   ├── repositories/      ActivityRepository
│   └── activity.module.ts
└── shared/                🔧 Componentes compartidos
    └── repositories/      BaseRepository y BaseRepositoryInterface
```

## 🚀 Características

- **🏛️ Arquitectura DDD** - Dominios bien definidos y separados
- **📊 Patrón Repository** - Abstracción completa de acceso a datos
- **🔒 DTOs tipados** - Validación robusta con class-validator
- **📈 Métricas en tiempo real** - Dashboard con datos actualizados
- **🔍 Filtros avanzados** - Búsqueda y filtrado potente
- **📋 Barrel exports** - Importaciones limpias y organizadas
- **🔄 Servicios optimizados** - Lógica de negocio robusta
- **📚 Documentación Swagger** - API completamente documentada

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=devtracker

# Application Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:4200
```

4. **Crear base de datos**
```sql
CREATE DATABASE devtracker;
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Poblar base de datos con datos de prueba
```bash
npm run seed
```

## 🎯 API Endpoints por Dominio

### 🧑‍💼 Identity Domain

#### Usuarios
- `GET /users` - Listar todos los usuarios
- `GET /users/statistics` - Estadísticas de usuarios por rol y equipo
- `GET /users/by-role/:roleId` - Usuarios filtrados por rol
- `GET /users/by-team/:teamId` - Usuarios filtrados por equipo
- `GET /users/:id` - Obtener usuario específico
- `POST /users` - Crear nuevo usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### 🚀 Project Management Domain

#### Desarrollos
- `GET /developments` - Listar desarrollos (con filtros opcionales)
  - `?status=in_progress` - Filtrar por estado
  - `?priority=high` - Filtrar por prioridad
  - `?assignedToId=1` - Filtrar por usuario asignado
  - `?teamId=2` - Filtrar por equipo
  - `?search=oauth` - Búsqueda por texto
- `GET /developments/metrics` - Métricas completas del dashboard
- `GET /developments/overdue` - Desarrollos atrasados
- `GET /developments/by-status/:status` - Filtrar por estado específico
- `GET /developments/by-priority/:priority` - Filtrar por prioridad específica
- `GET /developments/by-assignee/:userId` - Desarrollos por usuario asignado
- `GET /developments/by-team/:teamId` - Desarrollos por equipo
- `GET /developments/:id` - Obtener desarrollo específico
- `POST /developments` - Crear nuevo desarrollo
- `PATCH /developments/:id` - Actualizar desarrollo
- `PATCH /developments/:id/progress` - Actualizar solo el progreso
- `PATCH /developments/:id/status` - Cambiar estado del desarrollo
- `DELETE /developments/:id` - Eliminar desarrollo

### ⚙️ Infrastructure Domain

#### Ambientes
- `GET /environments` - Listar ambientes
- `GET /environments/:id` - Obtener ambiente específico
- `POST /environments` - Crear nuevo ambiente
- `PATCH /environments/:id` - Actualizar ambiente
- `DELETE /environments/:id` - Eliminar ambiente

#### Tipos de Despliegue
- `GET /deployment-types` - Listar tipos de despliegue
- `GET /deployment-types/:id` - Obtener tipo específico
- `POST /deployment-types` - Crear nuevo tipo
- `PATCH /deployment-types/:id` - Actualizar tipo
- `DELETE /deployment-types/:id` - Eliminar tipo

#### Despliegues Programados
- `GET /upcoming-deployments` - Listar próximos despliegues
- `GET /upcoming-deployments/upcoming?limit=5` - Próximos N despliegues
- `GET /upcoming-deployments/:id` - Obtener despliegue específico
- `POST /upcoming-deployments` - Programar nuevo despliegue
- `PATCH /upcoming-deployments/:id` - Actualizar despliegue
- `DELETE /upcoming-deployments/:id` - Cancelar despliegue

### 📝 Activity Domain

#### Actividades
- `GET /activities` - Listar todas las actividades
- `GET /activities/recent?limit=10` - Actividades recientes
- `GET /activities/by-type/:type` - Filtrar por tipo de actividad
- `GET /activities/by-development/:id` - Actividades de un desarrollo
- `GET /activities/by-user/:userId` - Actividades de un usuario

## 🗄️ Estructura de Base de Datos

### 🧑‍💼 Identity Domain

#### Users (Usuarios)
- `id` - Identificador único
- `name` - Nombre completo
- `email` - Email único
- `password` - Contraseña hasheada (bcrypt)
- `isActive` - Estado activo/inactivo
- `roleId` - FK hacia roles
- `teamId` - FK hacia equipos
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Roles (Roles)
- `id` - Identificador único
- `name` - Nombre del rol (único)
- `description` - Descripción del rol
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Teams (Equipos)
- `id` - Identificador único
- `name` - Nombre del equipo (único)
- `description` - Descripción del equipo
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

### 🚀 Project Management Domain

#### Developments (Desarrollos)
- `id` - Identificador único
- `title` - Título del desarrollo
- `description` - Descripción detallada
- `status` - Estado (planning, in_progress, testing, completed, cancelled)
- `priority` - Prioridad (low, medium, high, critical)
- `progress` - Porcentaje de progreso (0-100)
- `assignedToId` - FK hacia usuarios
- `teamId` - FK hacia equipos
- `environmentId` - FK hacia ambientes
- `startDate` - Fecha de inicio
- `endDate` - Fecha de finalización
- `estimatedDate` - Fecha estimada
- `repository` - URL del repositorio
- `branch` - Rama de desarrollo
- `notes` - Notas adicionales
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Microservices (Microservicios)
- `id` - Identificador único
- `name` - Nombre del microservicio (único)
- `description` - Descripción
- `repository` - URL del repositorio
- `technology` - Tecnología utilizada
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Development_Microservices (Relación N:M)
- `id` - Identificador único
- `developmentId` - FK hacia desarrollos
- `microserviceId` - FK hacia microservicios
- `progress` - Progreso específico del microservicio
- `notes` - Notas específicas
- `version` - Versión del microservicio
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación

### ⚙️ Infrastructure Domain

#### Environments (Ambientes)
- `id` - Identificador único
- `name` - Nombre del ambiente (único)
- `description` - Descripción
- `color` - Color para UI
- `order` - Orden de visualización
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Deployment_Types (Tipos de Despliegue)
- `id` - Identificador único
- `name` - Nombre del tipo (único)
- `description` - Descripción
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Upcoming_Deployments (Despliegues Programados)
- `id` - Identificador único
- `title` - Título del despliegue
- `description` - Descripción
- `status` - Estado (scheduled, in_progress, completed, failed, cancelled)
- `scheduledDate` - Fecha programada
- `actualDate` - Fecha real de ejecución
- `version` - Versión a desplegar
- `notes` - Notas adicionales
- `developmentId` - FK hacia desarrollos (opcional)
- `environmentId` - FK hacia ambientes
- `deployedById` - FK hacia usuarios
- `deploymentTypeId` - FK hacia tipos de despliegue
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

### 📝 Activity Domain

#### Recent_Activities (Actividades)
- `id` - Identificador único
- `type` - Tipo de actividad (enum)
- `description` - Descripción de la actividad
- `metadata` - Datos adicionales (JSON)
- `developmentId` - FK hacia desarrollos (opcional)
- `performedById` - FK hacia usuarios (opcional)
- `isActive` - Estado activo/inactivo
- `createdAt` - Fecha de creación

## 📖 Documentación API

Una vez ejecutando el servidor, la documentación Swagger está disponible en:
```
http://localhost:3000/api/docs
```

## 🔧 Beneficios de la Arquitectura DDD

### 🎯 **Cohesión Alta**
Cada dominio agrupa entidades relacionadas:
- **Identity**: Todo lo relacionado con usuarios
- **Project Management**: Desarrollos y microservicios
- **Infrastructure**: Ambientes y despliegues
- **Activity**: Actividades del sistema

### 🔌 **Acoplamiento Bajo**
- Dominios independientes entre sí
- Comunicación a través de interfaces bien definidas
- Fácil mantenimiento y testing

### 🗄️ **Patrón Repository**
- Abstracción completa de acceso a datos
- `BaseRepository` con operaciones CRUD comunes
- Repositorios específicos con métodos avanzados
- Fácil testing con mocks

### 📦 **Barrel Exports**
- Importaciones limpias: `import { User } from '../identity'`
- Encapsulación de módulos
- API pública bien definida

### 🚀 **Escalabilidad**
- Fácil agregar nuevos dominios
- Servicios independientes
- Preparado para microservicios

## 🔧 Scripts Disponibles

- `npm run build` - Compilar aplicación
- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Iniciar en modo desarrollo (watch)
- `npm run start:debug` - Iniciar en modo debug
- `npm run start:prod` - Iniciar en modo producción
- `npm run seed` - Ejecutar seeds con datos de desarrollo
- `npm run lint` - Ejecutar linter ESLint
- `npm run test` - Ejecutar tests unitarios
- `npm run test:watch` - Ejecutar tests en modo watch
- `npm run test:cov` - Ejecutar tests con cobertura

## 🔒 Seguridad

- **Validación robusta** con `class-validator` en todos los DTOs
- **Sanitización automática** de datos de entrada
- **CORS configurado** para frontend específico
- **Headers de seguridad** configurados
- **Passwords hasheadas** con bcrypt
- **Preparado para JWT** en próximas iteraciones

## 🚀 Despliegue

### Docker (Recomendado)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Variables de Entorno Producción
```env
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=devtracker_prod
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📊 Métricas y Monitoreo

El sistema proporciona métricas en tiempo real:

### Dashboard Metrics
```json
{
  "totalDevelopments": 45,
  "byStatus": {
    "planning": 12,
    "in_progress": 18,
    "testing": 8,
    "completed": 7
  },
  "byPriority": {
    "low": 10,
    "medium": 20,
    "high": 12,
    "critical": 3
  },
  "averageProgress": 68.5,
  "completedThisMonth": 7,
  "overdue": 3
}
```

### User Statistics
```json
{
  "totalUsers": 15,
  "activeUsers": 14,
  "usersByRole": [
    { "roleName": "desarrollador", "count": 8 },
    { "roleName": "QA", "count": 4 },
    { "roleName": "cloud", "count": 3 }
  ],
  "usersByTeam": [
    { "teamName": "Backend Team", "count": 5 },
    { "teamName": "Frontend Team", "count": 4 },
    { "teamName": "DevOps Team", "count": 3 },
    { "teamName": "QA Team", "count": 3 }
  ]
}
```

## 🔄 Migración desde Arquitectura Anterior

Si estás migrando desde la estructura anterior:

### ✅ Estructura Nueva vs Anterior
```bash
# ❌ Estructura anterior (eliminada)
src/modules/user/          → src/modules/identity/
src/modules/role/          → src/modules/identity/
src/modules/team/          → src/modules/identity/
src/modules/development/   → src/modules/project-management/
src/modules/microservice/  → src/modules/project-management/
src/modules/environment/   → src/modules/infrastructure/
src/modules/deployment/    → src/modules/infrastructure/
```

### 🔧 Pasos de Migración
1. Los módulos antiguos ya fueron eliminados
2. Seeds actualizados para usar nuevos repositorios
3. Controladores y servicios optimizados
4. Base de datos compatible (sin cambios de esquema)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Formato de Commits
```bash
feat(domain): add new user statistics endpoint
fix(repository): resolve query performance issue
docs(readme): update API documentation
refactor(service): simplify development logic
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte y preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación Swagger: `http://localhost:3000/api/docs`

---

**DevTracker Backend API** - Sistema empresarial de seguimiento de desarrollos con arquitectura DDD

*Construido con ❤️ usando NestJS, TypeORM, PostgreSQL y principios de Domain-Driven Design*
