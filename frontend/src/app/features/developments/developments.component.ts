import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  takeUntil
} from 'rxjs/operators';

import { NotificationService } from '../../core/services/notification.service';
import { MaterialModule } from '../../shared/material.module';
import { BadgeUtilsService } from '../../shared/services/badge-utils.service';
import { DevelopmentDetailsPanelComponent } from './components/development-details-panel/development-details-panel.component';
import { DevelopmentFormPanelComponent } from './components/development-form-panel/development-form-panel.component';
import {
  ComponentType,
  Development,
  DevelopmentWithRelations,
  DevelopmentComponentRelation,
  Component as DevelopmentComponent,
  DevelopmentStatus,
  DevelopmentEnvironment,
} from '../../shared/models/development.model';
import { DevelopmentService } from './services/development.service';

interface StatusOption {
  value: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-developments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, DevelopmentDetailsPanelComponent, DevelopmentFormPanelComponent],
  templateUrl: './developments.component.html',
  styleUrl: './developments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Data
  developments: (Development | DevelopmentWithRelations)[] = [];
  dataSource = new MatTableDataSource<Development | DevelopmentWithRelations>([]);
  totalElements = 0;
  loading = false;

  // UI
  isMobile = false;
  isTablet = false;
  displayedColumns: string[] = [
    'id',
    'status',
    'title',
    'description',
    'components',
    'environment',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  displayedColumnsTablet: string[] = [
    'id',
    'status',
    'title',
    'components',
    'environment',
    'actions',
  ];

  // Filtros
  searchControl = new FormControl('');
  statusFilter = new FormControl('all');
  environmentFilter = new FormControl('');

  // Opciones para filtros
  availableStatuses: StatusOption[] = [
    { value: 'all', label: 'Todos', count: 0 },
    { value: DevelopmentStatus.PLANNING, label: DevelopmentStatus.PLANNING, count: 0 },
    { value: DevelopmentStatus.IN_PROGRESS, label: DevelopmentStatus.IN_PROGRESS, count: 0 },
    { value: DevelopmentStatus.TESTING, label: DevelopmentStatus.TESTING, count: 0 },
    { value: DevelopmentStatus.COMPLETED, label: DevelopmentStatus.COMPLETED, count: 0 },
    { value: DevelopmentStatus.CANCELLED, label: DevelopmentStatus.CANCELLED, count: 0 },
  ];

  availableEnvironments: DevelopmentEnvironment[] = [
    DevelopmentEnvironment.DEVELOPMENT,
    DevelopmentEnvironment.TESTING,
    DevelopmentEnvironment.STAGING,
    DevelopmentEnvironment.PRODUCTION,
  ];

  // Propiedades para el panel de detalles
  selectedDevelopment: Development | DevelopmentWithRelations | null = null;
  isPanelOpen = false;

  // Propiedades para el panel de formulario
  selectedDevelopmentForEdit: Development | null = null;
  isFormPanelOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private developmentService: DevelopmentService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private badgeUtils: BadgeUtilsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setupResponsiveLayout();
    this.setupFilters();
    this.loadDevelopments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TrackBy functions para optimizar renderizado
  trackByDevelopment(index: number, item: Development | DevelopmentWithRelations): string {
    return item.id.toString();
  }

  trackByComponent(index: number, component: any): number {
    if (component.componentId) {
      // Es DevelopmentComponentRelation
      return component.id || component.componentId || index;
    } else if (component.id) {
      // Es DevelopmentComponent o Component
      return component.id || index;
    }
    return index;
  }

  trackByStatus(index: number, item: StatusOption): string {
    return item.value;
  }

  trackByEnvironment(index: number, item: string): string {
    return item;
  }

  isDevelopmentWithRelations(dev: Development | DevelopmentWithRelations): dev is DevelopmentWithRelations {
    return 'databases' in dev;
  }

  // Método auxiliar para obtener componentes de manera segura
  getComponentsForDisplay(development: Development | DevelopmentWithRelations): any[] {
    if (this.isDevelopmentWithRelations(development)) {
      // Es DevelopmentWithRelations, tiene components como DevelopmentComponentRelation[]
      return development.components || [];
    } else {
      // Es Development, puede tener components como Component[] o developmentComponents como DevelopmentComponent[]
      return development.developmentComponents || development.components || [];
    }
  }

  // Métodos auxiliares para manejar componentes
  getComponentName(component: any): string {
    if (component.componentId && component.component) {
      // Es DevelopmentComponentRelation
      return component.component.name || '';
    } else if (component.component && component.component.name) {
      // Es DevelopmentComponent
      return component.component.name || '';
    } else if (component.name) {
      // Es Component directo
      return component.name || '';
    }
    return '';
  }

  getComponentType(component: any): ComponentType | undefined {
    if (component.componentId && component.component) {
      // Es DevelopmentComponentRelation
      return component.component.type;
    } else if (component.component && component.component.type) {
      // Es DevelopmentComponent
      return component.component.type;
    } else if (component.type) {
      // Es Component directo
      return component.type;
    }
    return undefined;
  }

  getComponentTechnology(component: any): string {
    if (component.componentId && component.component) {
      // Es DevelopmentComponentRelation
      return component.component.technology || '';
    } else if (component.component && component.component.technology) {
      // Es DevelopmentComponent
      return component.component.technology || '';
    } else if (component.technology) {
      // Es Component directo
      return component.technology || '';
    }
    return '';
  }

  // Método auxiliar para obtener el environment como string
  getEnvironmentString(development: Development | DevelopmentWithRelations): string {
    if (!development.environment) {
      return 'UNKNOWN';
    }
    
    // Si es un enum DevelopmentEnvironment, traducirlo a español
    if (typeof development.environment === 'string') {
      return this.translateEnvironmentToSpanish(development.environment);
    }
    
    // Si es un objeto, intentar obtener el name o type
    if (typeof development.environment === 'object') {
      const envObj = development.environment as any;
      return envObj.name || envObj.type || 'UNKNOWN';
    }
    
    return 'UNKNOWN';
  }

  // Método para traducir el enum a español para mostrar en la UI
  private translateEnvironmentToSpanish(environment: string): string {
    switch (environment) {
      case DevelopmentEnvironment.DEVELOPMENT:
        return 'DESARROLLO';
      case DevelopmentEnvironment.TESTING:
        return 'PRUEBAS';
      case DevelopmentEnvironment.STAGING:
        return 'PREPRODUCCIÓN';
      case DevelopmentEnvironment.PRODUCTION:
        return 'PRODUCCIÓN';
      default:
        return environment; // Fallback al valor original
    }
  }

  // Método auxiliar para obtener la clase CSS del environment
  getEnvironmentClass(development: Development | DevelopmentWithRelations): string {
    const envString = this.getEnvironmentString(development);
    return 'ambiente-' + envString.toLowerCase();
  }

  private setupResponsiveLayout(): void {
    // Observar múltiples breakpoints
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const breakpoints = this.breakpointObserver.isMatched(
          Breakpoints.Handset
        );
        const isTabletBreakpoint =
          this.breakpointObserver.isMatched(Breakpoints.Tablet) && !breakpoints;

        this.isMobile = breakpoints;
        this.isTablet = isTabletBreakpoint;

        // Trigger change detection manualmente con OnPush
        this.changeDetectorRef.markForCheck();
      });
  }

  private setupFilters(): void {
    // Combinar todos los filtros y aplicar debounce a la búsqueda
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.statusFilter.valueChanges.pipe(startWith('all')),
      this.environmentFilter.valueChanges.pipe(startWith('')),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
        this.changeDetectorRef.markForCheck();
      });
  }

  private loadDevelopments(): void {
    this.loading = true;
    this.changeDetectorRef.detectChanges();

    this.developmentService
      .getAllDevelopmentsWithRelations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (developments) => {
          this.developments = developments;
          this.dataSource.data = developments;
          this.totalElements = developments.length;
          this.updateStatusCounts();
          this.applyFilters();
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar desarrollos con relaciones:', error);
          // Fallback: cargar desarrollos normales si falla el endpoint con relaciones
          this.loadDevelopmentsFallback();
        },
      });
  }

  private loadDevelopmentsFallback(): void {
    this.developmentService
      .getDevelopments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (developments) => {
          this.developments = developments;
          this.dataSource.data = developments;
          this.totalElements = developments.length;
          this.updateStatusCounts();
          this.applyFilters();
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar desarrollos (fallback):', error);
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  private updateStatusCounts(): void {
    const statusCounts = this.developments.reduce((acc, dev) => {
      acc[dev.status] = (acc[dev.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.availableStatuses.forEach((status) => {
      if (status.value === 'all') {
        status.count = this.developments.length;
      } else {
        status.count = statusCounts[status.value] || 0;
      }
    });
  }

  private applyFilters(): void {
    if (!this.developments.length) {
      this.dataSource.data = [];
      this.totalElements = 0;
      return;
    }

    let filteredData = [...this.developments];

    // Filtro de búsqueda
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    if (searchTerm) {
      filteredData = filteredData.filter(
        (dev) =>
          dev.title.toLowerCase().includes(searchTerm) ||
          dev.description?.toLowerCase().includes(searchTerm) ||
          (this.isDevelopmentWithRelations(dev) && dev.components && dev.components.some((comp) =>
            (comp as DevelopmentComponentRelation).component?.name?.toLowerCase().includes(searchTerm)
          ))
      );
    }

    // Filtro de estado
    const statusValue = this.statusFilter.value;
    if (statusValue && statusValue !== 'all') {
      filteredData = filteredData.filter((dev) => dev.status === statusValue);
    }

    // Filtro de ambiente
    const environmentValue = this.environmentFilter.value;
    if (environmentValue) {
      filteredData = filteredData.filter(
        (dev) => dev.environment === environmentValue
      );
    }

    // CRÍTICO: Estrategia más robusta para actualizar la tabla
    // 1. Limpiar datos actuales
    this.dataSource.data = [];
    this.changeDetectorRef.detectChanges();
    
    // 2. Asignar nuevos datos con nueva referencia
    this.dataSource.data = [...filteredData];
    this.totalElements = filteredData.length;

    // 3. Forzar detección de cambios múltiple
    this.changeDetectorRef.detectChanges();
    
    // 4. Usar setTimeout para asegurar que Angular procese los cambios
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 0);

    // Reset paginator
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // Métodos de utilidad - usando servicio centralizado
  getStatusBadgeClass(status: DevelopmentStatus | string): string {
    return this.badgeUtils.getStatusBadgeClass(status);
  }

  formatDate(date: Date | undefined | null): string {
    return this.badgeUtils.formatDate(date);
  }

  truncateText(text: string, maxLength: number): string {
    return this.badgeUtils.truncateText(text, maxLength);
  }

  // Métodos de acción
  newDevelopment(): void {
    this.selectedDevelopmentForEdit = null;
    this.isFormPanelOpen = true;
    this.changeDetectorRef.markForCheck();
  }

  viewDetails(development: Development | DevelopmentWithRelations): void {
    this.selectedDevelopment = development;
    this.isPanelOpen = true;
    this.changeDetectorRef.markForCheck();
  }

  onClosePanel(): void {
    this.isPanelOpen = false;
    this.selectedDevelopment = null;
    this.changeDetectorRef.markForCheck();
  }

  onFormPanelClosed(result: boolean): void {
    this.isFormPanelOpen = false;
    this.selectedDevelopmentForEdit = null;
    
    if (result) {
      // Recargar desarrollos si se guardó exitosamente
      this.loadDevelopments();
    }
    
    this.changeDetectorRef.markForCheck();
  }

  onEditFromPanel(): void {
    if (this.selectedDevelopment) {
      this.editDevelopment(this.selectedDevelopment);
    }
  }

  onChangeStatusFromPanel(newStatus: DevelopmentStatus): void {
    if (this.selectedDevelopment) {
      this.changeStatus(this.selectedDevelopment, newStatus);
    }
  }

  editDevelopment(development: Development | DevelopmentWithRelations): void {
    this.selectedDevelopmentForEdit = development as Development;
    this.isFormPanelOpen = true;
    this.changeDetectorRef.markForCheck();
  }

  deleteDevelopment(development: Development | DevelopmentWithRelations): void {
    // Implementar lógica de eliminación
  }

  changeStatus(development: Development | DevelopmentWithRelations, newStatus: string): void {
    this.developmentService
      .changeStatus(development.id, newStatus as DevelopmentStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedDev) => {
          // Actualizar el desarrollo en el array principal
          // NOTA: El backend no devuelve el ID, usamos el ID del desarrollo original
          const index = this.developments.findIndex(
            (d) => d.id === development.id
          );
          if (index !== -1) {
                          // Mantener las relaciones si existen y agregar el ID faltante
              if (this.isDevelopmentWithRelations(this.developments[index])) {
                const devWithRelations = this.developments[index] as DevelopmentWithRelations;
                this.developments[index] = {
                  ...updatedDev,
                  id: development.id, // Agregar el ID que falta en la respuesta del backend
                  components: devWithRelations.components,
                  databases: devWithRelations.databases
                } as DevelopmentWithRelations;
              } else {
                this.developments[index] = {
                  ...updatedDev,
                  id: development.id // Agregar el ID que falta en la respuesta del backend
                } as Development;
              }
            
            // LOG: Verificar actualización del array
            console.log('📊 Array actualizado - ID:', development.id, 'Nuevo estado:', this.developments[index].status);
          }
          
          // Actualizar contadores de estado
          this.updateStatusCounts();
          
          // CRÍTICO: Crear nueva referencia del array completo para forzar detección de cambios
          this.developments = [...this.developments];
          
          // Si hay un desarrollo seleccionado en el panel, actualizarlo también
          if (this.selectedDevelopment && this.selectedDevelopment.id === development.id) {
                          if (this.isDevelopmentWithRelations(this.selectedDevelopment)) {
                const selectedWithRelations = this.selectedDevelopment as DevelopmentWithRelations;
                this.selectedDevelopment = {
                  ...updatedDev,
                  id: development.id, // Agregar el ID que falta
                  components: selectedWithRelations.components,
                  databases: selectedWithRelations.databases
                } as DevelopmentWithRelations;
              } else {
                this.selectedDevelopment = {
                  ...updatedDev,
                  id: development.id // Agregar el ID que falta
                } as Development;
              }
          }
          
          // CRÍTICO: Estrategia más robusta - Recrear completamente el dataSource
          const currentData = this.dataSource.data;
          this.dataSource.data = [];
          this.changeDetectorRef.detectChanges();
          
          // Aplicar filtros para refrescar la tabla con los datos actualizados
          this.applyFilters();
          
          // Forzar detección de cambios final
          this.changeDetectorRef.detectChanges();
          
          // LOG: Verificar actualización del dataSource
          console.log('📋 DataSource actualizado - Elemento ID:', development.id, 'Nuevo estado:', this.dataSource.data.find(d => d.id === development.id)?.status);
          
          this.notificationService.showSuccess('Estado actualizado correctamente');
        },
        error: (error) => {
          console.error('Error changing status:', error);
          this.notificationService.showError('Error al cambiar el estado');
        },
      });
  }

  getStatusesForChange(currentStatus: string): string[] {
    const allStatuses = [
      DevelopmentStatus.PLANNING,
      DevelopmentStatus.IN_PROGRESS,
      DevelopmentStatus.CANCELLED,
      DevelopmentStatus.COMPLETED,
      DevelopmentStatus.TESTING,
    ];
    return allStatuses.filter((status) => status !== currentStatus);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter.setValue('all');
    this.environmentFilter.setValue('');
    this.changeDetectorRef.markForCheck();
  }

  selectStatusFilter(statusValue: string): void {
    this.statusFilter.setValue(statusValue);
    this.changeDetectorRef.markForCheck();
  }

  onPageChange(): void {
    // La paginación se maneja automáticamente por MatTableDataSource
    this.changeDetectorRef.markForCheck();
  }

  getComponentTypeLabel(type: ComponentType | undefined): string {
    if (!type) return 'Sin tipo';
    
    switch (type) {
      case ComponentType.MICROSERVICE:
        return 'Microservicio';
      case ComponentType.MICROFRONTEND:
        return 'Microfrontend';
      case ComponentType.MONOLITH:
        return 'Monolito';
      default:
        return 'Desconocido';
    }
  }

  getComponentTypeClass(type: ComponentType | undefined): string {
    if (!type) return 'component-unknown';
    
    switch (type) {
      case ComponentType.MICROSERVICE:
        return 'component-microservice';
      case ComponentType.MICROFRONTEND:
        return 'component-microfrontend';
      case ComponentType.MONOLITH:
        return 'component-monolith';
      default:
        return 'component-unknown';
    }
  }
}
