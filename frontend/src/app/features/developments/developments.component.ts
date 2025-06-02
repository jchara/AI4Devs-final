import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, combineLatest } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';

import { MaterialModule } from '../../shared/material.module';
import { BadgeUtilsService } from '../../shared/services/badge-utils.service';
import { NotificationService } from '../../core/services/notification.service';
import { DevelopmentService } from './services/development.service';
import {
  Development,
  DevelopmentStatus,
  Environment,
  Microservice,
} from './models/development.model';

interface StatusOption {
  value: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-developments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './developments.component.html',
  styleUrl: './developments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  displayedColumns: string[] = [
    'status',
    'title',
    'description',
    'microservices',
    'environment',
    'createdDate',
    'updatedDate',
    'actions',
  ];
  displayedColumnsTablet: string[] = [
    'status',
    'title',
    'microservices',
    'environment',
    'updatedDate',
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
    { value: DevelopmentStatus.DEVELOPMENT, label: DevelopmentStatus.DEVELOPMENT, count: 0 },
    { value: DevelopmentStatus.TESTING, label: DevelopmentStatus.TESTING, count: 0 },
    { value: DevelopmentStatus.COMPLETED, label: DevelopmentStatus.COMPLETED, count: 0 },
    { value: DevelopmentStatus.ARCHIVED, label: DevelopmentStatus.ARCHIVED, count: 0 },
  ];

  availableEnvironments: string[] = [
    Environment.DEVELOPMENT,
    Environment.TESTING,
    Environment.STAGING,
    Environment.PRODUCTION,
  ];

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
  trackByDevelopment(index: number, item: Development): string {
    return item.id;
  }

  trackByMicroservice(index: number, item: Microservice): string {
    return item.id;
  }

  trackByStatus(index: number, item: StatusOption): string {
    return item.value;
  }

  trackByEnvironment(index: number, item: string): string {
    return item;
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
    this.changeDetectorRef.markForCheck();

    this.developmentService
      .getDevelopments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (developments) => {
          this.developments = developments;
          this.updateStatusCounts();
          this.applyFilters();
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error('Error loading developments:', error);
          this.notificationService.showError('Error al cargar los desarrollos');
          this.loading = false;
          this.changeDetectorRef.markForCheck();
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
          dev.microservices.some((ms) =>
            ms.name.toLowerCase().includes(searchTerm)
          )
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

    this.dataSource.data = filteredData;
    this.totalElements = filteredData.length;

    // Reset paginator
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // Métodos de utilidad - usando servicio centralizado
  getStatusBadgeClass(status: DevelopmentStatus | string): string {
    return this.badgeUtils.getStatusBadgeClass(status);
  }

  formatDate(date: Date): string {
    return this.badgeUtils.formatDate(date);
  }

  truncateText(text: string, maxLength: number): string {
    return this.badgeUtils.truncateText(text, maxLength);
  }

  // Métodos de acción
  newDevelopment(): void {
    // TODO: Implementar modal de creación
    this.notificationService.showInfo('Funcionalidad en desarrollo');
  }

  viewDetails(development: Development): void {
    // TODO: Implementar modal de detalles
    this.notificationService.showSuccess(`Ver detalles de: ${development.title}`);
  }

  editDevelopment(development: Development): void {
    // TODO: Implementar modal de edición
    this.notificationService.showInfo(`Editar: ${development.title}`);
  }

  deleteDevelopment(development: Development): void {
    // TODO: Implementar confirmación de eliminación
    this.notificationService.showWarning(`Eliminar: ${development.title}`);
  }

  changeStatus(development: Development, newStatus: string): void {
    this.developmentService
      .changeStatus(development.id, newStatus as DevelopmentStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedDev) => {
          const index = this.developments.findIndex(
            (d) => d.id === updatedDev.id
          );
          if (index !== -1) {
            this.developments[index] = updatedDev;
            this.updateStatusCounts();
            this.applyFilters();
          }
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error('Error changing status:', error);
          this.notificationService.showError('Error al cambiar el estado');
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  getStatusesForChange(currentStatus: string): string[] {
    const allStatuses = [
      DevelopmentStatus.PLANNING,
      DevelopmentStatus.DEVELOPMENT,
      DevelopmentStatus.ARCHIVED,
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
}
