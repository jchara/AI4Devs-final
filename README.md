# Proyecto Full-Stack con NestJS, Angular y PostgreSQL

Este proyecto implementa una arquitectura moderna full-stack utilizando las siguientes tecnologías:

## Tecnologías Principales

### Backend
- NestJS v11 con TypeORM
- PostgreSQL v16 (Docker)
- Arquitectura DDD (Domain-Driven Design)
- Tests unitarios y de integración

### Frontend
- Angular v19
- Angular Material
- Arquitectura por componentes
- Tests unitarios con Jasmine/Karma

## Estructura del Proyecto

```
.
├── backend/           # Aplicación NestJS
├── frontend/         # Aplicación Angular
└── docker/           # Configuración de Docker
```

## Requisitos Previos

- Node.js (v20 o superior)
- Docker y Docker Compose
- npm o yarn
- Git

## Configuración del Entorno

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

2. **Iniciar la base de datos**
```bash
docker-compose up -d
```

3. **Configurar el Backend**
```bash
cd backend
npm install
npm run start:dev
```

4. **Configurar el Frontend**
```bash
cd frontend
npm install
ng serve
```

## Desarrollo

- Backend: http://localhost:3000
- Frontend: http://localhost:4200
- PostgreSQL: localhost:5432
  - Base de datos: JCC-APP
  - Usuario: jcc-user
  - Contraseña: jcc-password

## Pruebas

### Backend
```bash
cd backend
npm run test        # Tests unitarios
npm run test:e2e    # Tests end-to-end
```

### Frontend
```bash
cd frontend
ng test            # Tests unitarios
ng e2e             # Tests end-to-end
```

## Arquitectura

Este proyecto sigue los principios de Domain-Driven Design (DDD):

### Backend (NestJS)
- `/src/domain` - Entidades y reglas de negocio
- `/src/application` - Casos de uso
- `/src/infrastructure` - Implementaciones técnicas
- `/src/interfaces` - Controllers y DTOs

### Frontend (Angular)
- `/src/app/core` - Servicios singleton, modelos universales
- `/src/app/shared` - Componentes compartidos
- `/src/app/features` - Módulos de características
- `/src/app/layouts` - Plantillas y layouts

## Contribución

1. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
2. Commit de tus cambios (`git commit -m 'feat: add amazing feature'`)
3. Push a la rama (`git push origin feature/amazing-feature`)
4. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 