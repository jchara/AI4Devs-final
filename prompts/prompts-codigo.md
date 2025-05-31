# Lista de Prompts
> Modelo de IA utilizado: Claude 3.7 Sonnet

## Prompt 1: Configuración Inicial del Proyecto - FULLSTACK

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

```
@docker-compose.yml 
revisa mi archivo de docker y crea el archivo de .env y pasa las variables a allí, adicionalmente crea el archivo de ejemplo .env.example.
```

> Modelo de IA utilizado: Claude Sonnet 4

## Prompt 3: Dashboard moderno para sistema de seguimiento de microservicios - FRONTEND

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

```
Respondiendo a tus preguntas antes de realizar la integración del Dashboard:
1. utilizar angular material pero adaptando los estilos a los de las imágenes.
2. para los gráficos utiliza ng2-charts ya que este es un wrapper de angular para Chart.js lo que nos ayuda a utilizar @Input(), @Output()
3. En el momento no necesito autenticación/guards para las rutas, solo las rutas sin autenticación/guards
4. inicialmente los datos serán mock, pero los puedes dejar en los servicios para cambiarlos a los endpoints reales en otra iteración.
5. Se van a implementar test unitarios y e2e.
6. El avatar de usuario por el momento es solo visual, se podrán agregar funciones más adelante ya que aún no existe sistema de sesión de usuarios.
```

