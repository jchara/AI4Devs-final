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
import { ProjectService } from '../../../../core/services/project.service';
import { Project, ProjectType, CreateProjectRequest, UpdateProjectRequest } from '../../../../shared/models/project.model';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { memoize } from 'lodash';

@Component({
  selector: 'app-project-slide-panel',
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
  templateUrl: './project-slide-panel.component.html',
  styleUrls: ['./project-slide-panel.component.scss'],
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
export class ProjectSlidePanelComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private _isOpen = false;
  private _project: Project | null = null;
  private resizeObserver: ResizeObserver | null = null;

  @Output() closePanel = new EventEmitter<boolean>();

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
  
  @Input() set project(proj: Project | null) {
    this._project = proj;
    if (this.isOpen) {
      this.initializeForm();
    }
  }
  
  get project(): Project | null {
    return this._project;
  }

  title: string = 'Nuevo Proyecto';
  projectForm: FormGroup;
  loading = false;
  isEditMode = false;
  isMobile = window.innerWidth <= 768;

  // Opciones para el formulario
  projectTypes = Object.values(ProjectType);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {
    this.projectForm = this.createForm();
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
      repositoryUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      type: [ProjectType.BACKEND, [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }



  onSubmit(): void {
    if (this.projectForm.valid && !this.loading) {
      const formValue = this.projectForm.value;

      if (this.isEditMode && this.project) {
        this.updateProject(formValue);
      } else {
        this.createProject(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createProject(formValue: any): void {
    const createRequest: CreateProjectRequest = {
      name: formValue.name.trim(),
      repositoryUrl: formValue.repositoryUrl.trim(),
      type: formValue.type,
      description: formValue.description?.trim() || undefined
    };

    this.projectService.createProject(createRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.onClose(true);
        },
        error: (error) => {
          console.error('Error al crear proyecto:', error);
          this.cdr.markForCheck();
        }
      });
  }

  private updateProject(formValue: any): void {
    if (!this.project) return;

    const updateRequest: UpdateProjectRequest = {
      name: formValue.name.trim(),
      repositoryUrl: formValue.repositoryUrl.trim(),
      type: formValue.type,
      description: formValue.description?.trim() || undefined,
      isActive: formValue.isActive
    };

    this.projectService.updateProject(this.project.id, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.onClose(true);
        },
        error: (error) => {
          console.error('Error al actualizar proyecto:', error);
          this.cdr.markForCheck();
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  close(result: boolean = false): void {
    this.projectForm.reset();
    this.closePanel.emit(result);
  }

  onClose(result: boolean = false): void {
    this.close(result);
  }

  closeOnBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close(false);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose(false);
    }
  }

  getFormError(controlName: string): string {
    const control = this.projectForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(controlName)} es requerido`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(controlName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(controlName)} no puede exceder ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern']) {
        return 'URL inválida. Debe comenzar con http:// o https://';
      }
    }
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      name: 'El nombre',
      repositoryUrl: 'La URL del repositorio',
      type: 'El tipo de proyecto',
      description: 'La descripción'
    };
    return labels[controlName] || 'El campo';
  }

  private initializeForm(): void {
    this.isEditMode = !!this.project;
    this.title = this.isEditMode ? 'Editar Proyecto' : 'Nuevo Proyecto';
    
    // Resetear el formulario para evitar mezclar datos entre sesiones
    this.projectForm.reset({
      name: '',
      repositoryUrl: '',
      type: ProjectType.BACKEND,
      description: '',
      isActive: true
    });
    
    if (this.isEditMode && this.project) {
      // Usar setTimeout para asegurar que el cambio se aplique después de que Angular haya terminado
      // el ciclo de renderizado actual
      setTimeout(() => {
        this.projectForm.patchValue({
          name: this.project?.name || '',
          repositoryUrl: this.project?.repositoryUrl || '',
          type: this.project?.type || ProjectType.BACKEND,
          description: this.project?.description || '',
          isActive: this.project?.isActive !== undefined ? this.project.isActive : true
        });
        this.cdr.markForCheck();
      });
    }
  }

  private setupServiceSubscriptions(): void {
    this.projectService.loading$
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
    const scrollableElements = document.querySelectorAll('.scrollable-content, .panel-content');
    scrollableElements.forEach(element => {
      element.addEventListener('wheel', () => {
        // El evento es pasivo por defecto
      }, { passive: true });
    });
  }

  private detectMobileDevice(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== this.isMobile) {
      this.cdr.markForCheck();
    }
  }

  private handlePanelOpen(): void {
    // Usar requestAnimationFrame para asegurar que las operaciones DOM se realicen en un frame óptimo
    requestAnimationFrame(() => {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      const panel = document.querySelector('.slide-panel');
      const scrollableContent = document.querySelector('.panel-content');
      
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



  readonly getPanelAnimationParams = memoize(() => ({
    transformEnter: this.isMobile ? 'translateY(100%)' : 'translateX(100%)',
    transformLeave: this.isMobile ? 'translateY(100%)' : 'translateX(100%)'
  }));

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

  // Getters para validaciones
  get nameControl() { return this.projectForm.get('name'); }
  get repositoryUrlControl() { return this.projectForm.get('repositoryUrl'); }
  get typeControl() { return this.projectForm.get('type'); }
  get descriptionControl() { return this.projectForm.get('description'); }

  // Métodos de validación
  getNameErrorMessage(): string {
    const control = this.nameControl;
    if (control?.hasError('required')) {
      return 'El nombre es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'El nombre debe tener al menos 1 carácter';
    }
    if (control?.hasError('maxlength')) {
      return 'El nombre no puede exceder 100 caracteres';
    }
    return '';
  }

  getRepositoryUrlErrorMessage(): string {
    const control = this.repositoryUrlControl;
    if (control?.hasError('required')) {
      return 'La URL del repositorio es requerida';
    }
    if (control?.hasError('pattern')) {
      return 'Debe ser una URL válida (http:// o https://)';
    }
    return '';
  }

  getDescriptionErrorMessage(): string {
    const control = this.descriptionControl;
    if (control?.hasError('maxlength')) {
      return 'La descripción no puede exceder 500 caracteres';
    }
    return '';
  }
} 