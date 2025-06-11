# Historias de Usuario - DevTracker
## Sistema de Seguimiento de Desarrollos en Microservicios

### **📋 ÉPICAS PRINCIPALES**

#### **ÉPICA 1: Gestión de Usuarios y Autenticación**
#### **ÉPICA 2: Gestión de Proyectos y Componentes**
#### **ÉPICA 3: Gestión de Desarrollos**
#### **ÉPICA 4: Gestión de Bases de Datos**
#### **ÉPICA 5: Gestión de Despliegues**
#### **ÉPICA 6: Dashboard y Reportes**
#### **ÉPICA 7: Auditoría y Actividades**

---

## **👥 ÉPICA 1: GESTIÓN DE USUARIOS Y AUTENTICACIÓN**

### **HU-001: Registro de Usuario** - 🔧 **BACKEND**
**Como** administrador del sistema  
**Quiero** poder registrar nuevos usuarios en el sistema  
**Para** que puedan acceder y gestionar desarrollos

**Criterios de Aceptación:**
- [ ] El sistema permite crear usuarios con email único
- [ ] Las contraseñas se encriptan con bcrypt
- [ ] Se asigna un rol por defecto (developer)
- [ ] Se asigna a un equipo existente
- [ ] Se valida el formato del email
- [ ] Se requiere contraseña mínima de 8 caracteres

**Endpoints:**
- `POST /api/v1/users`

---

### **HU-002: Autenticación JWT** - 🔧 **BACKEND**
**Como** usuario registrado  
**Quiero** autenticarme en el sistema usando email y contraseña  
**Para** acceder a las funcionalidades según mi rol

**Criterios de Aceptación:**
- [ ] El sistema genera token JWT válido al autenticar
- [ ] El token incluye información del usuario y rol
- [ ] El token expira en 1 hora
- [ ] Se genera refresh token para renovación
- [ ] Se validan credenciales contra base de datos
- [ ] Se registra la fecha del último login

**Endpoints:**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

---

### **HU-003: Formulario de Login** - 🎨 **FRONTEND**
**Como** usuario del sistema  
**Quiero** una interfaz de login intuitiva  
**Para** acceder rápidamente al sistema

**Criterios de Aceptación:**
- [ ] Formulario con campos email y contraseña
- [ ] Validación en tiempo real de campos
- [ ] Mensajes de error claros
- [ ] Opción "Recordar sesión"
- [ ] Diseño responsivo
- [ ] Integración con Material UI

**Componentes:**
- `LoginComponent`
- `AuthService`

---

### **HU-004: Gestión de Roles** - 🔧 **BACKEND**
**Como** administrador  
**Quiero** gestionar roles del sistema  
**Para** controlar permisos de usuarios

**Criterios de Aceptación:**
- [ ] CRUD completo de roles
- [ ] Roles predefinidos: admin, developer, manager, qa
- [ ] Soft delete de roles
- [ ] Validación de permisos por rol
- [ ] Auditoría de cambios de roles

**Endpoints:**
- `GET /api/v1/roles`
- `POST /api/v1/roles`
- `PUT /api/v1/roles/:id`
- `DELETE /api/v1/roles/:id`

---

### **HU-005: Gestión de Equipos** - 🔧 **BACKEND**
**Como** administrador  
**Quiero** gestionar equipos de trabajo  
**Para** organizar desarrolladores por proyectos

**Criterios de Aceptación:**
- [ ] CRUD completo de equipos
- [ ] Asignación de usuarios a equipos
- [ ] Soft delete de equipos
- [ ] Consulta de usuarios por equipo
- [ ] Validación de nombres únicos

**Endpoints:**
- `GET /api/v1/teams`
- `POST /api/v1/teams`
- `PUT /api/v1/teams/:id`
- `DELETE /api/v1/teams/:id`
- `GET /api/v1/teams/:id/users`

---

## **🏗️ ÉPICA 2: GESTIÓN DE PROYECTOS Y COMPONENTES**

### **HU-006: Gestión de Proyectos** - 🔧 **BACKEND**
**Como** administrador de proyectos  
**Quiero** gestionar proyectos de software  
**Para** organizar el código y componentes

**Criterios de Aceptación:**
- [ ] CRUD completo de proyectos
- [ ] Tipos: backend, frontend
- [ ] URL de repositorio requerida
- [ ] Soft delete implementado
- [ ] Validación de URLs de repositorio

**Endpoints:**
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `PUT /api/v1/projects/:id`
- `DELETE /api/v1/projects/:id`

---

### **HU-007: Gestión de Componentes** - 🔧 **BACKEND**
**Como** arquitecto de software  
**Quiero** gestionar componentes de cada proyecto  
**Para** tener control granular de microservicios y microfrontends

**Criterios de Aceptación:**
- [ ] CRUD completo de componentes
- [ ] Tipos: microservice, microfrontend, monolith
- [ ] Relación obligatoria con proyecto
- [ ] Campo tecnología requerido
- [ ] Versionado de componentes
- [ ] Soft delete implementado

**Endpoints:**
- `GET /api/v1/components`
- `POST /api/v1/components`
- `PUT /api/v1/components/:id`
- `DELETE /api/v1/components/:id`
- `GET /api/v1/projects/:id/components`

---

### **HU-008: Catálogo de Proyectos** - 🎨 **FRONTEND**
**Como** desarrollador  
**Quiero** visualizar todos los proyectos disponibles  
**Para** entender la estructura del ecosistema

**Criterios de Aceptación:**
- [ ] Lista de proyectos con filtros
- [ ] Búsqueda por nombre y tipo
- [ ] Vista de componentes por proyecto
- [ ] Acceso a repositorios externos
- [ ] Indicadores de estado activo

**Componentes:**
- `ProjectListComponent`
- `ProjectCardComponent`
- `ProjectService`

---

### **HU-009: Catálogo de Componentes** - 🎨 **FRONTEND**
**Como** desarrollador  
**Quiero** explorar componentes disponibles  
**Para** identificar dependencias y arquitectura

**Criterios de Aceptación:**
- [ ] Lista filtrable de componentes
- [ ] Agrupación por proyecto y tipo
- [ ] Información de tecnología y versión
- [ ] Estado de actividad
- [ ] Enlaces a documentación

**Componentes:**
- `ComponentListComponent`
- `ComponentDetailComponent`
- `ComponentService`

---

## **🚀 ÉPICA 3: GESTIÓN DE DESARROLLOS**

### **HU-010: Crear Desarrollo** - 🔧 **BACKEND**
**Como** desarrollador  
**Quiero** crear un nuevo desarrollo  
**Para** trackear cambios en múltiples componentes

**Criterios de Aceptación:**
- [ ] Título y descripción requeridos
- [ ] Estado inicial: planning
- [ ] Prioridad por defecto: medium
- [ ] Asignación a usuario y equipo
- [ ] Ambiente objetivo opcional
- [ ] Integración con URL de Jira

**Endpoints:**
- `POST /api/v1/developments`

---

### **HU-011: Actualizar Estado de Desarrollo** - 🔧 **BACKEND**
**Como** desarrollador  
**Quiero** actualizar el estado de un desarrollo  
**Para** reflejar el progreso actual

**Criterios de Aceptación:**
- [ ] Flujo de estados: planning → in_progress → testing → completed
- [ ] Posibilidad de cancelar en cualquier momento
- [ ] Actualización automática de fechas
- [ ] Registro de actividad automático
- [ ] Validación de transiciones válidas

**Endpoints:**
- `PUT /api/v1/developments/:id/status`

---

### **HU-012: Asociar Componentes a Desarrollo** - 🔧 **BACKEND**
**Como** desarrollador  
**Quiero** asociar componentes afectados a un desarrollo  
**Para** trackear todos los cambios realizados

**Criterios de Aceptación:**
- [ ] Relación many-to-many developments-components
- [ ] Tipos de cambio: created, modified, deleted
- [ ] Progreso individual por componente
- [ ] Versionado por componente
- [ ] Notas específicas del cambio

**Endpoints:**
- `POST /api/v1/developments/:id/components`
- `PUT /api/v1/developments/:id/components/:componentId`
- `DELETE /api/v1/developments/:id/components/:componentId`

---

### **HU-013: Formulario de Desarrollo** - 🎨 **FRONTEND**
**Como** desarrollador  
**Quiero** un formulario intuitivo para crear desarrollos  
**Para** registrar rápidamente nueva funcionalidad

**Criterios de Aceptación:**
- [ ] Wizard multi-paso para creación
- [ ] Autocompletado para asignación de usuarios
- [ ] Selector de componentes afectados
- [ ] Validación en tiempo real
- [ ] Previsualización antes de guardar

**Componentes:**
- `DevelopmentFormComponent`
- `DevelopmentWizardComponent`
- `ComponentSelectorComponent`

---

### **HU-014: Lista de Desarrollos** - 🎨 **FRONTEND**
**Como** líder técnico  
**Quiero** visualizar todos los desarrollos activos  
**Para** monitorear el progreso del equipo

**Criterios de Aceptación:**
- [ ] Vista de lista con filtros avanzados
- [ ] Filtros por estado, prioridad, equipo
- [ ] Indicadores visuales de progreso
- [ ] Búsqueda por título y descripción
- [ ] Paginación y ordenamiento

**Componentes:**
- `DevelopmentListComponent`
- `DevelopmentFilterComponent`
- `DevelopmentCardComponent`

---

### **HU-015: Detalle de Desarrollo** - 🎨 **FRONTEND**
**Como** desarrollador  
**Quiero** ver el detalle completo de un desarrollo  
**Para** entender el alcance y progreso

**Criterios de Aceptación:**
- [ ] Vista completa con tabs organizados
- [ ] Información general del desarrollo
- [ ] Lista de componentes afectados
- [ ] Historial de cambios de estado
- [ ] Enlaces a Jira y repositorios

**Componentes:**
- `DevelopmentDetailComponent`
- `DevelopmentTimelineComponent`
- `ComponentImpactComponent`

---

## **🗄️ ÉPICA 4: GESTIÓN DE BASES DE DATOS**

### **HU-016: Gestión de Bases de Datos** - 🔧 **BACKEND**
**Como** DBA  
**Quiero** gestionar las bases de datos del sistema  
**Para** controlar scripts y migraciones

**Criterios de Aceptación:**
- [ ] CRUD de bases de datos
- [ ] Tipos soportados: postgres, mysql
- [ ] Relación con ambientes específicos
- [ ] Versionado de bases de datos
- [ ] Asociación opcional con proyectos

**Endpoints:**
- `GET /api/v1/databases`
- `POST /api/v1/databases`
- `PUT /api/v1/databases/:id`
- `DELETE /api/v1/databases/:id`

---

### **HU-017: Scripts de Base de Datos** - 🔧 **BACKEND**
**Como** desarrollador  
**Quiero** asociar scripts de BD a desarrollos  
**Para** trackear cambios de esquema y datos

**Criterios de Aceptación:**
- [ ] Relación development-database
- [ ] Tipos: schema_change, data_migration, stored_procedure, function, trigger
- [ ] Descripción detallada del script
- [ ] Notas adicionales opcionales
- [ ] Histórico de scripts por desarrollo

**Endpoints:**
- `POST /api/v1/developments/:id/databases`
- `GET /api/v1/developments/:id/databases`
- `PUT /api/v1/developments/:id/databases/:dbId`

---

### **HU-018: Catálogo de Bases de Datos** - 🎨 **FRONTEND**
**Como** DBA  
**Quiero** visualizar todas las bases de datos  
**Para** gestionar el ecosistema de datos

**Criterios de Aceptación:**
- [ ] Lista filtrable por tipo y ambiente
- [ ] Información de versión y estado
- [ ] Indicadores de uso en desarrollos
- [ ] Enlaces a documentación
- [ ] Estadísticas de uso

**Componentes:**
- `DatabaseListComponent`
- `DatabaseCardComponent`
- `DatabaseService`

---

## **📦 ÉPICA 5: GESTIÓN DE DESPLIEGUES**

### **HU-019: Programar Despliegue** - 🔧 **BACKEND**
**Como** DevOps engineer  
**Quiero** programar despliegues de desarrollos  
**Para** coordinar releases en diferentes ambientes

**Criterios de Aceptación:**
- [ ] Asociación con desarrollo específico
- [ ] Selección de ambiente objetivo
- [ ] Fecha programada requerida
- [ ] Asignación de responsable
- [ ] Tipo de despliegue (hotfix, feature, release)

**Endpoints:**
- `POST /api/v1/deployments`
- `GET /api/v1/deployments`
- `PUT /api/v1/deployments/:id`

---

### **HU-020: Gestión de Ambientes** - 🔧 **BACKEND**
**Como** administrador de infraestructura  
**Quiero** gestionar ambientes de despliegue  
**Para** controlar el pipeline de deployment

**Criterios de Aceptación:**
- [ ] CRUD completo de ambientes
- [ ] Orden de despliegue configurable
- [ ] Colores para identificación visual
- [ ] Soft delete implementado
- [ ] Validación de nombres únicos

**Endpoints:**
- `GET /api/v1/environments`
- `POST /api/v1/environments`
- `PUT /api/v1/environments/:id`
- `DELETE /api/v1/environments/:id`

---

### **HU-021: Calendario de Despliegues** - 🎨 **FRONTEND**
**Como** release manager  
**Quiero** visualizar despliegues programados en calendario  
**Para** coordinar releases y evitar conflictos

**Criterios de Aceptación:**
- [ ] Vista de calendario mensual/semanal
- [ ] Codificación por colores de ambiente
- [ ] Filtros por tipo de despliegue
- [ ] Detalles al hacer hover
- [ ] Opciones de edición rápida

**Componentes:**
- `DeploymentCalendarComponent`
- `DeploymentEventComponent`
- `CalendarService`

---

### **HU-022: Timeline de Despliegues** - 🎨 **FRONTEND**
**Como** desarrollador  
**Quiero** ver el timeline de despliegues por desarrollo  
**Para** entender el flujo de release

**Criterios de Aceptación:**
- [ ] Vista chronológica de despliegues
- [ ] Estados visuales por ambiente
- [ ] Información de responsables
- [ ] Enlaces a logs de despliegue
- [ ] Indicadores de éxito/fallo

**Componentes:**
- `DeploymentTimelineComponent`
- `DeploymentStatusComponent`
- `DeploymentService`

---

## **📊 ÉPICA 6: DASHBOARD Y REPORTES**

### **HU-023: Dashboard Principal** - 🎨 **FRONTEND**
**Como** líder técnico  
**Quiero** un dashboard con métricas clave  
**Para** monitorear el estado general del desarrollo

**Criterios de Aceptación:**
- [ ] Resumen de desarrollos por estado
- [ ] Gráficos de progreso del equipo
- [ ] Próximos despliegues programados
- [ ] Actividad reciente del sistema
- [ ] KPIs de rendimiento del equipo

**Componentes:**
- `DashboardComponent`
- `MetricsWidgetComponent`
- `ActivityFeedComponent`
- `ChartsComponent`

---

### **HU-024: Reportes de Desarrollos** - 🔧 **BACKEND**
**Como** project manager  
**Quiero** generar reportes de desarrollos  
**Para** analizar productividad y tiempos

**Criterios de Aceptación:**
- [ ] Reporte por rango de fechas
- [ ] Filtros por equipo y desarrollador
- [ ] Métricas de tiempo de desarrollo
- [ ] Estadísticas de componentes más modificados
- [ ] Exportación a Excel/PDF

**Endpoints:**
- `GET /api/v1/reports/developments`
- `GET /api/v1/reports/productivity`
- `GET /api/v1/reports/components-impact`

---

### **HU-025: Gráficos y Métricas** - 🎨 **FRONTEND**
**Como** product owner  
**Quiero** visualizar métricas en gráficos interactivos  
**Para** tomar decisiones basadas en datos

**Criterios de Aceptación:**
- [ ] Gráficos de barras para estados
- [ ] Gráficos de línea para tendencias
- [ ] Métricas de velocidad de equipo
- [ ] Comparativas entre equipos
- [ ] Filtros temporales interactivos

**Componentes:**
- `ChartsContainerComponent`
- `BarChartComponent`
- `LineChartComponent`
- `MetricsService`

---

## **🔍 ÉPICA 7: AUDITORÍA Y ACTIVIDADES**

### **HU-026: Registro de Actividades** - 🔧 **BACKEND**
**Como** auditor del sistema  
**Quiero** que se registren automáticamente las actividades  
**Para** mantener trazabilidad completa

**Criterios de Aceptación:**
- [ ] Registro automático en interceptors
- [ ] Tipos predefinidos de actividades
- [ ] Metadatos en formato JSON
- [ ] Relación con usuario y desarrollo
- [ ] Timestamps precisos

**Implementación:**
- `ActivityInterceptor`
- `ActivityService`
- `RecentActivity` entity

---

### **HU-027: Histórico de Actividades** - 🎨 **FRONTEND**
**Como** desarrollador  
**Quiero** ver el historial de actividades  
**Para** entender qué cambios se han realizado

**Criterios de Aceptación:**
- [ ] Feed cronológico de actividades
- [ ] Filtros por tipo y usuario
- [ ] Búsqueda por descripción
- [ ] Paginación eficiente
- [ ] Enlaces a entidades relacionadas

**Componentes:**
- `ActivityFeedComponent`
- `ActivityItemComponent`
- `ActivityFilterComponent`

---

### **HU-028: Notificaciones del Sistema** - 🎨 **FRONTEND**
**Como** usuario del sistema  
**Quiero** recibir notificaciones de cambios relevantes  
**Para** mantenerme informado del progreso

**Criterios de Aceptación:**
- [ ] Notificaciones en tiempo real
- [ ] Sistema de preferencias de notificación
- [ ] Indicadores visuales de nuevas notificaciones
- [ ] Histórico de notificaciones
- [ ] Marcado como leído/no leído

**Componentes:**
- `NotificationComponent`
- `NotificationService`
- `NotificationPreferencesComponent`

---

## **🔧 HISTORIAS TÉCNICAS (BACKEND)**

### **HT-001: Configuración de Base de Datos**
- [ ] Configuración de TypeORM
- [ ] Migraciones automáticas
- [ ] Seeds de datos iniciales
- [ ] Índices optimizados
- [ ] Soft delete global

### **HT-002: Autenticación y Seguridad**
- [ ] JWT Guard implementado
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Validación de inputs
- [ ] Encriptación de passwords

### **HT-003: Documentación API**
- [ ] Swagger completamente configurado
- [ ] DTOs documentados
- [ ] Ejemplos de respuesta
- [ ] Códigos de error estándar
- [ ] Versionado de API

### **HT-004: Testing Backend**
- [ ] Tests unitarios para servicios
- [ ] Tests de integración para controladores
- [ ] Tests E2E para flujos críticos
- [ ] Mocks de base de datos
- [ ] Cobertura mínima 80%

---

## **🎨 HISTORIAS TÉCNICAS (FRONTEND)**

### **HT-005: Configuración Angular**
- [ ] Material UI completamente integrado
- [ ] Tema personalizado configurado
- [ ] PWA básico implementado
- [ ] Lazy loading de módulos
- [ ] Service Worker configurado

### **HT-006: Estado Global**
- [ ] NgRx Store configurado
- [ ] Actions y Reducers por módulo
- [ ] Effects para operaciones asíncronas
- [ ] Selectors optimizados
- [ ] DevTools configurado

### **HT-007: Interceptors y Guards**
- [ ] HTTP Interceptor para tokens
- [ ] Error Interceptor global
- [ ] Auth Guard para rutas protegidas
- [ ] Loading Interceptor
- [ ] Cache Interceptor

### **HT-008: Testing Frontend**
- [ ] Tests unitarios para componentes
- [ ] Tests de servicios
- [ ] Tests E2E con Cypress
- [ ] Mocks de HTTP requests
- [ ] Cobertura mínima 70%

---

## **📋 RESUMEN DE DISTRIBUCIÓN**

### **🔧 BACKEND (NestJS) - 28 Historias**
- **Autenticación y Usuarios**: 5 HU
- **Proyectos y Componentes**: 3 HU  
- **Desarrollos**: 4 HU
- **Bases de Datos**: 2 HU
- **Despliegues**: 2 HU
- **Reportes**: 1 HU
- **Auditoría**: 1 HU
- **Técnicas**: 4 HT
- **API y Documentación**: 6 endpoints principales

### **🎨 FRONTEND (Angular) - 22 Historias**
- **Autenticación**: 1 HU
- **Catálogos**: 2 HU
- **Desarrollos**: 3 HU
- **Bases de Datos**: 1 HU
- **Despliegues**: 2 HU
- **Dashboard**: 3 HU
- **Auditoría**: 2 HU
- **Notificaciones**: 1 HU
- **Técnicas**: 4 HT
- **Componentes**: 35+ componentes

### **🎯 PRIORIZACIÓN SUGERIDA**

#### **Sprint 1 (Foundation)**
- HT-001 a HT-008 (Configuración técnica)
- HU-001, HU-002, HU-003 (Autenticación básica)
- HU-006, HU-007 (Proyectos y componentes)

#### **Sprint 2 (Core Development)**
- HU-010, HU-011, HU-012 (Gestión de desarrollos)
- HU-013, HU-014, HU-015 (UI de desarrollos)
- HU-004, HU-005 (Roles y equipos)

#### **Sprint 3 (Database & Deployment)**
- HU-016, HU-017, HU-018 (Bases de datos)
- HU-019, HU-020, HU-021 (Despliegues)
- HU-026, HU-027 (Auditoría)

#### **Sprint 4 (Analytics & Polish)**
- HU-023, HU-024, HU-025 (Dashboard y reportes)
- HU-022 (Timeline avanzado)
- HU-028 (Notificaciones)

**Estimación Total: 50 historias en 4 sprints de 2 semanas cada uno** 