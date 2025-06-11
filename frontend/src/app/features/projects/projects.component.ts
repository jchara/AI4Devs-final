import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
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
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProjectService } from '../../core/services/project.service';
import { Project, ProjectType } from '../../shared/models/project.model';
import { DeleteDialogComponent, DeleteDialogData } from '../../shared/components/delete-dialog';
import { ProjectSlidePanelComponent } from './components/project-slide-panel/project-slide-panel.component';
// import { ProjectDetailsPanelComponent } from './components/project-details-panel/project-details-panel.component';

@Component({
  selector: 'app-projects',
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
    ProjectSlidePanelComponent
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = false;
  
  displayedColumns: string[] = ['name', 'type', 'repositoryUrl', 'description', 'isActive', 'actions'];
  displayedColumnsMobile: string[] = ['name', 'type', 'actions'];
  
  // Paneles laterales
  isEditPanelOpen = false;
  isDetailsPanelOpen = false;
  selectedProject: Project | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Project>;
  
  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    typeFilter: new FormControl<ProjectType | ''>('')
  });
  
  // Opciones para filtros
  projectTypes = Object.values(ProjectType);

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { 
    // Cerrar diálogos cuando hay navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.dialog.closeAll();
    });
  }
  
  ngOnInit(): void {
    // Carga inicial diferida para mejorar el tiempo de carga
    setTimeout(() => {
      this.loadProjects();
    });

    // Suscripción reactiva a la lista de proyectos
    this.projectService.projects$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.projects = projects;
        this.filterProjects();
        this.cdr.markForCheck();
      });

    this.projectService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });

    // Suscripción a cambios en filtros
    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterProjects();
        this.cdr.markForCheck();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadProjects(): void {
    if (this.loading) return;
    this.projectService.getProjects().pipe(takeUntil(this.destroy$)).subscribe();
  }
  
  filterProjects(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value?.toLowerCase().trim() || '';
    const typeFilter = this.searchForm.get('typeFilter')?.value || '';
    
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm) || 
        project.description?.toLowerCase().includes(searchTerm) ||
        project.repositoryUrl.toLowerCase().includes(searchTerm);
      
      const matchesType = !typeFilter || project.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
    
    if (this.table) {
      this.table.renderRows();
    }
    
    this.cdr.markForCheck();
  }
  
  openCreatePanel(): void {
    this.selectedProject = null;
    this.isEditPanelOpen = true;
    this.cdr.markForCheck();
  }
  
  openEditPanel(project: Project): void {
    this.selectedProject = project;
    this.isEditPanelOpen = true;
    this.cdr.markForCheck();
  }
  
  openDetailsPanel(project: Project): void {
    // TODO: Implementar panel de detalles
    console.log('Ver detalles del proyecto:', project);
  }
  
  onEditPanelClosed(result: boolean): void {
    this.isEditPanelOpen = false;
    this.selectedProject = null;
    
    if (result) {
      this.loadProjects();
    }
    
    this.cdr.markForCheck();
  }
  
  onDetailsPanelClosed(): void {
    // TODO: Implementar cierre de panel de detalles
  }
  
  openDeleteDialog(project: Project): void {
    const dialogData: DeleteDialogData = {
      title: 'Eliminar proyecto',
      entityName: project.name,
      entityType: 'el proyecto',
      breadcrumbs: ['Dashboard', 'Proyectos', project.name],
      warningMessage: 'Esta acción no se puede deshacer. Se eliminarán todos los componentes asociados a este proyecto.',
      additionalInfo: [
        {
          icon: this.getProjectTypeIcon(project.type),
          label: 'Tipo',
          value: this.getProjectTypeLabel(project.type)
        },
        {
          icon: 'link',
          label: 'Repositorio',
          value: project.repositoryUrl
        }
      ],
      onConfirm: () => {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            console.log('Proyecto eliminado exitosamente');
          },
          error: (error) => {
            console.error('Error al eliminar proyecto:', error);
          }
        });
      },
      loading$: this.projectService.loading$ as any
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData,
      panelClass: 'delete-project-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
      }
    });
  }
  
  toggleActive(project: Project): void {
    // Usar el método específico del servicio para alternar estado
    this.projectService.toggleProjectStatus(project)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedProject) => {
          // El servicio ya actualiza la lista reactiva, solo necesitamos refrescar la vista
          this.filterProjects();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cambiar estado del proyecto:', error);
          // El servicio ya maneja el error y muestra el snackbar
        }
      });
  }
  
  getProjectTypeLabel(type: ProjectType): string {
    return this.projectService.getProjectTypeLabel(type);
  }
  
  getProjectTypeIcon(type: ProjectType): string {
    const icons: Record<ProjectType, string> = {
      [ProjectType.BACKEND]: 'dns',
      [ProjectType.FRONTEND]: 'web'
    };
    
    return icons[type] || 'code';
  }
  
  getActiveStatusText(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }
  
  clearFilters(): void {
    this.searchForm.reset();
    this.filterProjects();
  }
} 