# DevTracker Frontend

Aplicación web para el sistema de seguimiento de desarrollos DevTracker, construida con **Angular 19**, **Material Design** y **arquitectura modular**.

## 🏗️ Arquitectura

Este frontend implementa una **arquitectura modular** con **componentes standalone** para máxima escalabilidad y mantenibilidad.

### 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios singleton
│   ├── shared/               # Módulos y componentes reutilizables
│   │   └── material.module.ts # Módulo centralizado de Angular Material
│   ├── features/             # Módulos funcionales
│   │   ├── dashboard/
│   │   ├── developments/
│   │   └── microservicios/
│   └── layout/               # Componentes de layout
└── styles/                   # Estilos globales y design system
```

## 🚀 Características

- **Angular 19** con arquitectura standalone components
- **OnPush Change Detection** en todos los componentes
- **PWA Ready** con Service Worker optimizado
- **Material Design** con tema claro/oscuro
- **Responsive Design** mobile-first
- **Optimizaciones de Rendimiento** avanzadas

## 📋 Requisitos Previos

- Node.js 20.10.0
- npm 10.2.0
- Angular CLI 19.2.1

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

## 🚀 Ejecución

### Desarrollo
```bash
ng serve
```
Navega a `http://localhost:4200/`. La aplicación se recarga automáticamente.

### Producción
```bash
ng build --configuration production
npm run start:prod
```

## 🔧 Scripts Disponibles

- `ng serve` - Iniciar servidor de desarrollo
- `ng build` - Compilar aplicación
- `ng test` - Ejecutar tests unitarios
- `ng e2e` - Ejecutar tests end-to-end
- `ng lint` - Ejecutar linter
- `npm run start:prod` - Iniciar en modo producción

## 🎨 Theming

### Modo claro/oscuro
El sistema soporta cambio dinámico de tema mediante:
- CSS Variables personalizadas
- Theme Service para persistencia
- Optimizaciones específicas para modo oscuro

### Colores principales
```scss
--color-primary: #7D2BE3;    // Primario
--color-accent: #66C6EA;     // Acento
--bg-primary: #FFFFFF;       // Fondo (claro)
--text-primary: #000000;     // Texto (claro)
```

## 🔧 Configuración PWA

### Service Worker
- **Cache Strategy**: Performance + Freshness
- **API Caching**: Configurado para endpoints críticos
- **Offline Support**: Funcionalidad básica offline

### Instalación PWA
La aplicación es instalable como PWA desde el navegador.

## 🚨 Reglas de Desarrollo

### Obligatorias para cada componente:
1. `ChangeDetectionStrategy.OnPush`
2. `takeUntil(destroy$)` en subscripciones
3. TrackBy en todos los `*ngFor`
4. Máximo 5 imports por componente
5. MaterialModule en lugar de imports individuales

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Formato de Commits
```bash
feat(component): add new dashboard widget
fix(service): resolve data loading issue
docs(readme): update documentation
refactor(module): simplify component logic
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte y preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación técnica

---

**DevTracker Frontend** - Sistema empresarial de seguimiento de desarrollos

*Construido con ❤️ usando Angular 19, Material Design y principios de arquitectura modular*
