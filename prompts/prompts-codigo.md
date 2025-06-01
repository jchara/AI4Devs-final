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

## Prompt 5: Ajustar sidebar para evitar superposición con header - FRONTEND

```
Necesito ajustar el sidebar ya que el header no deja ver bien el menú, el primer item de dashboard no se ve.
```

## Prompt 6: Eliminar línea azul del elemento activo del sidebar - FRONTEND

```
Cuando se selecciona un item del menú, cambia de color indicando que es el seleccionado, eso está bien, pero como ves en la imagen se muestra una línea azul dentro del item seleccionado, puedes quitar esa línea azul.
```

## Prompt 7: Vista de lista avanzada para gestionar desarrollos - FRONTEND

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

```
En @development.model.ts del front quite el estado Rechazado para desarrollos, verifica y actualiza la app para que no genere error
```

## Prompt 10: Ajustes de UX en vista de desarrollos - FRONTEND

```
En el componente @developments.component.html se debe ajustar lo siguiente:
- El filtro de ambiente dejarlo al lado del input de buscar desarrollo
- El mat-chip-listbox no muestra los colores correspondientes de los estados.
```

## Prompt 11: Unificar estilos con Dashboard - FRONTEND

```
En el componente @developments.component.html el numero de desarrollos debe tener el mismo estilo que tiene la card con totales en el Dashboard
```

## Prompt 12: Arreglar modo oscuro en tabla de desarrollos - FRONTEND

```
La tabla de @developments.component.html se ve blanca en modo oscuro y el desplegable de acciones también, no debe ser asi, como desarrollador senior en angular analiza y realiza el ajuste correspondiente.
```

## Prompt 13: Centralización y optimización de estilos CSS - FRONTEND

```
@frontend como desarrollador senior en angular y experto en ux/ui y css, analiza el proyecto frontend y verifica si se pueden centralizar los estilos y evitar redundancias o duplicidad.

Ten cuenta buenas prácticas tanto de diseño como de seguridad.
Indícame el proceso que vas a realizar, no realices código aún espera a que confirme que lo hagas. Si tienes alguna consulta, hazla primero
```

## Prompt 14: Resolución de problemas de presupuesto CSS y optimización - FRONTEND

```
Error de despliegue en Railway: el archivo developments.component.scss excede el límite de 8kB (tenía 10.81kB). Optimizar el CSS aplicando técnicas de reducción como eliminación de redundancias, simplificación de selectores y consolidación de reglas para cumplir con el budget de Angular.
```

## Prompt 15: Refactorización del modelo de datos - FRONTEND

```
Actualizar el modelo de datos eliminando campos innecesarios:
- Remover campo `author` de la interfaz Development y datos mock
- Remover campo `icon` de la interfaz Microservice y datos relacionados
- Actualizar lógica de filtrado y métodos dependientes en development.service.ts
```

## Prompt 16: Mejoras en diseño de microservicios y fechas - FRONTEND

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

```
Eres un experto desarrollador front senior en angular, @frontend analiza este proyecto y verifica que el lazy load esta bien implementado, que la precarga esté activada y que el use memory de material angular este bien gestionado, ya que al navegar en el sidebar la primer vez se siente lento.
```

## Prompt 20: Implementación de optimizaciones avanzadas de rendimiento - FRONTEND

```
Implementa estas optimizaciones, sin perder la fluidez de las transiciones cuando se navega entre vistas:

- Implementar @angular/pwa con cache inteligente
- Añadir ChangeDetectorRef para manejo manual de detección de cambios
- Implementar patrón unsubscribe en los componentes
- Material Modules Centralizados para reducir los imports
- Cache para API endpoints y assets estáticos
```

## Prompt 21: Ajustar header y sidebar fijos con funcionalidad de toggle - FRONTEND

```
Respuestas a las preguntas:
1. Fixed, siempre visible incluso al hacer scroll
2. El sidebar debe poder ocultarse en escritorio y en móviles se debe ocultar pero poder mostrarse con el botón hamburguesa cuando se necesite para navegar
3. Mantener la altura del header de 64px
```
