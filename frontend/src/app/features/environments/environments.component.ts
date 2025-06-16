import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { EnvironmentService } from '../../core/services/environment.service';
import { Environment } from '../../shared/models/environment.model';
import { DeleteDialogComponent, DeleteDialogData } from '../../shared/components/delete-dialog';
import { EnvironmentSlidePanelComponent } from './components/environment-slide-panel/environment-slide-panel.component';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-environments',
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
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatSlideToggleModule,
    EnvironmentSlidePanelComponent
  ],
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvironmentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  environments: Environment[] = [];
  filteredEnvironments: Environment[] = [];
  loading = false;
  
  displayedColumns: string[] = ['color', 'name', 'description', 'order', 'isActive', 'actions'];
  displayedColumnsMobile: string[] = ['color', 'name', 'actions'];
  
  // Panel lateral
  isPanelOpen = false;
  selectedEnvironment: Environment | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Environment>;
  
  searchForm = new FormGroup({
    searchTerm: new FormControl('')
  });
  
  constructor(
    private environmentService: EnvironmentService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { 
    // Cerrar diálogos cuando hay navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Cerrar todos los diálogos abiertos
      this.dialog.closeAll();
    });
  }
  
  ngOnInit(): void {
    // Carga inicial diferida para mejorar el tiempo de carga
    setTimeout(() => {
      this.loadEnvironments();
    });

    // Suscripción reactiva a la lista de ambientes
    this.environmentService.environments$
      .pipe(takeUntil(this.destroy$))
      .subscribe(environments => {
        this.environments = environments;
        this.filterEnvironments(this.searchForm.get('searchTerm')?.value || '');
        this.cdr.markForCheck();
      });

    this.environmentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });

    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.filterEnvironments(value || '');
        this.cdr.markForCheck();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadEnvironments(): void {
    if (this.loading) return;
    this.environmentService.getEnvironments().pipe(takeUntil(this.destroy$)).subscribe();
  }
  
  filterEnvironments(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase().trim();
    
    if (!searchTerm) {
      this.filteredEnvironments = this.environments;
    } else {
      this.filteredEnvironments = this.environments.filter(env => 
        env.name.toLowerCase().includes(searchTerm) || 
        env.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (this.table) {
      this.table.renderRows();
    }
    
    this.cdr.markForCheck();
  }
  
  openCreatePanel(): void {
    this.selectedEnvironment = null;
    this.isPanelOpen = true;
    this.cdr.markForCheck();
  }
  
  openEditPanel(environment: Environment): void {
    this.selectedEnvironment = environment;
    this.isPanelOpen = true;
    this.cdr.markForCheck();
  }
  
  onPanelClosed(result: boolean): void {
    this.isPanelOpen = false;
    this.selectedEnvironment = null;
    
    if (result) {
      this.loadEnvironments();
    }
    
    this.cdr.markForCheck();
  }
  
  openDeleteDialog(environment: Environment): void {
    const dialogData: DeleteDialogData = {
      title: 'Eliminar ambiente',
      entityName: environment.name,
      entityType: 'el ambiente',
      breadcrumbs: ['Dashboard', 'Ambientes', environment.name],
      warningMessage: 'Esta acción no se puede deshacer. Los desarrollos asociados a este ambiente quedarán sin referencia.',
      additionalInfo: [
        {
          icon: 'palette',
          label: 'Color',
          value: environment.color
        },
        {
          icon: 'sort',
          label: 'Orden',
          value: environment.order.toString()
        }
      ],
      onConfirm: () => {
        this.environmentService.deleteEnvironment(environment.id).subscribe({
          next: () => {
            // Ambiente eliminado exitosamente
          },
          error: (error) => {
            console.error('Error al eliminar ambiente:', error);
          }
        });
      },
      loading$: this.environmentService.loading$ as any
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '480px',
      height: 'auto',
      maxWidth: '95vw',
      panelClass: ['custom-dialog-container', 'environment-delete-dialog'],
      autoFocus: false,
      hasBackdrop: true,
      data: dialogData
    });
    
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadEnvironments();
        }
      });
  }
  
  toggleActive(environment: Environment): void {
    this.environmentService.updateAndRefresh(environment.id, { isActive: !environment.isActive })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  
  increaseOrder(environment: Environment): void {
    const currentOrder = environment.order;
    const targetOrder = currentOrder - 1;
    if (targetOrder < 1) return;
    const adjacent = this.environments.find(env => env.order === targetOrder);
    if (!adjacent) return;
    forkJoin([
      this.environmentService.updateOrder(environment.id, targetOrder),
      this.environmentService.updateOrder(adjacent.id, currentOrder)
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadEnvironments(); // Refresca la tabla y reordena
      },
      error: () => this.cdr.markForCheck()
    });
  }
  
  decreaseOrder(environment: Environment): void {
    const currentOrder = environment.order;
    const targetOrder = currentOrder + 1;
    const adjacent = this.environments.find(env => env.order === targetOrder);
    if (!adjacent) return;
    forkJoin([
      this.environmentService.updateOrder(environment.id, targetOrder),
      this.environmentService.updateOrder(adjacent.id, currentOrder)
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadEnvironments(); // Refresca la tabla y reordena
      },
      error: () => this.cdr.markForCheck()
    });
  }
  
  getColorStyle(color: string): object {
    return {
      'background-color': color || '#007bff'
    };
  }
  
  getActiveStatusText(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }
} 