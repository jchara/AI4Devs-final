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
import { Subject, takeUntil } from 'rxjs';
import { EnvironmentService } from '../../core/services/environment.service';
import { Environment } from '../../core/models/environment.model';
import { EnvironmentDeleteDialogComponent } from './components/environment-delete-dialog/environment-delete-dialog.component';
import { EnvironmentSlidePanelComponent } from './components/environment-slide-panel/environment-slide-panel.component';

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
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    // Carga inicial diferida para mejorar el tiempo de carga
    setTimeout(() => {
      this.loadEnvironments();
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
    
    this.environmentService.getEnvironments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: environments => {
          this.environments = environments;
          this.filteredEnvironments = environments;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
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
    const dialogRef = this.dialog.open(EnvironmentDeleteDialogComponent, {
      width: '400px',
      data: environment
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
    this.environmentService.toggleActive(environment.id, !environment.isActive)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadEnvironments();
      });
  }
  
  increaseOrder(environment: Environment): void {
    this.environmentService.updateOrder(environment.id, environment.order - 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadEnvironments();
      });
  }
  
  decreaseOrder(environment: Environment): void {
    this.environmentService.updateOrder(environment.id, environment.order + 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadEnvironments();
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