import { Component, EventEmitter, Input, Output, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil } from 'rxjs';
import { EnvironmentService } from '../../../../core/services/environment.service';
import { Environment, CreateEnvironmentDto, UpdateEnvironmentDto } from '../../../../core/models/environment.model';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';

@Component({
  selector: 'app-environment-slide-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  templateUrl: './environment-slide-panel.component.html',
  styleUrls: ['./environment-slide-panel.component.scss'],
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
export class EnvironmentSlidePanelComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private _isOpen = false;
  
  @Input() environment: Environment | null = null;
  @Output() closePanel = new EventEmitter<boolean>();
  
  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.handlePanelOpen();
    } else {
      this.handlePanelClose();
    }
    this.cdr.markForCheck();
  }
  
  get isOpen(): boolean {
    return this._isOpen;
  }
  
  title: string = 'Nuevo Ambiente';
  environmentForm: FormGroup;
  isEditMode: boolean = false;
  loading = false;
  
  // Opciones predefinidas de colores
  predefinedColors = [
    '#007bff', // Azul
    '#28a745', // Verde
    '#dc3545', // Rojo
    '#ffc107', // Amarillo
    '#6f42c1', // Púrpura
    '#fd7e14', // Naranja
    '#20c997', // Turquesa
    '#e83e8c'  // Rosa
  ];
  
  constructor(
    private fb: FormBuilder,
    private environmentService: EnvironmentService,
    private cdr: ChangeDetectorRef
  ) {
    this.environmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      color: ['#007bff', Validators.maxLength(20)],
      order: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }
  
  ngOnInit(): void {
    this.isEditMode = !!this.environment;
    this.title = this.isEditMode ? 'Editar Ambiente' : 'Nuevo Ambiente';
    
    if (this.isEditMode && this.environment) {
      this.environmentForm.patchValue({
        name: this.environment.name,
        description: this.environment.description,
        color: this.environment.color,
        order: this.environment.order,
        isActive: this.environment.isActive
      });
    }
    
    this.environmentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdr.markForCheck();
      });
  }
  
  ngAfterViewInit(): void {
    // Usar ResizeObserver para optimizar el rendimiento
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        // Garantizar que los eventos de resize no causen problemas de rendimiento
        this.cdr.detectChanges();
      });
      
      const panel = document.querySelector('.slide-panel');
      if (panel) {
        resizeObserver.observe(panel);
      }
      
      // Desconectar el observer al destruir el componente
      this.destroy$.subscribe(() => {
        resizeObserver.disconnect();
      });
    }
    
    // Optimizar eventos de scroll
    const scrollableElements = document.querySelectorAll('.panel-content');
    scrollableElements.forEach(element => {
      element.addEventListener('wheel', () => {
        // Solo monitoreo, sin lógica pesada
        // El evento es pasivo por defecto
      }, { passive: true });
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetBodyStyles();
  }
  
  private handlePanelOpen() {
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
  
  private handlePanelClose() {
    requestAnimationFrame(() => {
      this.resetBodyStyles();
      // Marcar para detección de cambios
      this.cdr.markForCheck();
    });
  }
  
  private resetBodyStyles() {
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
  
  onSubmit(): void {
    if (this.environmentForm.invalid) {
      return;
    }
    
    const formData = this.environmentForm.value;
    
    if (this.isEditMode && this.environment) {
      const updateData: UpdateEnvironmentDto = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        order: formData.order,
        isActive: formData.isActive
      };
      
      this.environmentService.updateEnvironment(this.environment.id, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.close(true),
          error: () => {}
        });
    } else {
      const createData: CreateEnvironmentDto = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        order: formData.order,
        isActive: formData.isActive
      };
      
      this.environmentService.createEnvironment(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.close(true),
          error: () => {}
        });
    }
  }
  
  close(result: boolean = false): void {
    this.closePanel.emit(result);
  }
  
  closeOnBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
  
  getFormError(controlName: string): string {
    const control = this.environmentForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    
    if (control.errors['min']) {
      return `El valor mínimo es ${control.errors['min'].min}`;
    }
    
    return 'Campo inválido';
  }
  
  selectColor(color: string): void {
    this.environmentForm.get('color')?.setValue(color);
  }
  
  getColorStyle(color: string): object {
    return {
      'background-color': color
    };
  }
  
  getPanelAnimationParams() {
    return {
      transformEnter: 'translateX(100%)',
      transformLeave: 'translateX(100%)'
    };
  }
} 