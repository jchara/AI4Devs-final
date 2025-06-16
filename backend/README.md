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

### ✨ Funcionalidades Avanzadas Implementadas

- **🗑️ Soft Delete Universal** - Eliminación lógica en todas las entidades
- **📝 Sistema de Actividad** - Tracking automático de cambios
- **🔧 Validaciones Robustas** - DTOs con class-validator
- **📊 Métricas Avanzadas** - Dashboard con estadísticas en tiempo real

## 📋 Requisitos Previos

- Node.js 20.10.0
- npm 10.2.0
- PostgreSQL 12+
- NestJS CLI 10.0.0

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

### 🚀 Aplicación
- `npm run build` - Compilar aplicación
- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Iniciar en modo desarrollo (watch)
- `npm run start:debug` - Iniciar en modo debug
- `npm run start:prod` - Iniciar en modo producción
- `npm run seed` - Ejecutar seeds con datos de desarrollo
- `npm run lint` - Ejecutar linter ESLint

### 🧪 Testing Híbrido

#### Tests Unitarios (Mocks - Rápidos)
- `npm run test:unit` - Ejecutar tests unitarios con mocks
- `npm run test:unit:watch` - Tests unitarios en modo watch
- `npm run test:unit:cov` - Tests unitarios con cobertura

#### Tests de Integración (BD Real - Completos)
- `npm run test:integration` - Ejecutar tests de integración con BD real
- `npm run test:integration:watch` - Tests de integración en modo watch
- `npm run test:integration:cov` - Tests de integración con cobertura

#### Tests Tradicionales
- `npm test` - Ejecutar todos los tests (detecta ambiente automáticamente)
- `npm run test:watch` - Tests en modo watch
- `npm run test:cov` - Tests con reporte de cobertura
- `npm run test:debug` - Tests en modo debug
- `npm run test:e2e` - Tests end-to-end

#### Tests Específicos
```bash
# Ejecutar test específico (unitario)
npm run test:unit -- --testPathPattern=activity.service.spec.ts

# Ejecutar test específico (integración)
npm run test:integration -- --testPathPattern=activity.service.spec.ts

# Ejecutar con verbose para más detallenpm run test:integration -- --testPathPattern=activity.service.spec.ts 
s
npm run test:unit -- --testPathPattern=activity.service.spec.ts --verbose

# También funciona con patrones más amplios
npm run test:unit -- --testPathPattern=activity
npm run test:unit -- --testPathPattern=service.spec
```

### 🎯 Estrategia de Testing Híbrida

#### 🏠 Ambiente Local (Desarrollo)
```bash
# Variables de entorno para tests de integración
TEST_ENV=local
USE_REAL_DB=true
```
- **Conexión:** PostgreSQL real de desarrollo
- **Velocidad:** Más lento (~30-60s) pero más realista
- **Detecta:** Problemas de queries, relaciones, constraints
- **Ideal para:** Desarrollo local y debugging

#### ☁️ Ambiente CI/CD (Producción)
```bash
# Variables de entorno para tests unitarios
NODE_ENV=test
```
- **Conexión:** Mocks para todos los repositorios
- **Velocidad:** Súper rápido (~15s)
- **Sin dependencias:** No requiere BD externa
- **Ideal para:** Pipelines de CI/CD y desarrollo rápido

### 📊 Estado Actual de Tests
- **Tests implementados**: 54+ tests funcionando
- **ActivityService**: 14 tests ✅ (100% cobertura)
- **Estrategia híbrida**: Implementada y funcionando
- **Tests unitarios**: ~15 segundos de ejecución
- **Tests de integración**: Preparados para BD local
- **Suites funcionando**: 5/9 (ActivityService, ComponentService, DatabaseService, AppController, ActivityController)

## 🔒 Seguridad

- **Validación robusta** con `class-validator` en todos los DTOs
- **Sanitización automática** de datos de entrada
- **CORS configurado** para frontend específico
- **Headers de seguridad** configurados
- **Passwords hasheadas** con bcrypt
- **Preparado para JWT** en próximas iteraciones

## 🚀 Despliegue

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

### 🔧 Pasos de Migración
1. Los módulos antiguos ya fueron eliminados
2. Seeds actualizados para usar nuevos repositorios
3. Controladores y servicios optimizados
4. Base de datos compatible (sin cambios de esquema)

## 🧪 Configuración de Testing

### 📁 Archivos de Configuración
```
src/test/
├── test-config.helper.ts    # Detección automática de ambiente
└── test-module.factory.ts   # Factory para módulos de testing
```

### ⚙️ Variables de Entorno para Tests
Crear archivo `.env.test` en la raíz del proyecto:
```env
# Test Environment Configuration
NODE_ENV=test
TEST_ENV=local

# Database Configuration for Tests
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE_TEST=devtracker_test

# Test Configuration
USE_REAL_DB=false

# Test Data Variables
TEST_USER_NAME=Test User
TEST_USER_EMAIL=test@example.com
TEST_COMPONENT_NAME=Test Component
TEST_PROJECT_NAME=Test Project
```

### 🎯 Cómo Funciona la Estrategia Híbrida

#### 1. **Detección Automática**
El sistema detecta automáticamente qué tipo de tests ejecutar basado en:
- `NODE_ENV=test` → Tests unitarios con mocks
- `TEST_ENV=local` → Tests de integración con BD real
- `USE_REAL_DB=true` → Forzar BD real

#### 2. **Configuración Dinámica**
```typescript
// El helper detecta el ambiente automáticamente
const testConfig = getTestConfig();

if (testConfig.useMocks) {
  // Configurar mocks para tests rápidos
} else {
  // Configurar conexión a BD real
}
```

#### 3. **Logs Informativos**
```bash
🧪 Test Configuration:
  Environment: test
  Database: Mocked
  Strategy: Unit Tests
```

### 🚀 Configurar BD para Tests de Integración (Opcional)

Si quieres ejecutar tests de integración con BD real:

1. **Crear BD de testing**
```sql
CREATE DATABASE devtracker_test;
```

2. **Configurar variables**
```bash
# En .env.test
TEST_ENV=local
USE_REAL_DB=true
DB_DATABASE_TEST=devtracker_test
```

3. **Ejecutar tests de integración**
```bash
npm run test:integration
```

### 📊 Beneficios de la Estrategia Híbrida

#### ✅ **Tests Unitarios (Mocks)**
- **Velocidad**: ~15 segundos
- **Sin dependencias**: No requiere BD
- **Ideal para**: CI/CD, desarrollo rápido
- **Cobertura**: Lógica de negocio

#### ✅ **Tests de Integración (BD Real)**
- **Realismo**: Detecta problemas reales
- **Queries**: Valida SQL y relaciones
- **Constraints**: Verifica reglas de BD
- **Ideal para**: Desarrollo local, debugging

#### 🎯 **Lo Mejor de Ambos Mundos**
- Desarrollo rápido con mocks
- Validación completa con BD real
- Configuración automática
- Sin duplicación de código

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
