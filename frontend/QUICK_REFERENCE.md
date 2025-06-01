# ⚡ Referencia Rápida - Optimizaciones Angular

## 🚨 Reglas Obligatorias

### 1. Cada Componente DEBE tener:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. Cada *ngFor DEBE tener trackBy:
```html
<div *ngFor="let item of items; trackBy: trackByItem">
```

### 3. Imports máximo 5 módulos:
```typescript
imports: [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,  // NO imports individuales
  RouterModule,
  CustomModule
]
```

---

## 🎯 Templates de Código

### TrackBy Functions
```typescript
trackByEntity(index: number, item: { id: string }): string {
  return item.id;
}

trackByIndex(index: number): number {
  return index;
}

trackByValue(index: number, item: string): string {
  return item;
}
```

### Subscription Pattern
```typescript
this.service.getData()
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
    this.data = data;
    this.cdr.markForCheck(); // Con OnPush
  });
```

### Material Module Setup
```typescript
// shared/material.module.ts
@NgModule({
  exports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    // ... todos los módulos
  ]
})
export class MaterialModule { }
```

---

## 🎨 CSS Classes

### Layout Optimizado
```html
<div class="main-layout route-transition">
  <header class="gpu-accelerated"></header>
  <aside class="gpu-accelerated"></aside>
  <main class="main-content route-transition">
    <div class="content-wrapper lazy-content">
      <router-outlet></router-outlet>
    </div>
  </main>
</div>
```

### Variables CSS
```scss
:root {
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📦 Configuraciones

### App Config
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};
```

### Routes
```typescript
{
  path: 'feature',
  loadComponent: () => import('./feature.component').then(m => m.FeatureComponent)
}
```

---

## ❌ Prohibido

- ❌ `delay()` en servicios
- ❌ Más de 5 imports en componentes
- ❌ *ngFor sin trackBy
- ❌ Subscripciones sin takeUntil
- ❌ Componentes sin OnPush
- ❌ Transiciones sin cubic-bezier

---

## ✅ Checklist Nuevo Componente

- [ ] OnPush strategy
- [ ] destroy$ Subject
- [ ] ChangeDetectorRef inyectado
- [ ] ngOnDestroy implementado
- [ ] TrackBy en *ngFor
- [ ] takeUntil en subscripciones
- [ ] MaterialModule import
- [ ] CSS classes optimizadas

---

## 📊 Targets

| Métrica | Target |
|---------|---------|
| Initial Bundle | < 500KB |
| Lazy Component | < 1MB |
| FCP | < 1.5s |
| LCP | < 2.5s |
| TTI | < 3.5s | 