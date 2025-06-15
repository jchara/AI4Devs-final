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
import { ComponentService } from '../../../../core/services/component.service';
import { ProjectService } from '../../../../core/services/project.service';
import { Component as ComponentModel, ComponentType, CreateComponentRequest, UpdateComponentRequest } from '../../../../shared/models/component.model';
import { Project } from '../../../../shared/models/project.model';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { memoize } from 'lodash';

@Component({
  selector: 'app-component-slide-panel',
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
  templateUrl: './component-slide-panel.component.html',
  styleUrls: ['./component-slide-panel.component.scss'],
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
export class ComponentSlidePanelComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private _isOpen = false;
  private _component: ComponentModel | null = null;
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
  
  @Input() set component(comp: ComponentModel | null) {
    this._component = comp;
    if (this.isOpen) {
      this.initializeForm();
    }
  }
  
  get component(): ComponentModel | null {
    return this._component;
  }

  @Input() projects: Project[] = [];

  title: string = 'Nuevo Componente';
  componentForm: FormGroup;
  loading = false;
  isEditMode = false;
  isMobile = window.innerWidth <= 768;

  // Opciones para el formulario
  componentTypes = Object.values(ComponentType);

  constructor(
    private fb: FormBuilder,
    private componentService: ComponentService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {
    this.componentForm = this.createForm();
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
      type: [ComponentType.MICROSERVICE, [Validators.required]],
      technology: ['', [Validators.required, Validators.maxLength(100)]],
      version: ['', [Validators.maxLength(50)]],
      projectId: ['', [Validators.required]],
      isActive: [true]
    });
  }



  onSubmit(): void {
    if (this.componentForm.valid && !this.loading) {
      const formValue = this.componentForm.value;

      if (this.isEditMode && this.component) {
        this.updateComponent(formValue);
      } else {
        this.createComponent(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createComponent(formValue: any): void {
    const createRequest: CreateComponentRequest = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      type: formValue.type,
      technology: formValue.technology.trim(),
      version: formValue.version?.trim() || undefined,
      projectId: formValue.projectId,
      isActive: true
    };

    this.componentService.createComponent(createRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.close(true);
        },
        error: (error) => {
          console.error('Error al crear componente:', error);
          this.cdr.markForCheck();
        }
      });
  }

  private updateComponent(formValue: any): void {
    if (!this.component) return;

    const updateRequest: UpdateComponentRequest = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      type: formValue.type,
      technology: formValue.technology.trim(),
      version: formValue.version?.trim() || undefined,
      projectId: formValue.projectId,
      isActive: formValue.isActive
    };

    this.componentService.updateComponent(this.component.id, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.close(true);
        },
        error: (error) => {
          console.error('Error al actualizar componente:', error);
          this.cdr.markForCheck();
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.componentForm.controls).forEach(key => {
      const control = this.componentForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  close(result: boolean = false): void {
    this.closed.emit(result);
  }

  closeOnBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close(false);
    }
  }

  onBackdropClick(event: Event): void {
    event.stopPropagation();
  }

  getFormError(controlName: string): string {
    const control = this.componentForm.get(controlName);
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
      technology: 'La tecnología',
      version: 'La versión',
      projectId: 'El proyecto'
    };
    return labels[controlName] || 'El campo';
  }

  private initializeForm(): void {
    this.isEditMode = !!this.component;
    this.title = this.isEditMode ? 'Editar Componente' : 'Nuevo Componente';

    if (this.isEditMode && this.component) {
      this.componentForm.patchValue({
        name: this.component.name,
        description: this.component.description,
        type: this.component.type,
        technology: this.component.technology,
        version: this.component.version || '',
        projectId: this.component.projectId,
        isActive: this.component.isActive
      });
    } else {
      this.componentForm.reset({
        name: '',
        description: '',
        type: ComponentType.MICROSERVICE,
        technology: '',
        version: '',
        projectId: '',
        isActive: true
      });
    }

    this.cdr.markForCheck();
  }

  private setupServiceSubscriptions(): void {
    this.componentService.loading$
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

  getComponentTypeLabel(type: ComponentType): string {
    return this.componentService.getComponentTypeLabel(type);
  }

  getComponentTypeIcon(type: ComponentType): string {
    return this.componentService.getComponentTypeIcon(type);
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.name || 'Proyecto no encontrado';
  }

  // Getters para controles del formulario
  get nameControl() { return this.componentForm.get('name'); }
  get descriptionControl() { return this.componentForm.get('description'); }
  get typeControl() { return this.componentForm.get('type'); }
  get technologyControl() { return this.componentForm.get('technology'); }
  get versionControl() { return this.componentForm.get('version'); }
  get projectIdControl() { return this.componentForm.get('projectId'); }

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

  getTechnologyErrorMessage(): string {
    const control = this.technologyControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La tecnología es requerida';
      if (control.errors['maxlength']) return 'La tecnología no puede exceder 100 caracteres';
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

  getProjectErrorMessage(): string {
    const control = this.projectIdControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El proyecto es requerido';
    }
    return '';
  }
} 