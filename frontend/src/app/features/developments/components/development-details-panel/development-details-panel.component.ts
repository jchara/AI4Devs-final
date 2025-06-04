import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { Development, DevelopmentStatus } from '../../models/development.model';
import { BadgeUtilsService } from '../../../../shared/services/badge-utils.service';
import { Subject } from 'rxjs';
import { memoize } from 'lodash';

@Component({
  selector: 'app-development-details-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule
  ],
  templateUrl: './development-details-panel.component.html',
  styleUrl: './development-details-panel.component.scss',
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
export class DevelopmentDetailsPanelComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() development!: Development;
  private _isOpen = false;
  private readonly destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver | null = null;

  // Cache para optimización
  private cachedProgressValue: { [key: string]: number } = {};
  private cachedDates: { [key: string]: string } = {};
  private cachedTimeElapsed: { [key: string]: string } = {};

  // Listado de estados disponibles
  availableStatuses = [
    DevelopmentStatus.PLANNING,
    DevelopmentStatus.DEVELOPMENT,
    DevelopmentStatus.TESTING,
    DevelopmentStatus.COMPLETED,
    DevelopmentStatus.ARCHIVED
  ];

  isMobile = window.innerWidth <= 768;

  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.handlePanelOpen();
    } else {
      this.handlePanelClose();
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() closePanel = new EventEmitter<void>();
  @Output() editDevelopment = new EventEmitter<void>();
  @Output() changeStatus = new EventEmitter<DevelopmentStatus>();

  constructor(
    private badgeUtils: BadgeUtilsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setupResizeObserver();
  }

  ngAfterViewInit(): void {
    // Establecer el ancho del menú para que coincida con el botón
    setTimeout(() => {
      this.updateMenuButtonWidth();
    });
    
    // Actualizar el ancho en cambios de tamaño de pantalla
    window.addEventListener('resize', this.updateMenuButtonWidth.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupResizeObserver();
    this.resetBodyStyles();
    this.clearCaches();
    
    // Eliminar el listener de resize
    window.removeEventListener('resize', this.updateMenuButtonWidth.bind(this));
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        const newIsMobile = window.innerWidth <= 768;
        if (this.isMobile !== newIsMobile) {
          this.isMobile = newIsMobile;
          this.changeDetectorRef.markForCheck();
        }
      });
      this.resizeObserver.observe(document.body);
    }
  }

  private cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private handlePanelOpen() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    requestAnimationFrame(() => {
      const panel = document.querySelector('.details-panel');
      const scrollableContent = document.querySelector('.scrollable-content');
      
      if (panel) panel.scrollTop = 0;
      if (scrollableContent) scrollableContent.scrollTop = 0;
    });
  }

  private handlePanelClose() {
    this.resetBodyStyles();
  }

  private resetBodyStyles() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  private clearCaches() {
    this.cachedProgressValue = {};
    this.cachedDates = {};
    this.cachedTimeElapsed = {};
  }

  /**
   * Método para cambiar a un estado específico
   */
  changeStatusTo(status: DevelopmentStatus): void {
    if (this.development.status !== status) {
      this.changeStatus.emit(status);
      // Forzar la actualización del DOM para mostrar el nuevo estado inmediatamente
      this.development.status = status;
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Método utilitario para proporcionar parámetros de animación al panel
   * considerando el dispositivo actual (móvil o escritorio)
   */
  readonly getPanelAnimationParams = memoize(() => ({
    transformEnter: this.isMobile ? 'translateY(100%)' : 'translateX(100%)',
    transformLeave: this.isMobile ? 'translateY(100%)' : 'translateX(100%)'
  }));

  getStatusBadgeClass(status: DevelopmentStatus | string): string {
    return this.badgeUtils.getStatusBadgeClass(status);
  }

  formatDate(date: Date): string {
    const key = date.getTime().toString();
    if (this.cachedDates[key]) {
      return this.cachedDates[key];
    }
    
    const formatted = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    this.cachedDates[key] = formatted;
    return formatted;
  }

  calculateTimeElapsed(date: Date): string {
    const key = date.getTime().toString();
    const now = new Date();
    
    if (this.cachedTimeElapsed[key] && 
        (now.getTime() - date.getTime()) < 60000) {
      return this.cachedTimeElapsed[key];
    }
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.cachedTimeElapsed[key] = `${diffDays} días`;
    return this.cachedTimeElapsed[key];
  }

  getProgressValue(progress: string | undefined): number {
    if (!progress) return 0;
    if (this.cachedProgressValue[progress] !== undefined) {
      return this.cachedProgressValue[progress];
    }
    const value = parseInt(progress.replace('%', ''));
    this.cachedProgressValue[progress] = isNaN(value) ? 0 : value;
    return this.cachedProgressValue[progress];
  }

  /**
   * Obtiene el porcentaje de progreso seguro para un microservicio
   * @param progress Porcentaje de progreso, puede ser undefined
   * @returns Porcentaje como string con el símbolo %
   */
  getMicroserviceProgressStyle(progress: number | undefined): string {
    if (progress === undefined || progress === null) {
      return '0%';
    }
    return `${progress}%`;
  }

  onClose(): void {
    this.closePanel.emit();
  }

  onEdit(): void {
    this.editDevelopment.emit();
  }

  onChangeStatus(): void {
    this.changeStatus.emit();
  }

  trackByFn(index: number, item: any): number {
    return item.id || index;
  }

  /**
   * Actualiza la variable CSS con el ancho del botón para el menú
   * Garantiza que el menú desplegable tenga exactamente el mismo ancho que el botón
   */
  private updateMenuButtonWidth(): void {
    const button = document.getElementById('stateMenuButton');
    if (button) {
      // Obtenemos el ancho exacto del botón
      const buttonWidth = button.offsetWidth;
      const buttonWidthPx = `${buttonWidth}px`;
      
      // Establecemos variables CSS
      document.documentElement.style.setProperty('--menu-button-width', buttonWidthPx);
      
      // Función para aplicar estilos a elementos del menú
      const applyMenuStyles = () => {
        // Aplicar a todos los paneles de menú existentes
        const menuPanels = document.querySelectorAll('.mat-mdc-menu-panel');
        menuPanels.forEach(panel => {
          const panelElement = panel as HTMLElement;
          panelElement.style.width = buttonWidthPx;
          panelElement.style.minWidth = buttonWidthPx;
          panelElement.style.maxWidth = buttonWidthPx;
        });
        
        // Aplicar a los contenidos del menú
        const menuContents = document.querySelectorAll('.mat-mdc-menu-content');
        menuContents.forEach(content => {
          const contentElement = content as HTMLElement;
          contentElement.style.width = '100%';
          contentElement.style.boxSizing = 'border-box';
        });
        
        // Aplicar a los elementos del menú
        const menuItems = document.querySelectorAll('.mat-mdc-menu-item');
        menuItems.forEach(item => {
          const itemElement = item as HTMLElement;
          itemElement.style.width = '100%';
          itemElement.style.boxSizing = 'border-box';
        });
      };
      
      // Ejecutar inmediatamente y después de pequeños intervalos
      applyMenuStyles();
      setTimeout(applyMenuStyles, 10);
      setTimeout(applyMenuStyles, 50);
      setTimeout(applyMenuStyles, 100);
    }
  }

  /**
   * Método llamado cuando se abre el menú desplegable
   * Actualiza el ancho del menú para que coincida con el botón
   */
  onMenuOpened(): void {
    // Actualizamos el ancho del menú cuando se abre
    setTimeout(() => {
      this.updateMenuButtonWidth();
    }, 0);
  }
} 