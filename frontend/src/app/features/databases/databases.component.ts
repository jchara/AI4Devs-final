import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { DatabaseService } from '../../core/services/database.service';
import { EnvironmentService } from '../../core/services/environment.service';
import { ProjectService } from '../../core/services/project.service';
import { Database, DatabaseType } from '../../shared/models/database.model';
import { Environment } from '../../shared/models/environment.model';
import { Project } from '../../shared/models/project.model';
import {
  DeleteDialogComponent,
  DeleteDialogData,
} from '../../shared/components/delete-dialog';
import { DatabaseSlidePanelComponent } from './components/database-slide-panel/database-slide-panel.component';

@Component({
  selector: 'app-databases',
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
    DatabaseSlidePanelComponent,
  ],
  templateUrl: './databases.component.html',
  styleUrls: ['./databases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabasesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  databases: Database[] = [];
  filteredDatabases: Database[] = [];
  environments: Environment[] = [];
  projects: Project[] = [];
  loading = false;

  displayedColumns: string[] = [
    'name',
    'type',
    'version',
    'environment',
    'project',
    'isActive',
    'actions',
  ];
  displayedColumnsMobile: string[] = ['name', 'type', 'actions'];

  // Paneles laterales
  isEditPanelOpen = false;
  selectedDatabase: Database | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Database>;

  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    typeFilter: new FormControl<DatabaseType | ''>(''),
    environmentFilter: new FormControl<number | ''>(''),
    projectFilter: new FormControl<number | ''>(''),
  });

  // Opciones para filtros
  databaseTypes = Object.values(DatabaseType);

  constructor(
    private databaseService: DatabaseService,
    private environmentService: EnvironmentService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    // Cerrar diálogos cuando hay navegación
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.dialog.closeAll();
      });
  }

  ngOnInit(): void {
    // Carga inicial diferida para mejorar el tiempo de carga
    setTimeout(() => {
      this.loadDatabases();
      // Cargar todos los ambientes y proyectos para los formularios
      this.loadEnvironments();
      this.loadProjects();
    });

    // Suscripción reactiva a la lista de bases de datos
    this.databaseService.databases$
      .pipe(takeUntil(this.destroy$))
      .subscribe((databases) => {
        // Asegurar que databases sea siempre un array
        this.databases = Array.isArray(databases) ? databases : [];

        // Extraer ambientes y proyectos únicos de las bases de datos
        this.extractEnvironmentsAndProjects();

        this.filterDatabases();
        this.cdr.markForCheck();
      });

    this.databaseService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
        this.cdr.markForCheck();
      });

    // Suscripción a cambios en filtros
    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterDatabases();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDatabases(): void {
    if (this.loading) return;
    this.databaseService
      .getDatabases()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  loadEnvironments(): void {
    this.environmentService
      .getEnvironments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((environments) => {
        // Filtrar solo ambientes activos
        this.environments = Array.isArray(environments)
          ? environments.filter((env) => env.isActive)
          : [];
        this.cdr.markForCheck();
      });
  }

  loadProjects(): void {
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        // Extraer el array de datos y filtrar solo proyectos activos
        const projectsArray = (projects as any)?.data || projects || [];
        this.projects = Array.isArray(projectsArray)
          ? projectsArray.filter((proj) => proj.isActive)
          : [];
        this.cdr.markForCheck();
      });
  }

  extractEnvironmentsAndProjects(): void {
    // Validar que databases sea un array antes de procesar
    if (!Array.isArray(this.databases)) {
      console.warn('databases no es un array:', this.databases);
      return;
    }

    // Extraer ambientes únicos de las bases de datos para los filtros
    const environmentsFromDBMap = new Map();
    const projectsFromDBMap = new Map();

    this.databases.forEach((database) => {
      if (database.environment) {
        environmentsFromDBMap.set(
          database.environment.id,
          database.environment
        );
      }
      if (database.project) {
        projectsFromDBMap.set(database.project.id, database.project);
      }
    });

    // Combinar con los ambientes y proyectos ya cargados (para mantener todos disponibles)
    const allEnvironmentsMap = new Map();
    const allProjectsMap = new Map();

    // Agregar los ya existentes (ya están filtrados por activos)
    if (Array.isArray(this.environments)) {
      this.environments.forEach((env) => allEnvironmentsMap.set(env.id, env));
    }
    if (Array.isArray(this.projects)) {
      this.projects.forEach((proj) => allProjectsMap.set(proj.id, proj));
    }

    // Agregar los extraídos de las bases de datos
    environmentsFromDBMap.forEach((env, id) => allEnvironmentsMap.set(id, env));
    projectsFromDBMap.forEach((proj, id) => allProjectsMap.set(id, proj));

    this.environments = Array.from(allEnvironmentsMap.values());
    this.projects = Array.from(allProjectsMap.values());
  }

  filterDatabases(): void {
    // Validar que databases sea un array antes de filtrar
    if (!Array.isArray(this.databases)) {
      this.filteredDatabases = [];
      return;
    }

    const searchTerm =
      this.searchForm.get('searchTerm')?.value?.toLowerCase().trim() || '';
    const typeFilter = this.searchForm.get('typeFilter')?.value || '';
    const environmentFilter =
      this.searchForm.get('environmentFilter')?.value || '';
    const projectFilter = this.searchForm.get('projectFilter')?.value || '';

    this.filteredDatabases = this.databases.filter((database) => {
      const matchesSearch =
        !searchTerm ||
        database.name.toLowerCase().includes(searchTerm) ||
        database.description?.toLowerCase().includes(searchTerm);

      const matchesType = !typeFilter || database.type === typeFilter;
      const matchesEnvironment =
        !environmentFilter || database.environmentId === environmentFilter;
      const matchesProject =
        !projectFilter || database.projectId === projectFilter;

      return (
        matchesSearch && matchesType && matchesEnvironment && matchesProject
      );
    });

    if (this.table) {
      this.table.renderRows();
    }

    this.cdr.markForCheck();
  }

  openCreatePanel(): void {
    this.selectedDatabase = null;
    this.isEditPanelOpen = true;
    this.cdr.markForCheck();
  }

  openEditPanel(database: Database): void {
    this.selectedDatabase = database;
    this.isEditPanelOpen = true;
    this.cdr.markForCheck();
  }

  onEditPanelClosed(result: boolean): void {
    this.isEditPanelOpen = false;
    this.selectedDatabase = null;

    if (result) {
      this.loadDatabases();
    }

    this.cdr.markForCheck();
  }

  openDeleteDialog(database: Database): void {
    const dialogData: DeleteDialogData = {
      title: 'Eliminar base de datos',
      entityName: database.name,
      entityType: 'la base de datos',
      breadcrumbs: ['Dashboard', 'Bases de Datos', database.name],
      warningMessage:
        'Esta acción no se puede deshacer. Se eliminará la base de datos y todas sus referencias.',
      additionalInfo: [
        {
          icon: this.getDatabaseTypeIcon(database.type),
          label: 'Tipo',
          value: this.getDatabaseTypeLabel(database.type),
        },
        {
          icon: 'info',
          label: 'Versión',
          value: database.version || 'N/A',
        },
        {
          icon: 'environment',
          label: 'Ambiente',
          value: this.getEnvironmentName(database.environmentId, database),
        },
        {
          icon: 'folder',
          label: 'Proyecto',
          value: this.getProjectName(database.projectId, database),
        },
      ],
      onConfirm: () => {
        this.databaseService.deleteDatabase(database.id).subscribe({
          next: () => {
            // Base de datos eliminada exitosamente
          },
          error: (error) => {
            console.error('Error al eliminar base de datos:', error);
          },
        });
      },
      loading$: this.databaseService.loading$ as any,
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData,
      panelClass: 'delete-database-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDatabases();
      }
    });
  }

  toggleActive(database: Database): void {
    this.databaseService
      .updateDatabase(database.id, { isActive: !database.isActive })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadDatabases();
        },
        error: (error) => {
          console.error('Error al cambiar estado de la base de datos:', error);
        },
      });
  }

  getDatabaseTypeLabel(type: DatabaseType): string {
    // TODO: Implementar mapeo de etiquetas
    return type;
  }

  getDatabaseTypeIcon(type: DatabaseType): string {
    // TODO: Implementar mapeo de iconos
    return 'storage';
  }

  getActiveStatusText(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }

  getEnvironmentName(environmentId?: number, database?: Database): string {
    // Si tenemos la base de datos con la relación cargada, usarla directamente
    if (database?.environment) {
      return database.environment.name;
    }

    // Fallback: buscar en la lista de ambientes extraídos
    if (!environmentId) return 'Sin ambiente';
    const environment = this.environments.find((e) => e.id === environmentId);
    return environment?.name || 'Sin ambiente';
  }

  getProjectName(projectId?: number, database?: Database): string {
    // Si tenemos la base de datos con la relación cargada, usarla directamente
    if (database?.project) {
      return database.project.name;
    }

    // Fallback: buscar en la lista de proyectos extraídos
    if (!projectId) return 'Sin proyecto';
    const project = this.projects.find((p) => p.id === projectId);
    return project?.name || 'Sin proyecto';
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      typeFilter: '',
      environmentFilter: '',
      projectFilter: '',
    });
  }
}
