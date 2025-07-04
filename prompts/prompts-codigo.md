# Lista de Prompts
> Modelo de IA utilizado: Claude 3.7 Sonnet

## Prompt 1: Configuración Inicial del Proyecto - FULLSTACK
**HUS Relacionadas:** HT-001, HT-005

```
Como desarrollador Senior, crea la base de un proyecto, utilizando las siguientes tecnologías:

Backend: Nestjs 11 con type ORM
Frontend: Angular 19 con angular material
Database: PostgreSQL 16
Node 20

* tener un directorio independiente para el back y para el front, llamados backend y frontend
* para la base de datos utilizar con docker.
* en la raiz del proyecto crea un archivo prompts.md donde vayas registrando el historial de prompts
* crear un archivo readme con las instrucciones
* implementar practicas DDD o TDD
```

## Prompt 2: Configuración de Variables de Entorno - BACKEND
**HUS Relacionadas:** HT-001

```
@docker-compose.yml 
revisa mi archivo de docker y crea el archivo de .env y pasa las variables a allí, adicionalmente crea el archivo de ejemplo .env.example.
```

> Modelo de IA utilizado: Claude Sonnet 4

## Prompt 3: Dashboard moderno para sistema de seguimiento de microservicios - FRONTEND
**HUS Relacionadas:** HU-023

```
Como desarrollador front senior en angular y experto en UX/UI, diseña un dashboard moderno para un sistema de seguimiento de desarrollos de microservicios con las siguientes características:

**Layout:**
- Header con logo, título "DevTracker", toggle modo oscuro/claro, y avatar de usuario
- Sidebar izquierdo con navegación: Dashboard, Desarrollos, Microservicios, Ambientes, Jira Sync
- Área principal con grid de 3 columnas para métricas clave

**Componentes principales:**
- 4 tarjetas de métricas superiores: Total Desarrollos, En QA, En Producción, Pendientes
- Tabla responsiva con desarrollos activos (columnas: Nombre, Estado, Ambiente, Fecha, Acciones)
- Panel lateral derecho con actividad reciente y próximos despliegues
- Gráfico de barras mostrando desarrollos por ambiente

**Paleta de colores:**
- Fondo: #FFFFFF (claro) / #121212 (oscuro)
- Texto: #000000 (claro) / #FFFFFF (oscuro)
- Primario: #7D2BE3 (claro) / #B491F2 (oscuro)
- Acento: #66C6EA (claro) / #66D9EF (oscuro)
- Texto secundario: #333333 (claro) / #888888 (oscuro)

**Estilo visual:**
- Diseño clean y minimalista
- Bordes redondeados sutil (8px)
- Sombras suaves para depth
- Iconos consistentes (Lucide icons)
- Estados hover interactivos
- Responsive design mobile-first

Ten las imágenes como referencia para el diseño y estructura.
para los modos claro y oscuro

Ten en cuenta buenas prácticas tanto de diseño como de seguridad.
Indícame el proceso a realizar, no realices código aún espera a que confirme que lo hagas. Si tienes alguna consulta, hazlas primero.
```

## Prompt 4: Respuestas sobre implementación del dashboard - FRONTEND
**HUS Relacionadas:** HU-023

```
Respondiendo a tus preguntas antes de realizar la integración del Dashboard:
1. utilizar angular material pero adaptando los estilos a los de las imágenes.
2. para los gráficos utiliza ng2-charts ya que este es un wrapper de angular para Chart.js lo que nos ayuda a utilizar @Input(), @Output()
3. En el momento no necesito autenticación/guards para las rutas, solo las rutas sin autenticación/guards
4. inicialmente los datos serán mock, pero los puedes dejar en los servicios para cambiarlos a los endpoints reales en otra iteración.
5. Se van a implementar test unitarios y e2e.
6. El avatar de usuario por el momento es solo visual, se podrán agregar funciones más adelante ya que aún no existe sistema de sesión de usuarios.
```

## Prompt 5: Ajustar sidebar para evitar superposición con header - FRONTEND
**HUS Relacionadas:** HU-023, HT-005

```
Necesito ajustar el sidebar ya que el header no deja ver bien el menú, el primer item de dashboard no se ve.
```

## Prompt 6: Eliminar línea azul del elemento activo del sidebar - FRONTEND
**HUS Relacionadas:** HU-023, HT-005

```
Cuando se selecciona un item del menú, cambia de color indicando que es el seleccionado, eso está bien, pero como ves en la imagen se muestra una línea azul dentro del item seleccionado, puedes quitar esa línea azul.
```

## Prompt 7: Vista de lista avanzada para gestionar desarrollos - FRONTEND
**HUS Relacionadas:** HU-014

```
Eres un experto desarrollador front senior en angular y experto en UX/UI, crea una vista de lista avanzada para gestionar desarrollos con funcionalidades de filtrado y búsqueda:

**Header de la vista:**
- Título "Mis Desarrollos" con contador total
- Botón primario "+ Nuevo Desarrollo"
- Barra de búsqueda con icono de lupa
- Filtros rápidos: Todos, En desarrollo, En QA, En producción, Completados

**Tabla de desarrollos:**
- Columnas: Estado (badge), Nombre, Descripción breve, Microservicios, Ambiente actual, Fecha actualización, Acciones
- Badges de estado con colores: Desarrollo (azul), QA (amarillo), Aprobado (verde), Rechazado (rojo)
- Avatares/iconos para microservicios (NestJS, Python, Node)
- Menu de acciones: Ver detalles, Editar, Cambiar estado, Eliminar

**Funcionalidades:**
- Paginación con 20 elementos por página
- Ordenamiento por columnas clickeables
- Selección múltiple con checkbox
- Acciones masivas en header seleccionado
- Estados vacíos con ilustración y CTA

**Responsive:**
- En móviles: Cards apiladas en lugar de tabla
- Navegación de filtros como tabs horizontales
- Búsqueda expandible

Utiliza los mocks pero crea el servicio correspondiente para después integrar el servicio desde el backend, los mocks deben estar en el servicio para que al momento de integrar los servicios reales no se deba modificar los componentes.ts

Ten cuenta buenas prácticas tanto de diseño como de seguridad.
Indícame el proceso que vas a realizar, no realices código aún espera a que confirme que lo hagas. Si tienes alguna consulta, hazla primero.
```

## Prompt 8: Respuestas sobre implementación de vista de desarrollos - FRONTEND  
**HUS Relacionadas:** HU-014

```
Respondiendo tus preguntas para proceder con el desarrollo:
1. 
- Si crea los campos id, fecha creación, fecha de actualización y autor.
- Los microservicios son una lista de objetos, id y nombre
- Los estados del desarrollo son: Desarrollo, Archivado, Completado
2. 
- Si la vista debe ser accesible desde la ruta /desarrollos
- El botón "Nuevo Desarrollo" debe abrir un overlay (de momento déjalo vacío)
- Las acciones "Ver detalles" y "Editar" deben abrir un overlay
3.
- Cambio de opinión, No incluir acciones masivas por el momento.
- El ordenamiento debe ser solo visual (frontend) no enviar datos al backend para ordenar
- La búsqueda debe ser en tiempo real, puedes implementar un debounce con un tiempo adecuado
4. 
- En esta vista puedes utilizar los mismos datos mock del dashboard si corresponde el servicio, si ves que debe ser un servicio nuevo, entonces deben ser otros datos.
- Si los contadores deben tener coherencia con el dashboard

Adicionalmente:
- utiliza las mismas librerías de UI del proyecto
- Mantén diseño responsive 
- Animaciones suaves de entrada/salida
- Botones: "Cancelar" (secundario) y "Crear Desarrollo" (primario)
- Estados de loading y éxito
```

## Prompt 9: Actualización de estados de desarrollos - FRONTEND
**HUS Relacionadas:** HU-014

```
En @development.model.ts del front quite el estado Rechazado para desarrollos, verifica y actualiza la app para que no genere error
```

## Prompt 10: Ajustes de UX en vista de desarrollos - FRONTEND
**HUS Relacionadas:** HU-014

```
En el componente @developments.component.html se debe ajustar lo siguiente:
- El filtro de ambiente dejarlo al lado del input de buscar desarrollo
- El mat-chip-listbox no muestra los colores correspondientes de los estados.
```

## Prompt 11: Unificar estilos con Dashboard - FRONTEND
**HUS Relacionadas:** HU-014, HU-023

```
En el componente @developments.component.html el numero de desarrollos debe tener el mismo estilo que tiene la card con totales en el Dashboard
```

## Prompt 12: Arreglar modo oscuro en tabla de desarrollos - FRONTEND
**HUS Relacionadas:** HU-014, HT-005

```
La tabla de @developments.component.html se ve blanca en modo oscuro y el desplegable de acciones también, no debe ser asi, como desarrollador senior en angular analiza y realiza el ajuste correspondiente.
```

## Prompt 13: Centralización y optimización de estilos CSS - FRONTEND
**HUS Relacionadas:** HT-005

```
@frontend como desarrollador senior en angular y experto en ux/ui y css, analiza el proyecto frontend y verifica si se pueden centralizar los estilos y evitar redundancias o duplicidad.

Ten cuenta buenas prácticas tanto de diseño como de seguridad.
Indícame el proceso que vas a realizar, no realices código aún espera a que confirme que lo hagas. Si tienes alguna consulta, hazla primero
```

## Prompt 14: Resolución de problemas de presupuesto CSS y optimización - FRONTEND
**HUS Relacionadas:** HT-005

```
Error de despliegue en Railway: el archivo developments.component.scss excede el límite de 8kB (tenía 10.81kB). Optimizar el CSS aplicando técnicas de reducción como eliminación de redundancias, simplificación de selectores y consolidación de reglas para cumplir con el budget de Angular.
```

## Prompt 15: Refactorización del modelo de datos - FRONTEND
**HUS Relacionadas:** HU-014

```
Actualizar el modelo de datos eliminando campos innecesarios:
- Remover campo `author` de la interfaz Development y datos mock
- Remover campo `icon` de la interfaz Microservice y datos relacionados
- Actualizar lógica de filtrado y métodos dependientes en development.service.ts
```

## Prompt 16: Mejoras en diseño de microservicios y fechas - FRONTEND
**HUS Relacionadas:** HU-014, HU-023

```
Implementar mejoras de UX en la vista de desarrollos:

**Microservicios:**
- Convertir texto simple a componentes mat-chip pequeños y compactos
- Aplicar truncado con ellipsis para nombres largos usando ::ng-deep
- Unificar diseño entre vistas desktop y móvil

**Columnas de fecha:**
- Dividir columna única en "Fecha Creación" y "Última Actualización"
- Actualizar formato para incluir hora (DD/MM/YYYY, HH:MM)
- Aplicar cambios tanto en tabla de desarrollos como dashboard
```

## Prompt 17: Diseño responsive optimizado con scroll horizontal - FRONTEND
**HUS Relacionadas:** HU-014, HT-005

```
Implementar diseño responsive de tres niveles:

**Breakpoints:**
- Mobile (cards): vista de tarjetas apiladas
- Tablet: tabla con columnas reducidas (displayedColumnsTablet)
- Desktop: tabla completa con todas las columnas

**Optimizaciones:**
- Scroll horizontal (overflow-x: auto) con min-width para prevenir corte de contenido
- Aplicar white-space: nowrap para evitar salto de línea
- Ajustar tamaños de badges y chips para mantener consistencia
- Mejorar espaciado y proporciones en vista móvil
```

## Prompt 18: Rediseño del menú de acciones con enfoque minimalista - FRONTEND
**HUS Relacionadas:** HU-014

```
@developments.component.html mejorar el diseño del menú de acciones con algo más minimalista y profesional manteniendo las mismas opciones:

**Estructura organizada:**
- Agrupar opciones en secciones lógicas con separación visual
- Iconografía mejorada (visibility, edit, radio_button_unchecked, delete_outline)
- Etiquetas de sección en mayúsculas pequeñas

**Diseño refinado:**
- Espaciado optimizado con padding consistente
- Transiciones suaves en hover con cambio de color de iconos
- Tratamiento especial para acción destructiva (Eliminar)
- Versión simplificada para móvil
```

## Prompt 19: Análisis de implementación de lazy loading en navegación del sidebar - FRONTEND
**HUS Relacionadas:** HT-005

```
Eres un experto desarrollador front senior en angular, @frontend analiza este proyecto y verifica que el lazy load esta bien implementado, que la precarga esté activada y que el use memory de material angular este bien gestionado, ya que al navegar en el sidebar la primer vez se siente lento.
```

## Prompt 20: Implementación de optimizaciones avanzadas de rendimiento - FRONTEND
**HUS Relacionadas:** HT-005

```
Implementa estas optimizaciones, sin perder la fluidez de las transiciones cuando se navega entre vistas:

- Implementar @angular/pwa con cache inteligente
- Añadir ChangeDetectorRef para manejo manual de detección de cambios
- Implementar patrón unsubscribe en los componentes
- Material Modules Centralizados para reducir los imports
- Cache para API endpoints y assets estáticos
```

## Prompt 21: Ajustar header y sidebar fijos con funcionalidad de toggle - FRONTEND
**HUS Relacionadas:** HT-005

```
Como experto desarrollador front senior en angular, analiza la estructura de los layout y realza los siguientes ajustes:
1. Header siempre visible incluso al hacer scroll
2. El sidebar debe poder ocultarse, ten presente diseño responsivo
```

## Prompt 22: Análisis arquitectónico frontend y diseño de servicios backend - FULLSTACK
**HUS Relacionadas:** HU-006, HU-007, HT-001

```
Ahora como experto desarrollador full stack angular y nest, con amplio conocimiento en arquitectura de software y base de datos, analiza el proyecto de @frontend y dime que servicios se deben implementar en el @backend con la creación de las tablas correspondientes.

Si tienes alguna pregunta, hazla primero.
```

## Prompt 23: Definición de arquitectura backend con PostgreSQL - BACKEND
**HUS Relacionadas:** HT-001, HT-002

```
Para la definición de arquitectura ten presente lo siguiente:
1. La base de datos debe ser PostgreSQL
2. En el momento no vamos a implementar autenticación, pero si en otra iteración así que deja la arquitectura lista para esto.
3. como es un desarrollo pequeño utilicemos métricas en tiempo real, aunque abierto a pasar a cacheado en un futuro
4. No se necesitan notificaciones
6. utilizar arquitecturas CRUD simple
```

## Prompt 24: Ruta de implementación de servicios backend con TypeORM y PostgreSQL - BACKEND
**HUS Relacionadas:** HU-006, HU-007, HU-010, HU-020, HT-001

```
Como experto en arquitectura de software y desarrollador backend senior en NestJS y TypeORM, crea una ruta de implementación para la arquitectura y desarrollo del backend siguiendo estas especificaciones:

**Configuración base:**
- TypeORM con PostgreSQL
- Estructura modular con NestJS
- Variables de entorno con @nestjs/config
- Preparación para autenticación futura (sin implementar)

**Entidades a crear:**
- Environment (tabla configurable de ambientes)
- Microservice (gestión de microservicios)
- Development (desarrollos principales)
- DevelopmentMicroservice (relación Many-to-Many)
- RecentActivity (actividades del sistema)
- UpcomingDeployment (próximos despliegues)

**Módulos a implementar:**
1. EnvironmentModule - CRUD de ambientes
2. MicroserviceModule - CRUD de microservicios  
3. DevelopmentModule - CRUD de desarrollos + métricas
4. ActivityModule - Gestión de actividades
5. DeploymentModule - Gestión de despliegues

**Endpoints requeridos:**
- GET /api/developments (con filtros y paginación)
- GET /api/developments/metrics (métricas dashboard)
- GET /api/developments/chart-data (datos gráfico)
- CRUD completo para todas las entidades
- Endpoints específicos para cambio de estados

**Técnicas a aplicar:**
- DTOs para validación de entrada
- Transformación de datos en responses
- Manejo de errores con filters
- Documentación con Swagger
- Métricas calculadas en tiempo real
- Preparación para autenticación (guards, decorators)
```

## Prompt 25: Implementación de servicios backend con TypeORM y PostgreSQL - BACKEND
**HUS Relacionadas:** HU-006, HU-007, HU-010, HU-020, HT-001, HT-003

```
De acuerdo al plan de implementación que se creó, ejecuta las siguientes fases:

**FASE 1: Configuración Base**
- Instalar dependencias: TypeORM, PostgreSQL, @nestjs/config
- Configurar app.module.ts con TypeORM async
- Crear estructura de carpetas modular
- Configurar variables de entorno

**FASE 2: Entidades de Base de Datos**
- Environment.entity.ts - Tabla configurable de ambientes
- Microservice.entity.ts - Gestión de microservicios
- Development.entity.ts - Desarrollos principales
- DevelopmentMicroservice.entity.ts - Relación Many-to-Many
- RecentActivity.entity.ts - Actividades del sistema
- UpcomingDeployment.entity.ts - Próximos despliegues

**FASE 3: Módulos y Servicios**
- EnvironmentModule - CRUD básico
- MicroserviceModule - CRUD básico
- DevelopmentModule - CRUD + métricas + filtros
- ActivityModule - Gestión de actividades
- DeploymentModule - Gestión de despliegues

**FASE 4: Controllers y DTOs**
- Crear DTOs para validación de entrada
- Implementar Controllers con endpoints REST
- Configurar filtros de error globales
- Preparar guards para autenticación futura

**FASE 5: Seeds y Configuración**
- Crear seeds para ambientes por defecto
- Configurar Swagger para documentación
- Tests básicos de endpoints
- Verificar integración con frontend

**Consideraciones:**
- El proyecto de back está en el directorio /backend
- Haz una verificación de que el proyecto funcione en cada una de las fases
- Realiza las preguntas correspondientes si tienes, por cada una de las fases de ser necesario
```

## Prompt 27: Análisis de error de conexión a base de datos - BACKEND
**HUS Relacionadas:** HT-001

```
Al ejecutar el proyecto @backend me sale este error de conexión de base de datos:
ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...

Es posible que la configuración esté diferente en el archivo de variables de entorno.

Analiza la configuración y verifica diferencias con las variables configuradas en el archivo de variables de entorno y el archivo de docker compose

Si es necesario realiza los ajustes, si tienes alguna consulta, pregunta primero antes de hacer cualquier cambio
```

## Prompt 28: Creación de nuevas entidades y ajustes de relaciones - BACKEND
**HUS Relacionadas:** HU-001, HU-004, HU-005

```
Como experto en arquitectura y backend con nestjs realizar los siguientes cambios y ajustes en la implementación @backend

- Crear la tabla users con id, nombre, correo
- Crear la tabla teams con id, nombre, descripción
- Crear la tabla deployments_type  con id, nombre y descripción
- ajusta las entidades actuales para crear las relaciones correspondientes
- ajusta los seeds
- ajusta los endpoints de ser necesarios

Analiza el código en general y verifica que se debe actualizar con estos cambios.

Si tienes preguntas, realizarlas antes de hacer cambios en el código e indícame los puntos que vas a seguir.
```

## Prompt 29: Respuestas sobre ajuste de entidades - BACKEND
**HUS Relacionadas:** HU-001, HU-004, HU-005

```
Respondiendo a tus preguntas:
1.
- si la relación de Develoment debe cambiarse a users.id
- si la relación de RecentActivity  debe cambiarse a users.id
-. si el campo deployedBy en UpcomingDeployment debe ser una FK hacia users con rol cloud
2.
- si, el campo team (string) en Development debe cambiar a una FK hacia teams.id
- El campo team en Microservice (actualmente comentado)  debe eliminarse
- si, Los users pertenecen a un team 
3.
-si, el enum actual DeploymentType debe reemplazarse por una FK hacia deployment_types
- si, mantener los tipos actuales 
4.
- No necesito endpoinds de usuarios, pero en los seed crea el usuario (JCC desarrollador, JLL cloud)
- si, ten  hasheo en el campo de contraseña, se utilizara en próximas iteraciones cuando se desee implementar el login.

Adicionalmente crea la tabla rol, con id, nombre y descripción (desarrollador, QA y cloud), asocia a la tabla user
```

## Prompt 31: Reorganización arquitectural por dominios - BACKEND
**HUS Relacionadas:** HT-001, HT-002

```
Como desarrollador senior y arquitecto, ayúdame a reajustar la arquitectura de @backend  teniendo en cuenta los siguientes puntos:

- Ajustar la estructura por agrupación de dominios
- No utilizar base entity
- Implementar barrel exports
- Mantener DTOs por carpetas separadas
- Implementar patron repository
```

## Prompt 32: Análisis de endpoints del proyecto backend y verificación de integración - BACKEND
**HUS Relacionadas:** HT-003

```
Como desarrollador backend, analiza el proyecto @backend y verifica que endpoints hay y cuales tienen integración y cuales no
```

## Prompt 33: Implementación de documentación Swagger en módulos faltantes - BACKEND
**HUS Relacionadas:** HT-003

```
De acuerdo al análisis, agregar Swagger a todos los módulos que falten, antes de hacer cualquier cambio haz un análisis de lo que debes hacer y si tienes alguna pregunta hazla primero
```

## Prompt 34: Análisis de endpoints para reemplazar mocks - FULLSTACK
**HUS Relacionadas:** HU-014, HU-023

```
Como desarrollador senior full stack, analiza los proyectos @backend  y @frontend  y dime que endpoints se pueden implementar en el front y quitar los mocks

no hagas código, solo dame la lista de los endpoints, y si es posible los curl correspondientes
```

## Prompt 35: Despliegue en Railway con Semillas Automáticas - BACKEND
**HUS Relacionadas:** HT-001

```
Como desarrollador senior full stack con conocimientos de infraestructura y despliegue en
railway, crea la configuración correspondiente en el archivo railway.json y ajusta ajusta los scripts del package.json para usar flags de Node.js y que las semillas se ejecuten automáticamente en producción para poblar las tablas.

Crear variable de entorno FIRST_DEPLOY en el archivo de @database.config.ts para controlar
que solo se ejecute cuando sea true
```

## Prompt 36: Integración completa de endpoints backend-frontend - FULLSTACK
**HUS Relacionadas:** HU-014, HU-023

```
Como desarrollador fullstack senior de Angular y Nestjs, realiza la integración de los endpoints que estén listos para integrarse y reemplazar los mocks, hazlo uno por uno y ve realizando las pruebas correspondientes.

Analiza la estructura de respuesta de los endpoints y adapta al front, sin modificar los apartados gráficos que ya están creados.

Antes de realizar cualquier modificación dame el plan de implementación y si tienes preguntas, hazlas primero.

Para dar respuesta a tus preguntas,

1. Crea un enum en el front para traducir los estados que llegan desde el back
2. Si obtener la lista de microservicios desde el endpoint.
3. Ajusta el front para que maneje los ids como llegan desde el back y haz lo mismo con el title y name
4. Si hay campos que sobran que se envían desde el back no los tengas en cuenta por el momento, después se crea una vista con los detalles de cada desarrollo donde se van a utilizar
5. Si el back esta corriendo en  http://localhost:3000, pero utiliza los archivos de environments.ts del front para obtener la url correspondiente
6. Si,  implementar notificaciones/toasts para errores HTTP (con diseño minimalista y acorde las librerías y estilos del proyecto del front)
```

## Prompt 37: Verificar configuración de environments de producción en Angular - FRONTEND
**HUS Relacionadas:** HT-005

```
Analiza si la configuración environment de producción se está ejecutando correctamente, revisa la configuración actual de los dos archivos de environment (dev y prod) y el archivo de angular.json 
para ver si tienen la configuración del reemplazo de archivos de environment
```

## Prompt 38: Cambiar campo repository por URL de tarea de Jira - BACKEND
**HUS Relacionadas:** HU-010, HU-011

```
Necesito Ajustar la entidad de Development para cambiar el campo repository: por jiraUrl, al realizar este cambio, ajusta también el repositorio y las semillas
```

## Prompt 39: Análisis de endpoint detallado de desarrollo - BACKEND
**HUS Relacionadas:** HU-015

```
Eres un desarrollador senior backend con node, analiza el desarrollo @backend  e identifica el endpoint para consultar la información de un desarrollo.

dame un status del endpoint concreto, no hagas cambios.
```

## Prompt 40: Crear vista detallada de desarrollo en panel deslizante - FRONTEND
**HUS Relacionadas:** HU-015

```
Teniendo el contexto de lo que realiza el endpoint para ver detalles de un desarrollo, 
actual como un experto desarrollador frontend senior en Angular y experto en UX/UI.
para  @frontend 

## Contexto del Endpoint
Tengo un endpoint **GET /developments/:id** que retorna la siguiente información (DevelopmentResponseDto):
- ID único del desarrollo
- Título y descripción
- Estado actual (DevelopmentStatus) y prioridad (DevelopmentPriority)
- Progreso (0-100)
- ID del ambiente, usuario asignado y equipo responsable
- URL de Jira y rama de desarrollo
- Fechas (creación, actualización, inicio, estimada, fin)
- Notas adicionales

## Requerimiento
Crear una vista detallada de desarrollo individual que se **despliegue desde el lado derecho** como un panel deslizante (slide-out panel) cuando se selecciona "Ver detalles" desde el menú de acciones de la tabla de desarrollos.

## Especificaciones del Panel Deslizante

### Comportamiento del Panel:
- **Posición**: Panel que se desliza desde el lado derecho de la pantalla
- **Ancho**: Ocupa aproximadamente 60-70% del ancho de la pantalla en desktop
- **Animación**: Transición suave de entrada/salida con backdrop semi-transparente
- **Responsivo**: En móviles ocupa 100% del ancho
- **Overlay**: Fondo oscuro semi-transparente que permite cerrar al hacer clic fuera
- **Scroll**: Scroll independiente del contenido principal

### Layout del Panel:

**Header del Panel:**
- Botón de cerrar (X) en la esquina superior derecha
- Breadcrumbs: Dashboard > Desarrollos > [Título del desarrollo]
- Título del desarrollo con estado badge
- Barra de acciones: Botones "Editar" y "Cambiar Estado"

**Contenido Principal (Layout de 2 columnas dentro del panel):**

**Columna Principal (70%):**
- **Sección "Información General"**: 
  - Descripción del desarrollo
  - Enlaces a issues de Jira (usando la URL de Jira del endpoint)
  - Fechas formateadas (creación, actualización, inicio, estimada, fin)
  - Prioridad y progreso visual

- **Sección "Detalles Técnicos"**:
  - Información del ambiente (ID ambiente)
  - Rama de desarrollo
  - Usuario asignado y equipo responsable
  - Notas adicionales

- **Sección "Timeline de Estado"**:
  - Historial visual de cambios de estado
  - Fechas importantes con iconos
  - Progreso actual con barra visual (0-100)

**Sidebar (30%):**
- **Estado Actual**: Badge grande con estado y progreso circular
- **Información Rápida**:
  - Tiempo transcurrido desde creación
  - Tiempo estimado vs actual
  - Próxima fecha importante
- **Enlaces Rápidos**:
  - Botón directo a Jira (usar URL del endpoint)
  - Acciones rápidas
- **Notas**: Sección para notas adicionales del endpoint

### Interacciones Requeridas:
- **Modal de cambio de estado**: Formulario para actualizar el estado del desarrollo
- **Tooltips informativos** en campos técnicos
- **Expandir/colapsar secciones** con animaciones suaves
- **Confirmación** para acciones importantes
- **Loading states** durante la carga de datos
- **Error handling** si falla la carga del desarrollo

### Consideraciones Técnicas:
- Usar el servicio HTTP para consumir **GET /developments/:id**
- Implementar manejo de errores (404, 400, 500)
- Estados de carga con skeletons
- Tipado TypeScript para DevelopmentResponseDto
- Responsivo con Flexbox/CSS Grid
- Animaciones CSS para transiciones suaves

### UX/UI Requirements:
- **Diseño moderno** con Material Design o similar
- **Jerarquía visual clara** con tipografías diferenciadas
- **Colores semánticos** para estados (success, warning, error)
- **Espaciado consistente** siguiendo design system
- **Accesibilidad** con ARIA labels y navegación por teclado
- **Micro-interacciones** para feedback visual

Crea todos los componentes, servicios, interfaces TypeScript y estilos necesarios para implementar esta funcionalidad completa si ya existen algunos estilos y componentes reutilizalos

### Consideraciones Adicionales:
Ten en cuenta buenas prácticas tanto de diseño como de seguridad.
Indícame el proceso que vas a realizar, no realices código aún espera a que confirme que lo hagas. Si tienes alguna consulta, hazla primero.
```

## Prompt 41: Respuestas sobre prioridades y panel deslizante - FRONTEND
**HUS Relacionadas:** HU-015

```
Respondiendo a tus preguntas:
1. Este es el enum de prioridades que tiene la entidad:
create type developments_priority as enum ('low', 'medium', 'high', 'critical');

2. No tengo conocimiento si existe este componente slide-out panel, verifica el proyecto @frontend  para ver si existe

Como información adicional:

Existe en el back el endpoint de actividad reciente del desarrollo:
http://localhost:3000/api/activities/development/2?limit=10
[
{
        "id": 5,
        "type": "microservice_added",
        "description": "Microservicio auth-service asociado al desarrollo",
        "metadata": {
            "microservice": "auth-service",
            "version": "2.1.0-beta"
        },
        "isActive": true,
        "createdAt": "2025-06-03T02:41:58.843Z",
        "developmentId": 2,
        "performedBy": {
            "id": 3,
            "name": "JCC",
            "email": "jcc@company.com",
            "password": "$2b$10$Okzvq9TvUbOqYp3/pOURK.B14T0sdvJZ2AL5aRCrS5meZQDrMhiWe",
            "isActive": true,
            "createdAt": "2025-06-03T02:41:58.665Z",
            "updatedAt": "2025-06-03T02:41:58.665Z",
            "role": {
                "id": 1,
                "name": "desarrollador",
                "description": "Desarrollador de software",
                "isActive": true,
                "createdAt": "2025-06-03T02:41:58.366Z",
                "updatedAt": "2025-06-03T02:41:58.366Z"
            },
            "roleId": 1,
            "team": {
                "id": 3,
                "name": "Backend Team",
                "description": "Equipo de desarrollo backend",
                "isActive": true,
                "createdAt": "2025-06-03T02:41:58.470Z",
                "updatedAt": "2025-06-03T02:41:58.470Z"
            },
            "teamId": 3
        },
        "performedById": 3
    }
]
Ten presente utilizar estos métodos de rendimiento utilizados actualmente en la aplicación:
Lazy loading del panel
Unsubscribe de observables
Detección de cambios OnPush
```

## Prompt 42: Análisis y ajuste de entidad Development por cambio en desarrollo.repository.ts - BACKEND
**HUS Relacionadas:** HU-012

```
En el proyecto backend@development.repository.ts se agregó en la respuesta de los desarrollos incluir la información de los microservicios que tiene cada desarrollo.

Como desarrollador back senior, analiza el proyecto @backend y ajusta lo que se vea implicado por este cambio.
Antes de hacer algo dame un análisis, y si tienes dudas pregúntame primero.
```

## Prompt 43: Corrección del modelo de microservicios en frontend - FRONTEND
**HUS Relacionadas:** HU-015

```
Con estos ajustes realizados a los endpoints de desarrollos en el back, toma el rol de experto en front Angular, analiza el proyecto @frontend  e identifica donde puedes hacer las mejoras para corregir donde se muestran los microservicios por desarrollo
```

## Prompt 44: Modernización de la interfaz del panel de detalles - FRONTEND
**HUS Relacionadas:** HU-015

```
Analiza los componentes y la información del panel de detalles de desarrollo, dale un estilo moderno como el que acabas de hacer con el ajuste anterior de los microservicios, importante no dañar la funcionalidad del panel.
```

## Prompt 45: Mejoras adicionales en usabilidad del panel de detalles - FRONTEND
**HUS Relacionadas:** HU-015

```
Analizando los cambios realizados, estos algunos ajustes que debes implementar:

- El botón cambio de estado debería ser un desplegable con los estados
- El orden de los elementos dentro de Información General debe ser mejor
- La distribución de las cards dentro del panel debe ser equitativa 
- El color en la linea de progreso se de la card de Estado actual se perdió
```

## Prompt 46: Ajustes finales en el panel de detalles de desarrollo - FRONTEND
**HUS Relacionadas:** HU-015

```
Algunos ajustes adicionales:
quita Detalles Técnicos, Detalle de Microservicios debe ser el primero de la segunda columna y abajo debe estar Estado Actual

la barra de progreso de Estado Actual no tiene color (ver imagen)

en el botón cambiar estado, el desplegable es mas delgado que el botón y los estados tienen un diseño feo (ver imagen 2)
```

## Prompt 47: Implementación de CRUD para entidad environments - BACKEND
**HUS Relacionadas:** HU-020

```
Como desarrollador senior backend analiza el proyecto@/backend  y realiza el crud necesario para la entidad environments

si tienes alguna duda, pregunta primero, y muéstrame el plan de acción antes de hacer cualquier cambio
```

## Prompt 48: Ejecución de implementación del CRUD para entidad environments - BACKEND
**HUS Relacionadas:** HU-020

```
Ejecuta el plan de acción teniendo en cuenta buenas prácticas de programación y seguridad
```

## Prompt 49: Implementación de vista de Ambientes - FRONTEND
**HUS Relacionadas:** HU-020

```
ahora como desarrollador senior en angular y experto en UX/UI, implementa estos nuevos endpoints que se acaban de crear y crea una vista en el proyecto de front @/frontend 

Antes de realizar cualquier cambio ten presente:
- revisar el código del proyecto
- utiliza los mismos patrones y estándares de diseño, de seguridad y de rendimiento
- mantén siempre una interfaz homogénea para botones, tablas paneles, modales, etc

para la nueva vista tener en cuenta:
- La vista debe navegarse desde la opción ambientes del sidebar
- Utiliza las mismas librerías de UI
- Diseño responsive con stack vertical en móviles
- Animaciones suaves de entrada/salid si se necesitan
- Botones: "Cancelar" (secundario) y "Crear Desarrollo" (primario)
- Estados de loading y éxito
- Labels flotantes en inputs
- Usar las mismas variables CSS definidas en el proyecto si es necesario

Indícame el proceso que vas a realizar, no realices código aún espera a que confirme que lo hagas. Si tienes alguna consulta, hazla primero.
```

## Prompt 50: Ajustes adicionales a la vista de Ambientes - FRONTEND
**HUS Relacionadas:** HU-020, HT-005

```
En la nueva vista de ambientes creada, se necesitan hacer los siguientes ajustes:

- cuando se navega a la vista de ambientes no se está aplicando el efecto fadeIn de las demás
vistas, analiza a fondo los estilos de la aplicación e implementa la mejora

- Al navegar a la vista nueva de ambiente, se muestra este error en consola:
[Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952

- Revisa el rendimiento de carga de la nueva vista de ambientes porque funciona lenta,
aplica las técnicas de optimización de las demás vistas ya implementadas
```

## Prompt 51: Ajustes modal de eliminar en la vista de Ambientes - FRONTEND
**HUS Relacionadas:** HU-020

```
En el modal que se creo para confirmar la eliminación de un ambiente se debe cerrar al navegar a otra ruta desde el sidebar
```

## Prompt 52: Ajustes de estilo en la vista de Ambientes - FRONTEND
**HUS Relacionadas:** HU-020, HT-005

```
Ahora se deben ajustar tres cosas en la vista de ambientes:

- El menu de acciones debe tener el mismo estilo que el menu de acciones de la vista desarrollo

- Los toggles de la columna estado no tienen el color primario de la aplicación

- El texto de los toggles no tiene el color de la variable de texto y esto hace que cuando se cambie a modo oscuro el texto del toggle siga de color negro y no se vea
```

## Prompt 53: Implementación de borrado lógico en entidad Environment - BACKEND
**HUS Relacionadas:** HU-020

```
Ahora como desarrollador senior en backend nestJS @environment.entity.ts  ajusta esta entidad para agregar la columna deletedAt para un borrado lógico

- Ajusta el endpoint de eliminar para que realice un soft delete

- Ajusta los endpoints de listar para tener en cuenta la condición de excluir ambientes que tengan soft delete

adicionalmente verifica el resto del proyecto @/backend  por si se debe ajustar algo mas con el cambio en la entidad
```

## Prompt 54: Refactorización Arquitectural del Backend - BACKEND
**HUS Relacionadas:** HT-001, HT-002

```
Como arquitecto de software y desarrollador senior en NestJS, realiza una refactorización completa del backend siguiendo estos principios:

**Objetivos:**
1. Separación clara de dominios
2. Implementación de patrones de diseño
3. Optimización de rendimiento
4. Mejora de mantenibilidad

**Cambios Arquitecturales:**
1. Reorganización por dominios:
   - Identity (usuarios, roles, equipos)
   - Project Management (proyectos, componentes, desarrollos)
   - Infrastructure (ambientes, despliegues)
   - Activity (auditoría, actividades)

2. Implementación de patrones:
   - Repository Pattern
   - DTOs separados
   - Barrel exports
   - Soft delete donde corresponde
   - Índices optimizados

3. Mejoras técnicas:
   - Consolidación de enums
   - Optimización de consultas
   - Mejor manejo de relaciones
   - Documentación con Swagger

**Entidades a Refactorizar:**
- User (firstName/lastName)
- Role
- Team
- Development
- Project
- Component
- Database
- Environment
- DevelopmentComponent
- DevelopmentDatabase
- UpcomingDeployment
- DeploymentType
- RecentActivity

**Consideraciones:**
- Mantener compatibilidad con frontend
- No modificar endpoints existentes
- Implementar cambios gradualmente
- Documentar cambios realizados
```

## Prompt 55: Implementación de Mejoras en la Base de Datos - BACKEND
**HUS Relacionadas:** HT-001

```
Como experto en bases de datos y desarrollador backend senior, implementa las siguientes mejoras en la base de datos:

**Mejoras a Implementar:**
1. Soft Delete:
   - Agregar deletedAt en entidades críticas
   - Implementar lógica de exclusión
   - Ajustar queries para filtrar eliminados

2. Índices Optimizados:
   - Índices para soft delete (isActive, deletedAt)
   - Índices para relaciones frecuentes
   - Índices para campos de búsqueda

3. Relaciones Mejoradas:
   - Ajustar relaciones many-to-many
   - Optimizar joins
   - Implementar cascada donde corresponda

4. Enums Consolidados:
   - Mover todos los enums a /shared/enums
   - Tipar correctamente en entidades
   - Documentar valores permitidos

**Entidades a Optimizar:**
- Environment
- Project
- Component
- Database
- DevelopmentComponent
- DevelopmentDatabase

**Consideraciones:**
- Mantener datos existentes
- No afectar rendimiento
- Documentar cambios
- Actualizar seeds
```

## Prompt 64: Cambiar nombre de microservicios a proyectos - FRONTEND
**HUS Relacionadas:** HU-006, HU-007

```
Cambia el nombre de la vista de microservicios a proyectos y todo lo relacionado con esto
```

## Prompt 65: Continuar implementación de vista y paneles laterales para proyectos - FRONTEND
**HUS Relacionadas:** HU-006, HU-007

```
Como experto en Angular y UX/UI en la vista de proyectos del @/frontend  crea el crud correspondiente para los proyectos, teniendo en cuenta estos puntos:

- Un proyecto tiene varios componentes que tienen su crud por cada uno de los proyectos.
- El diseño debe ser consistente al de la aplicación para editar y crear, toma como guía el panel utilizado en la vista de ambientes.
- Conserva los estilos de la aplicación
- reutilizar variables de estilos de la aplicación
- garantizar el modo oscuro
- realiza filtros por tipo de proyecto, al estilo de desarrollos
- la cantidad de componentes de cada proyecto se muestra en el panel de detalles


como base para que desarrolles toda la vista de proyectos analiza los endpoints creados en el @/backend  y la arquitectura de la BD @Arquitectura-BD.md 

Si tienes alguna pregunta, hazla primero antes de hacer cualquier cambio.
```

## Prompt 66: Corrección de toggle y estilos en vista de proyectos - FRONTEND
**HUS Relacionadas:** HU-006, HU-007

```
El toggle en la vista de proyectos no funciona, analiza porque el update no está funcionando
```

## Prompt 67: Unificación de diseño entre vistas de ambientes y proyectos - FRONTEND
**HUS Relacionadas:** HU-006, HU-007, HU-020

```
Implementa el mismo diseño de la tabla y del panel y su formulario en proyectos. deben ser los mismos diseños, estilos de botones
```

## Prompt 68: Crear vistas de componentes y bases de datos - FULLSTACK
**HUS Relacionadas:** HU-025, HU-026

```
Como experto en Angular y UX/UI en la vista de proyectos del  crea el crud correspondiente para los proyectos, teniendo en cuenta estos puntos:

Teniendo en cuenta todo lo aplicado en la creacion de la vista de proyectos su modal y su panel, crea las vistas de componentes y bases de datos 

como base para que desarrolles toda la vista de proyectos analiza los endpoints creados en el @/backend  y la arquitectura de la BD @Arquitectura-BD.md
```

## Prompt 69: Análisis y estandarización de componentes Angular - FRONTEND

```
@/frontend  como experto en front Angular analiza el proyecto front para cargar contexto.

después analiza detalladamente el componen de proyectos.

identifica el diseño, estilos y estructura de la vista listar (tabla y cajon de búsqueda)
También analiza el panel de crear y editar, estilos (reutilizables) de botones, campos y funcionamiento del panel y su scroll

Después de analizarlo, ajusta las vistas componente y base de datos con esa misma estructura.

Si tienes alguna pregunta hazla antes de hacer cualquier cambio.
```

## Prompt 70: Implementación de panel de editar y crear desarrollos - FRONTEND
**HUS Relacionadas:** HU-014, HU-015

```
Como experto desarrollador frontend senior en Angular y experto en UX/UI, implementa el panel de editar y crear desarrollos para la vista de desarrollos en @/frontend siguiendo la misma estructura y diseño de los paneles de proyectos, ambientes, componentes y bases de datos.

**Contexto del Backend:**
Tengo los siguientes endpoints disponibles:
- POST /api/developments - Crear nuevo desarrollo
- PUT /api/developments/:id - Actualizar desarrollo existente
- GET /api/projects - Obtener lista de proyectos para selector
- GET /api/environments - Obtener lista de ambientes para selector
- GET /api/users - Obtener lista de usuarios para asignación
- GET /api/teams - Obtener lista de equipos

**Estructura del Formulario:**
El formulario debe incluir los siguientes campos basados en la entidad Development:

**Campos Principales:**
- **Título** (title): Input text requerido, máximo 200 caracteres
- **Descripción** (description): Textarea requerido, máximo 1000 caracteres
- **Estado** (status): Select con opciones del enum DevelopmentStatus
- **Prioridad** (priority): Select con opciones del enum DevelopmentPriority
- **Progreso** (progress): Slider de 0-100 con indicador visual
- **URL de Jira** (jiraUrl): Input URL opcional
- **Rama** (branch): Input text opcional

**Campos de Relación:**
- **Proyecto** (projectId): Select con lista de proyectos activos
- **Ambiente** (environmentId): Select con lista de ambientes activos
- **Usuario Asignado** (assignedUserId): Select con lista de usuarios activos
- **Equipo** (teamId): Select con lista de equipos activos

**Campos de Fecha:**
- **Fecha de Inicio** (startDate): Date picker
- **Fecha Estimada** (estimatedDate): Date picker
- **Fecha de Fin** (endDate): Date picker (solo en modo edición si está completado)

**Campos Adicionales:**
- **Notas** (notes): Textarea opcional, máximo 2000 caracteres
- **Estado Activo** (isActive): Toggle switch

**Especificaciones del Panel:**

**Comportamiento:**
- Panel deslizante desde la derecha (igual que otros paneles)
- Ancho: 50% en desktop, 60% en tablet, 100% en móvil
- Animación suave de entrada/salida con backdrop
- Scroll independiente del contenido principal
- Cierre con ESC, botón X, o clic en backdrop

**Header del Panel:**
- Breadcrumbs: Dashboard > Desarrollos > [Nuevo Desarrollo / Editar: {título}]
- Botón de cerrar (X) en esquina superior derecha
- Título dinámico: "Nuevo Desarrollo" o "Editar Desarrollo"

**Estructura del Formulario:**
- Formulario reactivo con validaciones
- Campos agrupados en secciones lógicas:
  1. **Información Básica**: título, descripción, estado, prioridad
  2. **Configuración**: proyecto, ambiente, usuario, equipo
  3. **Planificación**: fechas, progreso, rama
  4. **Detalles Adicionales**: URL Jira, notas, estado activo

**Validaciones Requeridas:**
- Título: requerido, mínimo 3 caracteres, máximo 200
- Descripción: requerida, mínimo 10 caracteres, máximo 1000
- Estado: requerido, valor del enum
- Prioridad: requerida, valor del enum
- Progreso: número entre 0-100
- URL Jira: formato URL válido si se proporciona
- Fechas: fecha de inicio <= fecha estimada <= fecha fin
- Proyecto: requerido, debe existir en la lista
- Usuario: requerido, debe existir en la lista
- Equipo: requerido, debe existir en la lista

**Funcionalidades Específicas:**
- **Modo Crear**: Formulario vacío con valores por defecto
- **Modo Editar**: Formulario pre-poblado con datos existentes
- **Estados de carga**: Skeleton/spinner durante carga de datos
- **Manejo de errores**: Mensajes específicos por campo y errores HTTP
- **Confirmación**: Modal de confirmación para cambios no guardados
- **Autoguardado**: Opcional - guardar borrador cada 30 segundos

**Integración con Backend:**
- Usar servicios HTTP existentes del proyecto
- Implementar manejo de errores con toasts/notificaciones
- Actualizar lista de desarrollos después de crear/editar
- Mantener estado de filtros y paginación después de operaciones

**Consideraciones de UX/UI:**
- **Diseño consistente** con otros paneles del proyecto
- **Campos dependientes**: ambiente filtrado por proyecto seleccionado
- **Indicadores visuales**: campos requeridos, estados de validación
- **Responsive**: adaptación a diferentes tamaños de pantalla
- **Accesibilidad**: labels, ARIA, navegación por teclado
- **Feedback visual**: estados hover, focus, disabled

**Consideraciones Técnicas:**
- Reutilizar componentes y estilos existentes del proyecto
- Implementar patrón unsubscribe para observables
- Usar ChangeDetectionStrategy.OnPush para rendimiento
- Tipado TypeScript estricto para DTOs y responses
- Lazy loading del panel para optimización
- Manejo de memoria y cleanup en ngOnDestroy

**Estados del Panel:**
- **Loading**: Cargando datos iniciales (usuarios, proyectos, etc.)
- **Ready**: Formulario listo para interacción
- **Submitting**: Enviando datos al backend
- **Success**: Operación completada exitosamente
- **Error**: Error en validación o comunicación

**Integración con Vista Principal:**
- Abrir panel desde botón "Nuevo Desarrollo" en header
- Abrir panel desde acción "Editar" en menú de tabla
- Cerrar panel y refrescar datos después de operaciones exitosas
- Mantener estado de la tabla (filtros, página, ordenamiento)

**Reutilización de Código:**
- Usar mismos patrones de otros paneles del proyecto
- Reutilizar servicios HTTP existentes
- Aplicar mismas variables CSS y clases de utilidad
- Mantener consistencia en animaciones y transiciones

Ten en cuenta buenas prácticas de desarrollo, seguridad y rendimiento. Mantén la consistencia visual y funcional con el resto de la aplicación.

Antes de implementar, analiza el proyecto existente y confirma el plan de implementación. Si tienes alguna consulta, hazla primero.
```

## Prompt 71: Error en el panel de crear o editar de la vista de desarrollos - FRONTEND

```
Analiza este error que se esta presentando al abrir el panel de crear o editar de la vista de desarrollos:
core.mjs:6547 ERROR Error: Cannot find control with name: 'projectId'
    at _throwError (forms.mjs:3513:9)
    at setUpControl (forms.mjs:3304:19)
    at _FormGroupDirective.addControl (forms.mjs:5513:5)
    at _FormControlName._setUpControl (forms.mjs:6195:39)
    at _FormControlName.ngOnChanges (forms.mjs:6151:28)
    at _FormControlName.rememberChangeHistoryAndInvokeOnChangesHook (core.mjs:3075:10)
    at callHookInternal (core.mjs:4140:10)
    at callHook (core.mjs:4167:5)
    at callHooks (core.mjs:4124:9)
    at executeInitAndCheckHooks (core.mjs:4079:5)

Determina porque pasa el error y explícame de forma corta.
No realices cambios hasta que no te confirme.
```

## Prompt 72: Corrección de error FormControl y mejora del panel de desarrollos - FRONTEND
**HUS Relacionadas:** HU-014, HU-015

```
Corrige el error "Cannot find control with name: 'projectId'" en el panel de crear/editar desarrollos y mejora la funcionalidad completa del formulario.

**Problema Identificado:**
El template HTML usa `formControlName="projectId"` pero el método `createForm()` no tiene definido este control en el FormGroup, causando el error al intentar hacer binding.

**Solución Implementada:**
1. **Corrección del FormGroup**: Agregar el control `projectId` faltante en el método `createForm()`
2. **Actualización del patchValue**: Incluir `projectId` en el método `initializeForm()` para modo edición
3. **Mejora de la arquitectura**: Cambiar de un desarrollo asociado directamente a un proyecto, a un desarrollo que puede afectar componentes de múltiples proyectos
4. **Eliminación del campo proyecto**: Remover `projectId` del formulario ya que un desarrollo puede afectar componentes de diferentes proyectos
5. **Implementación de selección dinámica**: Agregar secciones para seleccionar componentes afectados y bases de datos impactadas
6. **Nuevos endpoints transaccionales**: Crear endpoints que manejen desarrollo + componentes + bases de datos en una sola transacción

**Cambios en Backend:**
- Creación de DTOs unificados para operaciones transaccionales
- Implementación de métodos `createWithRelations()` y `updateWithRelations()`
- Nuevos endpoints: `POST /developments/with-relations` y `PATCH /developments/:id/with-relations`
- Limpieza de DTOs duplicados y corrección de importaciones

**Cambios en Frontend:**
- Eliminación del campo `projectId` del FormGroup y template
- Implementación de selección dinámica de componentes y bases de datos
- Nuevos servicios: ComponentService y DatabaseService
- UI moderna con estados vacíos, botones agregar/remover y gestión dinámica
- Integración con endpoints transaccionales del backend

**Error Adicional Corregido:**
- **Problema**: Error 400 Bad Request al actualizar desarrollo por envío de `componentId` y `databaseId` como strings vacíos
- **Solución**: Filtrar elementos con IDs válidos y convertir a números antes de enviar al backend
- **Cambios**: Inicializar con `null` en lugar de strings vacíos y validar antes del envío
```

## Prompt 76: Optimizaciones de rendimiento - FRONTEND
**HUS Relacionadas:** HT-005

```
Como desarrollador experto en Angular ejecuta las optimizaciones de rendimiento en el proyecto Angular frontend, implementando las siguientes mejoras de alto impacto:

**1. Consolidación de Material Imports:**
- Centralizar todos los módulos de Angular Material en MaterialModule
- Eliminar imports duplicados en componentes individuales
- Reducir bundle size y mejorar tree-shaking
- Archivos actualizados: shared/material.module.ts, components.component.ts, projects.component.ts, databases.component.ts, environments.component.ts

**2. Sistema de Cache en Development Form:**
- Implementar cache inteligente con timeout de 5 minutos para datos del formulario
- Reducir llamadas HTTP innecesarias al servidor
- Mejorar tiempo de apertura del panel de desarrollo
- Funcionalidades: validación de cache, fallback a servidor, método clearCache()

**3. Debounce en Filtros de Búsqueda:**
- Implementar debounce de 300ms en todos los filtros de búsqueda
- Agregar distinctUntilChanged() para evitar filtrados redundantes
- Mejorar rendimiento durante escritura rápida
- Aplicado en: Components, Projects, Databases, Environments

**Beneficios Esperados:**
- Bundle size: Reducción
- Tiempo de carga Mejorada
- Optimización Memoria
- UX: Panel de desarrollo con apertura instantánea usando cache
- Consistencia: Comportamiento uniforme en toda la aplicación
```

## Prompt 77: Implementación de tests unitarios híbridos en backend - BACKEND
**HUS Relacionadas:** HT-004

```
Como desarrollador backend senior en NestJS, implementa una estrategia de testing híbrida para los servicios principales del backend siguiendo estas especificaciones:

**Estrategia de Testing Híbrida:**

**Ambiente LOCAL → Tests de Integración (BD Real):**
- Conexión real a PostgreSQL de desarrollo cuando NODE_ENV=local o TEST_ENV=local
- Tests más lentos pero más realistas
- Detecta problemas de queries, relaciones, constraints de BD
- Ideal para desarrollo y debugging local

**Ambiente CI/CD → Tests Unitarios (Mocks):**
- Mocks para todos los repositorios cuando NODE_ENV=test, production, etc.
- Tests súper rápidos sin dependencias externas
- Ideal para pipelines de CI/CD y testing automatizado

**Configuración Dinámica:**
- Crear helper `test-config.helper.ts` para detectar ambiente
- Factory de módulos de test: `createIntegrationTestModule()` vs `createUnitTestModule()`
- Setup condicional en cada archivo de test según ambiente

**Servicios a testear:**
1. **ActivityService** - Sistema de auditoría y actividades
2. **ComponentService** - Gestión de componentes de software
3. **DatabaseService** - Gestión de bases de datos
4. **DevelopmentService** - Gestión de desarrollos principales

**Estructura de tests:**
- Usar Jest como framework de testing
- Implementar mocks completos para repositorios y dependencias (ambiente remoto)
- Configuración de BD real para ambiente local
- Cobertura mínima del 80% en servicios críticos
- Tests para casos exitosos y manejo de errores
- Validación de DTOs y transformaciones

**Casos de prueba por servicio:**
- **CRUD básico**: create, findAll, findOne, update, delete
- **Métodos específicos**: findByProject, findByType, findActive
- **Validaciones**: datos inválidos, entidades no encontradas
- **Relaciones**: métodos que involucran múltiples entidades
- **Soft delete**: restore, validación de isActive

**Configuración del entorno:**
- Variables de entorno para valores de test y configuración de BD
- Mocks centralizados para repositorios (ambiente remoto)
- Setup de BD de test para ambiente local
- Setup y teardown apropiados para ambos tipos
- Configuración de ESLint para archivos de test

**Buenas prácticas:**
- No quemar valores en los tests (usar variables de entorno)
- DTOs correctos según la estructura real
- Imports consistentes y limpios
- Nombres descriptivos para casos de prueba
- Agrupación lógica con describe/it
- Cleanup apropiado de BD en tests de integración
- Aislamiento entre tests para evitar interferencias

**Beneficios de la estrategia híbrida:**
- **Desarrollo local**: Tests realistas con BD que detectan problemas de SQL/TypeORM
- **CI/CD**: Tests rápidos sin dependencias que no bloquean el pipeline
- **Flexibilidad**: Capacidad de elegir qué tipo de test ejecutar según necesidad
- **Debugging**: Tests de integración facilitan identificación de problemas
- **Performance**: Tests unitarios rápidos para feedback inmediato
```

## Prompt 78: Corrección de errores en tests unitarios - BACKEND
**HUS Relacionadas:** HT-004

```
Corrige los errores identificados en los archivos de tests unitarios del backend:

**Problemas a resolver:**
1. **Conflictos de DTOs**: Diferencias entre rutas `dto/` y `dtos/`
2. **Enums incorrectos**: ComponentType.API no existe, usar MICROFRONTEND
3. **DatabaseType**: Usar POSTGRES en lugar de POSTGRESQL
4. **Imports faltantes**: Rutas incorrectas para enums compartidos
5. **Métodos no implementados**: findByEnvironment, findByAssignedUser, findByTeam
6. **Variables quemadas**: Reemplazar por variables de entorno

**Correcciones específicas:**
- **ComponentService**: Usar CreateComponentDto de `dtos/component.dto`
- **DatabaseService**: Corregir DatabaseType.POSTGRES y estructura de DTO
- **DevelopmentService**: Arreglar imports de enums y agregar métodos faltantes al mock
- **Variables de entorno**: TEST_COMPONENT_NAME, TEST_PROJECT_ID, etc.

**Configuración de linter:**
- Ajustar ESLint para ser más permisivo con archivos de test
- Permitir importaciones no utilizadas en archivos .spec.ts
- Configurar reglas específicas para entorno de testing
```

## Prompt 79: Análisis completo del estado de implementación del proyecto con documentación optimizada - FULLSTACK

```
Como desarrollador senior full-stack con experiencia en análisis de proyectos y documentación técnica, realiza un análisis exhaustivo del estado de implementación del proyecto DevTracker comparando el código real con las especificaciones del README.

**Objetivos del análisis:**
1. Evaluar el cumplimiento de especificaciones técnicas
2. Identificar gaps de implementación
3. Crear documentación visual optimizada del estado
4. Proporcionar métricas precisas de progreso

**Instrucciones específicas:**

**FASE 1: Análisis Comparativo**
Analiza el @/backend y el @/frontend e identifica:
- ✅ Elementos completamente implementados
- ⚠️ Elementos parcialmente implementados
- ❌ Elementos no implementados
- Compara con las especificaciones del @readme.md

**FASE 2: Categorización Técnica**
Organiza los hallazgos por categorías:
- 🏗️ Arquitectura Base (NestJS, Angular, PostgreSQL, TypeORM, etc.)
- 📦 Módulos Core (Identity, Project Management, Infrastructure, etc.)
- 🔐 Autenticación y Seguridad
- 📖 API REST y Documentación
- 🎨 Frontend UI/UX
- 📱 PWA y Optimizaciones
- 🗄️ Base de Datos y Migraciones
- 🧪 Testing y Calidad
- 🚀 DevOps y Deployment
- 📈 Funcionalidades Específicas

**FASE 3: Documentación Optimizada**
Crear documentación en formato de lista jerárquica legible que incluya:
- Separación clara por estados (Completo/Parcial/Faltante)
- Descripciones técnicas específicas
- Observaciones de implementación
- Resumen estadístico con porcentajes
- URLs del proyecto desplegado
- Conclusión general del estado

**FASE 4: Integración al README**
- Agregar la sección "8. Estado de Implementación del Proyecto" al final del README
- Usar formato de lista jerárquica (no tablas complejas)
- Mantener consistencia visual con el resto del documento
- Incluir emojis para categorización visual
- Asegurar legibilidad en diferentes dispositivos

**Criterios de evaluación:**
- Funcionalidad core vs especificada
- Calidad de implementación
- Completitud de características
- Integración entre componentes
- Documentación y testing
- Estado de deployment

**Formato de salida esperado:**
```
### ✅ IMPLEMENTADO COMPLETAMENTE (X%)
#### 🏗️ Arquitectura Base
- ✅ **Elemento** - Descripción específica

### ⚠️ IMPLEMENTADO PARCIALMENTE (X%)
#### 🔐 Categoría
- ⚠️ **Elemento** - Estado actual y faltante

### ❌ NO IMPLEMENTADO (X%)
#### 📊 Categoría
- ❌ **Elemento** - Descripción de lo faltante
```

**Consideraciones importantes:**
- No realizar cambios en el código, solo análisis
- Proporcionar métricas precisas y realistas
- Incluir observaciones técnicas específicas
- Mantener enfoque en funcionalidad vs especificación
- Documentar URLs del proyecto desplegado
- Crear conclusión general del estado del proyecto

El resultado debe ser una documentación completa, visualmente atractiva y técnicamente precisa del estado actual del proyecto DevTracker.
```
