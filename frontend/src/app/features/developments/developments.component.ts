import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { DevelopmentService } from './services/development.service';
import { Development, DevelopmentStatus, Environment } from './models/development.model';

interface StatusOption {
  value: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-developments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './developments.component.html',
  styleUrl: './developments.component.scss'
})
export class DevelopmentsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Data
  developments: Development[] = [];
  dataSource = new MatTableDataSource<Development>([]);
  totalElements = 0;
  loading = false;

  // UI
  isMobile = false;
  isTablet = false;
  displayedColumns: string[] = ['status', 'name', 'description', 'microservices', 'environment', 'createdDate', 'updatedDate', 'actions'];
  displayedColumnsTablet: string[] = ['status', 'name', 'microservices', 'environment', 'updatedDate', 'actions'];

  // Filtros
  searchControl = new FormControl('');
  statusFilter = new FormControl('all');
  environmentFilter = new FormControl('');

  // Opciones para filtros
  availableStatuses: StatusOption[] = [
    { value: 'all', label: 'Todos', count: 0 },
    { value: 'En Desarrollo', label: 'En Desarrollo', count: 0 },
    { value: 'Archivado', label: 'Archivado', count: 0 },
    { value: 'Completado', label: 'Completado', count: 0 }
  ];

  availableEnvironments: string[] = [
    Environment.DEVELOPMENT,
    Environment.TESTING,
    Environment.STAGING,
    Environment.PRODUCTION
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private developmentService: DevelopmentService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
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

  private setupResponsiveLayout(): void {
    // Observar múltiples breakpoints
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        const breakpoints = this.breakpointObserver.isMatched(Breakpoints.Handset);
        const isTabletBreakpoint = this.breakpointObserver.isMatched(Breakpoints.Tablet) && !breakpoints;
        
        this.isMobile = breakpoints;
        this.isTablet = isTabletBreakpoint;
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
      this.environmentFilter.valueChanges.pipe(startWith(''))
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.applyFilters();
    });
  }

  private loadDevelopments(): void {
    this.loading = true;
    
    this.developmentService.getDevelopments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (developments) => {
          this.developments = developments;
          this.updateStatusCounts();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading developments:', error);
          this.showErrorMessage('Error al cargar los desarrollos');
          this.loading = false;
        }
      });
  }

  private updateStatusCounts(): void {
    const statusCounts = this.developments.reduce((acc, dev) => {
      acc[dev.status] = (acc[dev.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.availableStatuses.forEach(status => {
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
      filteredData = filteredData.filter(dev =>
        dev.name.toLowerCase().includes(searchTerm) ||
        dev.description?.toLowerCase().includes(searchTerm) ||
        dev.microservices.some(ms => ms.name.toLowerCase().includes(searchTerm))
      );
    }

    // Filtro de estado
    const statusValue = this.statusFilter.value;
    if (statusValue && statusValue !== 'all') {
      filteredData = filteredData.filter(dev => dev.status === statusValue);
    }

    // Filtro de ambiente
    const environmentValue = this.environmentFilter.value;
    if (environmentValue) {
      filteredData = filteredData.filter(dev => dev.environment === environmentValue);
    }

    this.dataSource.data = filteredData;
    this.totalElements = filteredData.length;

    // Reset paginator
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // Métodos de utilidad
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'En Desarrollo':
        return 'badge-desarrollo';
      case 'Archivado':
        return 'badge-archivado';
      case 'Completado':
        return 'badge-completado';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Métodos de acción
  newDevelopment(): void {
    // TODO: Implementar modal de creación
    this.showSuccessMessage('Funcionalidad en desarrollo');
  }

  viewDetails(development: Development): void {
    // TODO: Implementar modal de detalles
    this.showSuccessMessage(`Ver detalles de: ${development.name}`);
  }

  editDevelopment(development: Development): void {
    // TODO: Implementar modal de edición
    this.showSuccessMessage(`Editar: ${development.name}`);
  }

  deleteDevelopment(development: Development): void {
    // TODO: Implementar confirmación de eliminación
    this.showSuccessMessage(`Eliminar: ${development.name}`);
  }

  changeStatus(development: Development, newStatus: string): void {
    this.developmentService.changeStatus(development.id, newStatus as DevelopmentStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedDev) => {
          const index = this.developments.findIndex(d => d.id === updatedDev.id);
          if (index !== -1) {
            this.developments[index] = updatedDev;
            this.updateStatusCounts();
            this.applyFilters();
          }
          this.showSuccessMessage(`Estado cambiado a: ${newStatus}`);
        },
        error: (error) => {
          console.error('Error changing status:', error);
          this.showErrorMessage('Error al cambiar el estado');
        }
      });
  }

  getStatusesForChange(currentStatus: string): string[] {
    const allStatuses = [
      DevelopmentStatus.DEVELOPMENT,
      DevelopmentStatus.ARCHIVED,
      DevelopmentStatus.COMPLETED
    ];
    return allStatuses.filter(status => status !== currentStatus);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter.setValue('all');
    this.environmentFilter.setValue('');
  }

  selectStatusFilter(statusValue: string): void {
    this.statusFilter.setValue(statusValue);
  }

  onPageChange(): void {
    // La paginación se maneja automáticamente por MatTableDataSource
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
