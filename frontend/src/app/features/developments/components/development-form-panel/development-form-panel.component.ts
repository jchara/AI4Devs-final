import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Development, DevelopmentStatus } from '../../../../shared/models/development.model';
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
  @Input() development: Development | null = null;
  @Output() closed = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();
  private memoizedGetFormError = memoize(this.getFormError.bind(this));

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

  constructor(
    private fb: FormBuilder,
    private developmentService: DevelopmentService,
    private projectService: ProjectService,
    private environmentService: EnvironmentService,
    private userService: UserService,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef
  ) {
    this.developmentForm = this.createForm();
  }

  ngOnInit(): void {
    this.savePromptToFile();
    this.loadFormData();
  }

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.initializeForm();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.initializeForm();
      if (this.projects.length === 0) {
        this.loadFormData();
      }
    }
  }

  ngOnDestroy(): void {
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
      projectId: ['', Validators.required],
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
    this.loading = true;
    this.cdr.markForCheck();

    forkJoin({
      projects: this.projectService.getProjects(),
      environments: this.environmentService.getEnvironments(),
      users: this.userService.getUsers(),
      teams: this.teamService.getTeams()
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        console.log('Data received:', data); // Debug log
        
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
        
        console.log('Processed data:', { 
          projects: this.projects.length, 
          environments: this.environments.length,
          users: this.users.length,
          teams: this.teams.length
        }); // Debug log
        
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
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
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
      projectId: '',
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
        this.developmentForm.patchValue({
          title: this.development?.title || '',
          description: this.development?.description || '',
          status: this.development?.status || DevelopmentStatus.PLANNING,
          priority: this.development?.priority || BackendDevelopmentPriority.MEDIUM,
          progress: this.development?.progress || 0,
          jiraUrl: this.development?.jiraUrl || '',
          branch: this.development?.branch || '',
          projectId: this.development?.projectId || '',
          environmentId: this.development?.environmentId || '',
          assignedUserId: this.development?.assignedTo?.id || '',
          teamId: this.development?.team?.id || '',
          startDate: this.development?.startDate ? new Date(this.development.startDate) : new Date(),
          estimatedDate: this.development?.estimatedDate ? new Date(this.development.estimatedDate) : '',
          endDate: this.development?.endDate ? new Date(this.development.endDate) : '',
          notes: this.development?.notes || '',
          isActive: this.development?.isActive !== undefined ? this.development.isActive : true
        });
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
    
    if (this.isEditMode && this.development) {
      // Estructura para actualizar según el DTO del backend
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        projectId: formData.projectId,
        environmentId: formData.environmentId,
        assignedToId: formData.assignedUserId || undefined,
        teamId: formData.teamId || undefined,
        startDate: formData.startDate || undefined,
        estimatedDate: formData.estimatedDate || undefined,
        endDate: formData.endDate || undefined,
        jiraUrl: formData.jiraUrl?.trim() || undefined,
        branch: formData.branch?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        progress: formData.progress || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };
      
      this.developmentService.updateDevelopment(this.development.id, updateData)
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
      // Estructura para crear según el DTO del backend
      const createData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        projectId: formData.projectId,
        environmentId: formData.environmentId,
        assignedToId: formData.assignedUserId || undefined,
        teamId: formData.teamId || undefined,
        startDate: formData.startDate || undefined,
        estimatedDate: formData.estimatedDate || undefined,
        endDate: formData.endDate || undefined,
        jiraUrl: formData.jiraUrl?.trim() || undefined,
        branch: formData.branch?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        progress: formData.progress || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };
      
      this.developmentService.createDevelopment(createData)
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
} 