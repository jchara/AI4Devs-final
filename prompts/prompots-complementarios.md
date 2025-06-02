> Modelo de IA utilizado: Claude 3.7 Sonnet


## Prompt 1:  Generar el Docker Compose - BACKEND

```
Como experto en Docker y bases de datos, crea un archivo docker-compose.yml para levantar un servicio de PostgreSQL versión 16 con las siguientes características:

- El contenedor debe llamarse jcc-postgres.

- Debe reiniciarse automáticamente salvo que se detenga manualmente (restart: unless-stopped).

- Debe usar variables de entorno POSTGRES_DB, POSTGRES_USER y POSTGRES_PASSWORD obtenidas desde un archivo .env.

- El puerto 5432 del contenedor debe mapearse al valor ${POSTGRES_PORT} definido en el .env.

- Debe usar un volumen persistente llamado postgres_data montado en /var/lib/postgresql/data.

- El contenedor debe estar en una red personalizada llamada jcc-network con driver bridge.

- Incluye en el archivo la definición de dicha red y el volumen.
```

> Modelo de IA utilizado: Claude Sonnet 4

## Prompt 2: Diseño de favicon - FRONTEND

```
Crea un favicon SVG de 32x32px para una aplicación llamada "DevTracker" que sirve para rastrear el estado de desarrollos de microservicios a través de diferentes ambientes (desarrollo, QA, producción). 

El diseño debe incluir:
- Fondo con gradiente oscuro (de #1f2937 a #111827) con bordes redondeados
- El texto "{DT}" centrado como elemento principal, donde:
  - Los brackets "{" y "}" en color azul (#60a5fa) y tamaño 10px
  - Las letras "DT" en gris (#9ca3af) y tamaño 6px
  - Todo usando fuente monospace y centrado perfectamente
- Tres pequeños círculos decorativos en las esquinas:
  - Verde (#34d399) en la esquina superior derecha
  - Amarillo (#fbbf24) en el lado derecho superior
  - Rojo (#f87171) en la esquina inferior derecha
- Estilo minimalista y profesional con temática de desarrollo/código
```