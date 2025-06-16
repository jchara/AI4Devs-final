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
import { ComponentService } from '../../core/services/component.service';
import { ProjectService } from '../../core/services/project.service';
import { Component as ComponentModel, ComponentType } from '../../shared/models/component.model';
import { Project } from '../../shared/models/project.model';
import { DeleteDialogComponent, DeleteDialogData } from '../../shared/components/delete-dialog';
import { ComponentSlidePanelComponent } from './components/component-slide-panel/component-slide-panel.component';

@Component({
  selector: 'app-components',
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
    ComponentSlidePanelComponent
  ],
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  components: ComponentModel[] = [];
  filteredComponents: ComponentModel[] = [];
  projects: Project[] = [];
  loading = false;
  
  displayedColumns: string[] = ['name', 'type', 'technology', 'version', 'project', 'isActive', 'actions'];
  displayedColumnsMobile: string[] = ['name', 'type', 'actions'];
  
  // Panel lateral
  isEditPanelOpen = false;
  selectedComponent: ComponentModel | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ComponentModel>;
  
  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    typeFilter: new FormControl<ComponentType | ''>(''),
    projectFilter: new FormControl<number | ''>('')
  });
  
  // Opciones para filtros
  componentTypes = Object.values(ComponentType);

  constructor(
    private componentService: ComponentService,
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
      this.loadComponents();
      this.loadProjects();
    });

    // Suscripción reactiva a la lista de componentes
    this.componentService.components$
      .pipe(takeUntil(this.destroy$))
      .subscribe(components => {
        this.components = components;
        this.filterComponents();
        this.cdr.markForCheck();
      });

    this.componentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });

    // Suscripción a cambios en filtros
    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterComponents();
        this.cdr.markForCheck();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadComponents(): void {
    if (this.loading) return;
    this.componentService.getComponents().pipe(takeUntil(this.destroy$)).subscribe();
  }

  loadProjects(): void {
    this.projectService.getProjects().pipe(takeUntil(this.destroy$)).subscribe(projects => {
      // Manejar tanto el formato {data: Array} como Array directo
      const projectsArray = (projects as any)?.data || projects || [];
      this.projects = Array.isArray(projectsArray) ? projectsArray.filter(proj => proj.isActive) : [];
      this.cdr.markForCheck();
    });
  }
  
  filterComponents(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value?.toLowerCase().trim() || '';
    const typeFilter = this.searchForm.get('typeFilter')?.value || '';
    const projectFilter = this.searchForm.get('projectFilter')?.value || '';
    
    this.filteredComponents = this.components.filter(component => {
      const matchesSearch = !searchTerm || 
        component.name.toLowerCase().includes(searchTerm) || 
        component.description?.toLowerCase().includes(searchTerm) ||
        component.technology.toLowerCase().includes(searchTerm);
      
      const matchesType = !typeFilter || component.type === typeFilter;
      const matchesProject = !projectFilter || component.projectId === projectFilter;
      
      return matchesSearch && matchesType && matchesProject;
    });
    
    if (this.table) {
      this.table.renderRows();
    }
    
    this.cdr.markForCheck();
  }
  
  openCreatePanel(): void {
    this.selectedComponent = null;
    this.isEditPanelOpen = true;
    this.cdr.markForCheck();
  }
  
  openEditPanel(component: ComponentModel): void {
    this.selectedComponent = component;
    this.isEditPanelOpen = true;
    this.cdr.markForCheck();
  }
  

  
  onEditPanelClosed(result: boolean): void {
    this.isEditPanelOpen = false;
    this.selectedComponent = null;
    
    if (result) {
      this.loadComponents();
    }
    
    this.cdr.markForCheck();
  }
  

  
  openDeleteDialog(component: ComponentModel): void {
    const dialogData: DeleteDialogData = {
      title: 'Eliminar componente',
      entityName: component.name,
      entityType: 'el componente',
      breadcrumbs: ['Dashboard', 'Componentes', component.name],
      warningMessage: 'Esta acción no se puede deshacer. Se eliminará el componente y todas sus referencias.',
      additionalInfo: [
        {
          icon: this.getComponentTypeIcon(component.type),
          label: 'Tipo',
          value: this.getComponentTypeLabel(component.type)
        },
        {
          icon: 'code',
          label: 'Tecnología',
          value: component.technology
        },
        {
          icon: 'folder',
          label: 'Proyecto',
          value: this.getProjectName(component.projectId)
        }
      ],
      onConfirm: () => {
        this.componentService.deleteComponent(component.id).subscribe({
          next: () => {
            // Componente eliminado exitosamente
          },
          error: (error) => {
            console.error('Error al eliminar componente:', error);
          }
        });
      },
      loading$: this.componentService.loading$ as any
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData,
      panelClass: 'delete-component-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComponents();
      }
    });
  }
  
  toggleActive(component: ComponentModel): void {
    // Usar el método específico del servicio para alternar estado
    this.componentService.toggleComponentStatus(component)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedComponent) => {
          // El servicio ya actualiza la lista reactiva, solo necesitamos refrescar la vista
          this.filterComponents();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cambiar estado del componente:', error);
          // Revertir el cambio en caso de error
          component.isActive = !component.isActive;
          this.cdr.markForCheck();
        }
      });
  }
  
  getComponentTypeLabel(type: ComponentType): string {
    // TODO: Implementar mapeo de etiquetas
    return type;
  }
  
  getComponentTypeIcon(type: ComponentType): string {
    // TODO: Implementar mapeo de iconos
    return 'widgets';
  }
  
  getActiveStatusText(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }
  
  getProjectName(projectId: number): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.name || 'Sin proyecto';
  }
  
  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      typeFilter: '',
      projectFilter: ''
    });
  }
} 