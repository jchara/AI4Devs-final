# DevTracker Frontend - Angular 19

> Sistema de seguimiento de desarrollos de microservicios con optimizaciones avanzadas de rendimiento

## 🚀 Características

- **Angular 19** con arquitectura standalone components
- **OnPush Change Detection** en todos los componentes
- **PWA Ready** con Service Worker optimizado
- **Bundle Size Optimizado**: Initial < 500KB, Lazy < 1MB
- **Material Design** con tema claro/oscuro
- **Responsive Design** mobile-first
- **Optimizaciones de Rendimiento** avanzadas

## 📊 Métricas de Rendimiento

| Métrica | Target | Actual |
|---------|---------|---------|
| First Contentful Paint | < 1.5s | ~0.5s |
| Time to Interactive | < 3.5s | ~0.7s |
| Initial Bundle | < 500KB | 380KB |
| Development Component | < 1MB | 459KB |

## 📚 Documentación

- **[📋 Guía Completa de Optimización](./PERFORMANCE_GUIDE.md)** - Documentación técnica detallada
- **[⚡ Referencia Rápida](./QUICK_REFERENCE.md)** - Guía de consulta rápida para desarrollo

## 🛠️ Comandos de Desarrollo

### Servidor de desarrollo
```bash
ng serve
```
Navega a `http://localhost:4200/`. La aplicación se recarga automáticamente.

### Build de producción optimizado
```bash
ng build --configuration production
```
Genera build optimizado en `dist/` con todas las optimizaciones aplicadas.

### Análisis de bundle
```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json
```

### Tests
```bash
ng test        # Unit tests
ng e2e         # End-to-end tests
```

## 🎯 Generación de Código

### Nuevo componente (con optimizaciones)
```bash
ng generate component feature/component-name --standalone
```

**⚠️ IMPORTANTE**: Todo componente nuevo debe implementar las [optimizaciones obligatorias](./QUICK_REFERENCE.md#checklist-nuevo-componente).

## 🏗️ Arquitectura

### Estructura del proyecto
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

### Patrones implementados

- **OnPush Strategy**: Todos los componentes usan `ChangeDetectionStrategy.OnPush`
- **TrackBy Functions**: Todas las listas implementan trackBy para optimización
- **Unsubscribe Pattern**: `takeUntil(destroy$)` en todas las subscripciones
- **Material Module**: Imports centralizados para evitar duplicación
- **Lazy Loading**: Componentes cargados bajo demanda con preloading

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

## 📈 Optimizaciones Implementadas

### Bundle Optimization
- ✅ PreloadAllModules strategy
- ✅ Material Module centralizado
- ✅ Eliminación de delays artificiales
- ✅ Tree-shaking optimizado

### Runtime Performance
- ✅ OnPush Change Detection
- ✅ TrackBy functions
- ✅ GPU acceleration CSS
- ✅ Content visibility optimizations

### Memory Management
- ✅ Automatic unsubscribe pattern
- ✅ Component lifecycle optimization
- ✅ Observable cleanup

## 🚨 Reglas de Desarrollo

### Obligatorias para cada componente:
1. `ChangeDetectionStrategy.OnPush`
2. `takeUntil(destroy$)` en subscripciones
3. TrackBy en todos los `*ngFor`
4. Máximo 5 imports por componente
5. MaterialModule en lugar de imports individuales

Ver [Referencia Rápida](./QUICK_REFERENCE.md) para detalles completos.

## 🔗 Enlaces Útiles

- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Angular Performance Guide](https://angular.io/guide/performance)
- [Material Design Components](https://material.angular.io/)
- [PWA Configuration](https://angular.io/guide/service-worker-config)

---

**Versión**: 1.0.0  
**Angular**: 19.2.1  
**Node**: 20+
