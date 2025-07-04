import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { DevelopmentService } from '../../services/development.service';
import { ProjectService } from '../../../../core/services/project.service';
import { EnvironmentService } from '../../../../core/services/environment.service';
import { UserService } from '../../../../core/services/user.service';
import { TeamService } from '../../../../core/services/team.service';
import { ComponentService, Component as AppComponent } from '../../../../shared/services/component.service';
import { DatabaseService, Database, DatabaseChangeType } from '../../../../shared/services/database.service';
import { Development, DevelopmentStatus, DevelopmentComponentChangeType } from '../../../../shared/models/development.model';
import { BackendDevelopmentPriority } from '../../../../shared/interfaces/backend-interfaces';
import { Project } from '../../../../shared/models/project.model';
import { Environment } from '../../../../shared/models/environment.model';
import { User, Team } from '../../../../shared/models/user.model';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { memoize } from 'lodash';

@Component({
  selector: 'app-development-form-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule
  ],
  templateUrl: './development-form-panel.component.html',
  styleUrls: ['./development-form-panel.component.scss'],
  animations: [
    trigger('panelState', [
      transition(':enter', [
        style({ 
          transform: '{{transformEnter}}',
          opacity: 0 
        }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            transform: 'translate(0)',
            opacity: 1 
          })
        ),
        query('@*', animateChild(), { optional: true })
      ], { params: { transformEnter: 'translateX(100%)' } }),
      transition(':leave', [
        query('@*', animateChild(), { optional: true }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            transform: '{{transformLeave}}',
            opacity: 0 
          })
        )
      ], { params: { transformLeave: 'translateX(100%)' } })
    ]),
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0 })
        )
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevelopmentFormPanelComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() isOpen = false;
  @Input() development: Development | any | null = null;
  @Output() closed = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();
  private memoizedGetFormError = memoize(this.getFormError.bind(this));
  private resizeObserver: ResizeObserver | null = null;
  
  // Cache para datos del formulario
  private formDataCache = {
    projects: null as Project[] | null,
    components: null as AppComponent[] | null,
    databases: null as Database[] | null,
    environments: null as Environment[] | null,
    lastUpdated: 0,
    cacheTimeout: 5 * 60 * 1000 // 5 minutos
  };

  title: string = 'Nuevo Desarrollo';
  developmentForm: FormGroup;
  loading = false;
  isEditMode = false;
  isMobile = window.innerWidth <= 768;

  // Datos para los selectores - inicializar con arrays vacíos
  projects: Project[] = [];
  environments: Environment[] = [];
  users: User[] = [];
  teams: Team[] = [];
  components: AppComponent[] = [];
  databases: Database[] = [];

  // Arrays para componentes y bases de datos seleccionados
  selectedComponents: any[] = [];
  selectedDatabases: any[] = [];

  // Opciones para el formulario
  developmentStatuses: DevelopmentStatus[] = [
    DevelopmentStatus.PLANNING,
    DevelopmentStatus.IN_PROGRESS,
    DevelopmentStatus.TESTING,
    DevelopmentStatus.COMPLETED,
    DevelopmentStatus.CANCELLED
  ];
  developmentPriorities: BackendDevelopmentPriority[] = [
    BackendDevelopmentPriority.LOW,
    BackendDevelopmentPriority.MEDIUM,
    BackendDevelopmentPriority.HIGH,
    BackendDevelopmentPriority.CRITICAL
  ];

  databaseChangeTypes = [
    { value: DatabaseChangeType.SCHEMA_CHANGE, label: 'Cambio de Esquema' },
    { value: DatabaseChangeType.DATA_MIGRATION, label: 'Migración de Datos' },
    { value: DatabaseChangeType.STORED_PROCEDURE, label: 'Procedimiento Almacenado' },
    { value: DatabaseChangeType.FUNCTION, label: 'Función' },
    { value: DatabaseChangeType.TRIGGER, label: 'Trigger' }
  ];

  constructor(
    private fb: FormBuilder,
    private developmentService: DevelopmentService,
    private projectService: ProjectService,
    private environmentService: EnvironmentService,
    private userService: UserService,
    private teamService: TeamService,
    private componentService: ComponentService,
    private databaseService: DatabaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.developmentForm = this.createForm();
  }

  ngOnInit(): void {
    this.savePromptToFile();
    this.loadFormData();
    this.setupResizeObserver();
  }

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.initializeForm();
      this.setupScrollOptimizations();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.initializeForm();
      this.handlePanelOpen();
      if (this.projects.length === 0) {
        this.loadFormData();
      }
    } else {
      this.handlePanelClose();
    }
  }

  ngOnDestroy(): void {
    this.handlePanelClose();
    this.cleanupScrollListeners();
    this.cleanupResizeObserver();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      status: [DevelopmentStatus.PLANNING, Validators.required],
      priority: [BackendDevelopmentPriority.MEDIUM, Validators.required],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      jiraUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      branch: [''],
      environmentId: ['', Validators.required],
      assignedUserId: ['', Validators.required],
      teamId: ['', Validators.required],
      startDate: [new Date()],
      estimatedDate: [''],
      endDate: [''],
      notes: ['', Validators.maxLength(2000)],
      isActive: [true]
    });
  }

  private savePromptToFile(): void {
    // Este método se ejecuta automáticamente según las reglas del workspace
  }

  private loadFormData(): void {
    // Verificar si el cache es válido
    if (this.isCacheValid()) {
      this.loadFromCache();
      return;
    }

    // Cargar datos desde el servidor y actualizar cache
    this.loadFromServer();
  }

  private isCacheValid(): boolean {
    const now = Date.now();
    return (
      this.formDataCache.lastUpdated > 0 &&
      (now - this.formDataCache.lastUpdated) < this.formDataCache.cacheTimeout &&
      this.formDataCache.projects !== null &&
      this.formDataCache.components !== null &&
      this.formDataCache.databases !== null &&
      this.formDataCache.environments !== null
    );
  }

  private loadFromCache(): void {
    this.projects = this.formDataCache.projects!;
    this.components = this.formDataCache.components!;
    this.databases = this.formDataCache.databases!;
    this.environments = this.formDataCache.environments!;
    this.loading = false;
    this.cdr.markForCheck();
  }

  private loadFromServer(): void {
    this.loading = true;
    this.cdr.markForCheck();

    forkJoin({
      projects: this.projectService.getProjects(),
      environments: this.environmentService.getEnvironments(),
      users: this.userService.getUsers(),
      teams: this.teamService.getTeams(),
      components: this.componentService.getActiveComponents(),
      databases: this.databaseService.getActiveDatabases()
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {       
        // Verificar que los datos sean arrays y filtrar solo elementos activos
        this.projects = Array.isArray(data.projects) 
          ? data.projects.filter(project => project.isActive) 
          : [];
          
        this.environments = Array.isArray(data.environments) 
          ? data.environments.filter(env => env.isActive) 
          : [];
        
        // Procesar datos reales del backend
        this.users = Array.isArray(data.users) 
          ? data.users.filter(user => user.isActive) 
          : [];
          
        this.teams = Array.isArray(data.teams) 
          ? data.teams.filter(team => team.isActive) 
          : [];

        this.components = Array.isArray(data.components) 
          ? data.components.filter(comp => comp.isActive) 
          : [];

        this.databases = Array.isArray(data.databases) 
          ? data.databases.filter(db => db.isActive) 
          : [];

        // Actualizar cache
        this.updateFormDataCache();
                
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        // En caso de error, inicializar con arrays vacíos
        this.projects = [];
        this.environments = [];
        this.users = [];
        this.teams = [];
        this.components = [];
        this.databases = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private updateFormDataCache(): void {
    this.formDataCache = {
      projects: [...this.projects],
      components: [...this.components],
      databases: [...this.databases],
      environments: [...this.environments],
      lastUpdated: Date.now(),
      cacheTimeout: 5 * 60 * 1000 // 5 minutos
    };
  }

  clearCache(): void {
    this.formDataCache = {
      projects: null,
      components: null,
      databases: null,
      environments: null,
      lastUpdated: 0,
      cacheTimeout: 5 * 60 * 1000
    };
  }

  /**
   * Convierte un DevelopmentEnvironment a su ID correspondiente
   */
  private getEnvironmentId(environment?: string): number {
    if (!environment) return 1; // Default: DEVELOPMENT
    
    switch (environment.toUpperCase()) {
      case 'DEVELOPMENT':
        return 1;
      case 'TESTING':
        return 2;
      case 'STAGING':
        return 3;
      case 'PRODUCTION':
        return 4;
      default:
        return 1;
    }
  }

  private initializeForm(): void {
    this.isEditMode = !!this.development;
    this.title = this.isEditMode ? 'Editar Desarrollo' : 'Nuevo Desarrollo';
    
    // Resetear el formulario para evitar mezclar datos entre sesiones
    this.developmentForm.reset({
      title: '',
      description: '',
      status: DevelopmentStatus.PLANNING,
      priority: BackendDevelopmentPriority.MEDIUM,
      progress: 0,
      jiraUrl: '',
      branch: '',

      environmentId: '',
      assignedUserId: '',
      teamId: '',
      startDate: new Date(),
      estimatedDate: '',
      endDate: '',
      notes: '',
      isActive: true
    });
    
    if (this.isEditMode && this.development) {
      // Usar setTimeout para asegurar que el cambio se aplique después de que Angular haya terminado
      // el ciclo de renderizado actual
      setTimeout(() => {
        // Obtener el environmentId correcto
        const environmentId = this.development?.environmentId || this.getEnvironmentId(this.development?.environment);
        
        this.developmentForm.patchValue({
          title: this.development?.title || '',
          description: this.development?.description || '',
          status: this.development?.status || DevelopmentStatus.PLANNING,
          priority: this.development?.priority || BackendDevelopmentPriority.MEDIUM,
          progress: this.development?.progress || 0,
          jiraUrl: this.development?.jiraUrl || '',
          branch: this.development?.branch || '',

          environmentId: environmentId,
          assignedUserId: this.development?.assignedTo?.id || '',
          teamId: this.development?.team?.id || '',
          startDate: this.development?.startDate ? new Date(this.development.startDate) : new Date(),
          estimatedDate: this.development?.estimatedDate ? new Date(this.development.estimatedDate) : '',
          endDate: this.development?.endDate ? new Date(this.development.endDate) : '',
          notes: this.development?.notes || '',
          isActive: this.development?.isActive !== undefined ? this.development.isActive : true
        });

        // Debug: Log de los datos recibidos

        // Cargar componentes existentes si está editando
        if (this.development?.components && Array.isArray(this.development.components)) {
  
          this.selectedComponents = this.development.components.map((comp: any) => ({
            componentId: comp.componentId,
            description: comp.notes || '',
            notes: comp.notes || ''
          }));
          
        } else if (this.development?.developmentComponents) {
          // Fallback para el formato anterior
          
          this.selectedComponents = this.development.developmentComponents.map((devComp: any) => ({
            componentId: devComp.component.id,
            description: devComp.notes || '',
            notes: devComp.notes || ''
          }));
        }

        // Cargar bases de datos existentes si está editando
        if (this.development?.databases && Array.isArray(this.development.databases)) {

          this.selectedDatabases = this.development.databases.map((db: any) => ({
            databaseId: db.databaseId,
            changeType: db.changeType,
            scriptDescription: db.scriptDescription,
            sqlScript: db.sqlScript || '',
            notes: db.notes || ''
          }));
          
        }

        this.cdr.markForCheck();
      });
    }
  }

  getFormError(fieldName: string): string {
    const field = this.developmentForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
      if (field.errors['pattern']) return 'Formato de URL inválido';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Título',
      description: 'Descripción',
      status: 'Estado',
      priority: 'Prioridad',
      progress: 'Progreso',
      jiraUrl: 'URL de Jira',
      branch: 'Rama',
      projectId: 'Proyecto',
      environmentId: 'Ambiente',
      assignedUserId: 'Usuario Asignado',
      teamId: 'Equipo',
      startDate: 'Fecha de Inicio',
      estimatedDate: 'Fecha Estimada',
      endDate: 'Fecha de Fin',
      notes: 'Notas'
    };
    return labels[fieldName] || fieldName;
  }

  getStatusLabel(status: DevelopmentStatus): string {
    const labels: { [key: string]: string } = {
      [DevelopmentStatus.PLANNING]: 'En Planificación',
      [DevelopmentStatus.IN_PROGRESS]: 'En Desarrollo',
      [DevelopmentStatus.TESTING]: 'En Pruebas',
      [DevelopmentStatus.COMPLETED]: 'Completado',
      [DevelopmentStatus.CANCELLED]: 'Archivado'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: BackendDevelopmentPriority): string {
    const labels: { [key: string]: string } = {
      [BackendDevelopmentPriority.LOW]: 'Baja',
      [BackendDevelopmentPriority.MEDIUM]: 'Media',
      [BackendDevelopmentPriority.HIGH]: 'Alta',
      [BackendDevelopmentPriority.CRITICAL]: 'Crítica'
    };
    return labels[priority] || priority;
  }

  onSubmit(): void {
    if (this.developmentForm.invalid) {
      this.developmentForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.cdr.markForCheck();
    
    const formData = this.developmentForm.value;
    
    // Preparar datos de componentes - filtrar solo los que tienen componentId válido
    const components = this.selectedComponents
      .filter(comp => comp.componentId && comp.componentId !== '' && comp.componentId !== null)
      .map(comp => ({
        componentId: Number(comp.componentId),
        changeType: this.isEditMode ? DevelopmentComponentChangeType.MODIFIED : DevelopmentComponentChangeType.CREATED,
        description: comp.description || '',
        notes: comp.notes || ''
      }));

    // Preparar datos de bases de datos - filtrar solo los que tienen databaseId válido y scriptDescription
    const databases = this.selectedDatabases
      .filter(db => db.databaseId && db.databaseId !== '' && db.databaseId !== null && db.scriptDescription && db.scriptDescription.trim() !== '')
      .map(db => ({
        databaseId: Number(db.databaseId),
        changeType: db.changeType,
        scriptDescription: db.scriptDescription.trim(),
        sqlScript: db.sqlScript?.trim() || '',
        notes: db.notes?.trim() || ''
      }));
    
    if (this.isEditMode && this.development) {
      // Asegurar que environmentId tenga un valor válido
      const environmentId = formData.environmentId || this.getEnvironmentId(this.development?.environment) || 1;
      
      // Estructura para actualizar con relaciones
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        environmentId: Number(environmentId),
        assignedToId: formData.assignedUserId || undefined,
        teamId: formData.teamId || undefined,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        estimatedDate: formData.estimatedDate ? new Date(formData.estimatedDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        jiraUrl: formData.jiraUrl?.trim() || undefined,
        branch: formData.branch?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        progress: Number(formData.progress) || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        components: components,
        databases: databases
      };
      
      // Limpiar campos vacíos para evitar errores de validación
      if (updateData.jiraUrl === '') updateData.jiraUrl = undefined;
      if (updateData.branch === '') updateData.branch = undefined;
      if (updateData.notes === '') updateData.notes = undefined;

      // Debug: Log de los datos que se van a enviar (temporal)

      
      this.developmentService.updateDevelopmentWithRelations(this.development.id, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.close(true);
          },
          error: (error) => {
            console.error('Error al actualizar desarrollo:', error);
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
    } else {
      // Asegurar que environmentId tenga un valor válido para creación
      const environmentId = formData.environmentId || 1; // Default: DEVELOPMENT
      
      // Estructura para crear con relaciones
      const createData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        environmentId: Number(environmentId),
        assignedToId: formData.assignedUserId || undefined,
        teamId: formData.teamId || undefined,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        estimatedDate: formData.estimatedDate ? new Date(formData.estimatedDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        jiraUrl: formData.jiraUrl?.trim() || undefined,
        branch: formData.branch?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        progress: Number(formData.progress) || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        components: components,
        databases: databases
      };
      
      // Limpiar campos vacíos para evitar errores de validación
      if (createData.jiraUrl === '') createData.jiraUrl = undefined;
      if (createData.branch === '') createData.branch = undefined;
      if (createData.notes === '') createData.notes = undefined;

      this.developmentService.createDevelopmentWithRelations(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.close(true);
          },
          error: (error) => {
            console.error('Error al crear desarrollo:', error);
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
    }
  }

  close(result: boolean = false): void {
    this.closed.emit(result);
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  closeOnBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  formatSliderValue(value: number): string {
    return `${value}%`;
  }

  // TrackBy functions para optimizar renderizado
  trackByProject(index: number, item: Project): number {
    return item.id;
  }

  trackByEnvironment(index: number, item: Environment): number {
    return item.id;
  }

  trackByUser(index: number, item: User): number {
    return item.id;
  }

  trackByTeam(index: number, item: Team): number {
    return item.id;
  }

  trackByStatus(index: number, item: DevelopmentStatus): string {
    return item;
  }

  trackByPriority(index: number, item: BackendDevelopmentPriority): string {
    return item;
  }

  // Métodos para manejar componentes
  addComponent(): void {
    this.selectedComponents.push({
      componentId: null,
      description: '',
      notes: ''
    });
  }

  removeComponent(index: number): void {
    this.selectedComponents.splice(index, 1);
  }

  trackByComponent(index: number, item: AppComponent): number {
    return item.id;
  }

  // Métodos para manejar bases de datos
  addDatabase(): void {
    this.selectedDatabases.push({
      databaseId: null,
      changeType: DatabaseChangeType.SCHEMA_CHANGE,
      scriptDescription: 'Descripción del cambio',
      sqlScript: '',
      notes: ''
    });
  }

  removeDatabase(index: number): void {
    this.selectedDatabases.splice(index, 1);
  }

  trackByDatabase(index: number, item: Database): number {
    return item.id;
  }

  trackByChangeType(index: number, item: any): string {
    return item.value;
  }

  // =============================================================================
  // SCROLL MANAGEMENT & OPTIMIZATIONS
  // =============================================================================

  private handlePanelOpen(): void {
    // Usar requestAnimationFrame para asegurar que las operaciones DOM se realicen en un frame óptimo
    requestAnimationFrame(() => {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      const panel = document.querySelector('.slide-panel');
      const scrollableContent = document.querySelector('.scrollable-content');
      
      if (panel) panel.scrollTop = 0;
      if (scrollableContent) scrollableContent.scrollTop = 0;
      
      // Marcar para detección de cambios
      this.cdr.markForCheck();
    });
  }

  private handlePanelClose(): void {
    requestAnimationFrame(() => {
      this.resetBodyStyles();
      // Marcar para detección de cambios
      this.cdr.markForCheck();
    });
  }

  private resetBodyStyles(): void {
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Restaurar la posición de scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  private blockBodyScroll(): void {
    this.handlePanelOpen();
  }

  private restoreBodyScroll(): void {
    this.handlePanelClose();
  }

  private resetScroll(): void {
    // Este método ahora está incluido en handlePanelOpen
  }

  private setupScrollOptimizations(): void {
    if (typeof document !== 'undefined') {
      // Usar setTimeout para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        const scrollableContent = document.querySelector('.scrollable-content');
        if (scrollableContent) {
          // Optimización con passive listeners
          scrollableContent.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
          
          // Aplicar optimizaciones CSS via JavaScript si es necesario
          (scrollableContent as HTMLElement).style.scrollBehavior = 'smooth';
        }
      }, 0);
    }
  }

  private onScroll = (): void => {
    // Placeholder para futuras optimizaciones de scroll
    // Como lazy loading de contenido, infinite scroll, etc.
    
    // Ejemplo de optimización: detectar si el usuario está cerca del final
    // para cargar más contenido dinámicamente
    const scrollableContent = document.querySelector('.scrollable-content');
    if (scrollableContent) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableContent;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      if (isNearBottom) {
        // Aquí se podría implementar lazy loading de más datos
        // console.log('Usuario cerca del final del scroll');
      }
    }
  };

  private cleanupScrollListeners(): void {
    if (typeof document !== 'undefined') {
      const scrollableContent = document.querySelector('.scrollable-content');
      if (scrollableContent) {
        scrollableContent.removeEventListener('scroll', this.onScroll);
      }
    }
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.detectMobileDevice();
      });
      
      this.resizeObserver.observe(document.body);
    }
  }

  private cleanupResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private detectMobileDevice(): void {
    const newIsMobile = window.innerWidth <= 768;
    if (this.isMobile !== newIsMobile) {
      this.isMobile = newIsMobile;
      this.cdr.markForCheck();
    }
  }

  private setupScrollHandlers(): void {
    const scrollableElements = document.querySelectorAll('.scrollable-content');
    scrollableElements.forEach(element => {
      element.addEventListener('wheel', () => {
        // El evento es pasivo por defecto
      }, { passive: true });
    });
  }

  readonly getPanelAnimationParams = memoize(() => ({
    transformEnter: 'translateX(100%)',
    transformLeave: 'translateX(100%)'
  }));
} 