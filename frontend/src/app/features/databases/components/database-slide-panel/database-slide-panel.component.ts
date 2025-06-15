import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil } from 'rxjs';
import { DatabaseService } from '../../../../core/services/database.service';
import { Database, DatabaseType, CreateDatabaseRequest, UpdateDatabaseRequest } from '../../../../shared/models/database.model';
import { Environment } from '../../../../shared/models/environment.model';
import { Project } from '../../../../shared/models/project.model';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { memoize } from 'lodash';

@Component({
  selector: 'app-database-slide-panel',
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
    MatSlideToggleModule
  ],
  templateUrl: './database-slide-panel.component.html',
  styleUrls: ['./database-slide-panel.component.scss'],
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
export class DatabaseSlidePanelComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private _isOpen = false;
  private _database: Database | null = null;
  private resizeObserver: ResizeObserver | null = null;

  @Output() closed = new EventEmitter<boolean>();

  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.handlePanelOpen();
      this.initializeForm();
    } else {
      this.handlePanelClose();
    }
    this.cdr.markForCheck();
  }
  
  get isOpen(): boolean {
    return this._isOpen;
  }
  
  @Input() set database(db: Database | null) {
    this._database = db;
    if (this.isOpen) {
      this.initializeForm();
    }
  }
  
  get database(): Database | null {
    return this._database;
  }

  @Input() environments: Environment[] = [];
  @Input() projects: Project[] = [];

  title: string = 'Nueva Base de Datos';
  databaseForm: FormGroup;
  loading = false;
  isEditMode = false;
  isMobile = window.innerWidth <= 768;

  // Opciones para el formulario
  databaseTypes = Object.values(DatabaseType);

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.databaseForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupServiceSubscriptions();
    this.detectMobileDevice();
  }
  
  ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.setupScrollHandlers();
  }

  ngOnDestroy(): void {
    this.cleanupResizeObserver();
    this.destroy$.next();
    this.destroy$.complete();
    this.resetBodyStyles();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      type: [DatabaseType.POSTGRES, [Validators.required]],
      version: ['', [Validators.maxLength(50)]],
      environmentId: [''],
      projectId: [''],
      isActive: [true]
    });
  }



  onSubmit(): void {
    if (this.databaseForm.invalid) {
      return;
    }
    
    const formData = this.databaseForm.value;
    
    if (this.isEditMode && this.database) {
      this.updateDatabase(formData);
    } else {
      this.createDatabase(formData);
    }
  }

  private createDatabase(formData: any): void {
    const createRequest: CreateDatabaseRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      version: formData.version?.trim() || undefined,
      environmentId: formData.environmentId || undefined,
      projectId: formData.projectId || undefined,
      isActive: formData.isActive
    };

    this.databaseService.createDatabase(createRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.close(true);
        },
        error: (error) => {
          console.error('Error al crear base de datos:', error);
          this.cdr.markForCheck();
        }
      });
  }

  private updateDatabase(formData: any): void {
    if (!this.database) return;

    const updateRequest: UpdateDatabaseRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      version: formData.version?.trim() || undefined,
      environmentId: formData.environmentId || undefined,
      projectId: formData.projectId || undefined,
      isActive: formData.isActive
    };

    this.databaseService.updateDatabase(this.database.id, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.close(true);
        },
        error: (error) => {
          console.error('Error al actualizar base de datos:', error);
          this.cdr.markForCheck();
        }
      });
  }



  close(result: boolean = false): void {
    this.onClose(result);
  }

  onClose(result: boolean = false): void {
    this.closed.emit(result);
  }

  closeOnBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose(false);
    }
  }

  onBackdropClick(event: Event): void {
    event.stopPropagation();
  }

  getFormError(controlName: string): string {
    const control = this.databaseForm.get(controlName);
    if (control?.errors && control.touched) {
      const errors = control.errors;
      
      if (errors['required']) return `${this.getFieldLabel(controlName)} es requerido`;
      if (errors['minlength']) return `${this.getFieldLabel(controlName)} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
      if (errors['maxlength']) return `${this.getFieldLabel(controlName)} no puede exceder ${errors['maxlength'].requiredLength} caracteres`;
    }
    
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      name: 'El nombre',
      description: 'La descripción',
      type: 'El tipo',
      version: 'La versión',
      environmentId: 'El ambiente',
      projectId: 'El proyecto'
    };
    return labels[controlName] || 'El campo';
  }

  private initializeForm(): void {
    this.isEditMode = !!this.database;
    this.title = this.isEditMode ? 'Editar Base de Datos' : 'Nueva Base de Datos';
    
    // Resetear el formulario para evitar mezclar datos entre sesiones
    this.databaseForm.reset({
      name: '',
      description: '',
      type: DatabaseType.POSTGRES,
      version: '',
      environmentId: '',
      projectId: '',
      isActive: true
    });
    
    if (this.isEditMode && this.database) {
      // Usar setTimeout para asegurar que el cambio se aplique después de que Angular haya terminado
      // el ciclo de renderizado actual
      setTimeout(() => {
        this.databaseForm.patchValue({
          name: this.database?.name || '',
          description: this.database?.description || '',
          type: this.database?.type || DatabaseType.POSTGRES,
          version: this.database?.version || '',
          environmentId: this.database?.environmentId || '',
          projectId: this.database?.projectId || '',
          isActive: this.database?.isActive !== undefined ? this.database.isActive : true
        });
        this.cdr.markForCheck();
      });
    }
  }

  private setupServiceSubscriptions(): void {
    this.databaseService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });
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

  private setupScrollHandlers(): void {
    if (this.isOpen) {
      document.addEventListener('wheel', this.handleWheel, { passive: true });
      document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    }
  }

  private detectMobileDevice(): void {
    const newIsMobile = window.innerWidth <= 768;
    if (this.isMobile !== newIsMobile) {
      this.isMobile = newIsMobile;
      this.cdr.markForCheck();
    }
  }

  private handlePanelOpen(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    
    const currentScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.width = '100%';
    
    document.body.setAttribute('data-scroll-y', currentScrollY.toString());
    
    this.setupScrollHandlers();
  }

  private handlePanelClose(): void {
    this.resetBodyStyles();
  }

  private resetBodyStyles(): void {
    const scrollY = document.body.getAttribute('data-scroll-y');
    
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY, 10));
      document.body.removeAttribute('data-scroll-y');
    }
    
    document.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  private getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  private handleWheel = (e: WheelEvent): void => {
    // Permitir scroll dentro del panel
  };

  private handleTouchMove = (e: TouchEvent): void => {
    // Permitir scroll dentro del panel
  };

  readonly getPanelAnimationParams = memoize(() => ({
    transformEnter: this.isMobile ? 'translateY(100%)' : 'translateX(100%)',
    transformLeave: this.isMobile ? 'translateY(100%)' : 'translateX(100%)'
  }));

  getDatabaseTypeLabel(type: DatabaseType): string {
    return this.databaseService.getDatabaseTypeLabel(type);
  }

  getDatabaseTypeIcon(type: DatabaseType): string {
    return this.databaseService.getDatabaseTypeIcon(type);
  }

  getEnvironmentName(environmentId?: number): string {
    if (!environmentId) return 'Sin ambiente';
    const environment = this.environments.find(e => e.id === environmentId);
    return environment?.name || 'Ambiente no encontrado';
  }

  getProjectName(projectId?: number): string {
    if (!projectId) return 'Sin proyecto';
    const project = this.projects.find(p => p.id === projectId);
    return project?.name || 'Proyecto no encontrado';
  }

  // Getters para controles del formulario
  get nameControl() { return this.databaseForm.get('name'); }
  get descriptionControl() { return this.databaseForm.get('description'); }
  get typeControl() { return this.databaseForm.get('type'); }
  get versionControl() { return this.databaseForm.get('version'); }
  get environmentIdControl() { return this.databaseForm.get('environmentId'); }
  get projectIdControl() { return this.databaseForm.get('projectId'); }

  // Métodos para mensajes de error específicos
  getNameErrorMessage(): string {
    const control = this.nameControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El nombre es requerido';
      if (control.errors['minlength']) return 'El nombre debe tener al menos 1 caracter';
      if (control.errors['maxlength']) return 'El nombre no puede exceder 100 caracteres';
    }
    return '';
  }

  getDescriptionErrorMessage(): string {
    const control = this.descriptionControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La descripción es requerida';
      if (control.errors['maxlength']) return 'La descripción no puede exceder 500 caracteres';
    }
    return '';
  }

  getVersionErrorMessage(): string {
    const control = this.versionControl;
    if (control?.errors && control.touched) {
      if (control.errors['maxlength']) return 'La versión no puede exceder 50 caracteres';
    }
    return '';
  }
} 