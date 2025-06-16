import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component as AngularComponent, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { memoize } from 'lodash';
import { Subject } from 'rxjs';
import { 
  Development, 
  DevelopmentEnvironment, 
  DevelopmentStatus, 
  DevelopmentWithRelations,
  DevelopmentComponentRelation,
  DevelopmentDatabaseRelation,
  ComponentType
} from '../../../../shared/models/development.model';
import { BadgeUtilsService } from '../../../../shared/services/badge-utils.service';

@AngularComponent({
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
  @Input() development!: Development | DevelopmentWithRelations;
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
    DevelopmentStatus.IN_PROGRESS,
    DevelopmentStatus.TESTING,
    DevelopmentStatus.COMPLETED,
    DevelopmentStatus.CANCELLED
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
    this.detectMobileDevice();

    // Agregar listener para orientación en dispositivos móviles
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detectMobileDevice();
        this.updateMenuButtonWidth();
      }, 100);
    });
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
    
    // Eliminar los listeners adicionales
    window.removeEventListener('resize', this.detectMobileDevice.bind(this));
    window.removeEventListener('orientationchange', this.detectMobileDevice.bind(this));
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
        
        // Actualizar cálculos de ancho para elementos que dependen del tamaño
        this.updateMenuButtonWidth();
      });
      this.resizeObserver.observe(document.body);
    } else {
      // Fallback para navegadores que no soportan ResizeObserver
      window.addEventListener('resize', () => {
        this.detectMobileDevice();
        this.updateMenuButtonWidth();
      });
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

  formatDate(date: Date | string | undefined | null): string {
    // Manejar casos donde la fecha es undefined o null
    if (!date) {
      return 'No especificada';
    }
    
    // Convertir string a Date si es necesario
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    const key = dateObj.getTime().toString();
    if (this.cachedDates[key]) {
      return this.cachedDates[key];
    }
    
    const formatted = dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    this.cachedDates[key] = formatted;
    return formatted;
  }

  calculateTimeElapsed(date: Date | string | undefined | null): string {
    // Manejar casos donde la fecha es undefined o null
    if (!date) {
      return 'No disponible';
    }
    
    // Convertir string a Date si es necesario
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    const key = dateObj.getTime().toString();
    const now = new Date();
    
    if (this.cachedTimeElapsed[key] && 
        (now.getTime() - dateObj.getTime()) < 60000) {
      return this.cachedTimeElapsed[key];
    }
    
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
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
   * Método para obtener el valor de progreso formateado para CSS
   * Asegura que el progreso se aplique correctamente como un valor de ancho
   * @param progress valor de progreso (por ejemplo: "25%" o 25)
   * @returns valor formateado como porcentaje para CSS
   */
  getMicroserviceProgressStyle(progress: number | undefined): string {
    if (progress === undefined || progress === null) {
      return '0%';
    }
    return `${progress}%`;
  }

  /**
   * Método para aplicar el progreso como estilo directamente en el HTML
   * para la barra principal de progreso
   */
  getProgressBarStyle(): { width: string } {
    const progressValue = this.development.progress;
    let numericProgress = 0;
    
    // Verificar el tipo de dato y procesarlo adecuadamente
    if (typeof progressValue === 'number') {
      numericProgress = progressValue;
    } else if (typeof progressValue === 'string') {
      // Remover el símbolo % si existe y convertir a número
      const cleanValue = (progressValue as string).replace('%', '').trim();
      numericProgress = parseFloat(cleanValue);
    }
    
    // Validar que sea un número entre 0 y 100
    if (isNaN(numericProgress)) {
      numericProgress = 0;
    } else if (numericProgress < 0) {
      numericProgress = 0;
    } else if (numericProgress > 100) {
      numericProgress = 100;
    }
    
    // Asegurar que valores muy pequeños sean al menos visibles (mínimo 3%)
    if (numericProgress > 0 && numericProgress < 3) {
      numericProgress = 3;
    }
      
    // Devolver un objeto de estilo con el ancho
    return {
      width: `${numericProgress}%`
    };
  }

  // Método auxiliar para obtener el progreso como string para mostrar
  getProgressDisplay(): string {
    const progressValue = this.development.progress;
    
    if (typeof progressValue === 'number') {
      return `${progressValue}%`;
    } else if (typeof progressValue === 'string') {
      // Si ya tiene %, devolverlo tal como está, si no, agregarlo
      const progressStr = progressValue as string;
      return progressStr.includes('%') ? progressStr : `${progressStr}%`;
    }
    
    return '0%';
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
   * Actualiza el ancho del menú para que coincida con el botón
   * Importante para la visualización correcta en dispositivos móviles
   */
  private updateMenuButtonWidth(): void {
    setTimeout(() => {
      const button = document.getElementById('stateMenuButton');
      if (button) {
        const buttonWidth = button.offsetWidth;
        document.documentElement.style.setProperty('--menu-button-width', `${buttonWidth}px`);
        
        // Asegurar que se aplican los estilos correctamente en móvil
        if (this.isMobile) {
          // Forzar un ancho mínimo en móvil para evitar truncamiento
          document.documentElement.style.setProperty('--menu-button-width', `${Math.max(buttonWidth, window.innerWidth * 0.8)}px`);
          
          // Ajustar la posición del menú para alinearlo correctamente
          const statusMenu = document.querySelector('.status-menu') as HTMLElement;
          if (statusMenu) {
            statusMenu.style.maxWidth = '90vw';
            statusMenu.style.left = '5vw';
            statusMenu.style.right = '5vw';
          }
        }
        
        this.changeDetectorRef.markForCheck();
      }
    }, 0);
  }

  /**
   * Maneja la apertura del menú de estados
   * Aplica ajustes específicos para mejorar la visualización en móvil
   */
  onMenuOpened(): void {
    // Ejecutamos updateMenuButtonWidth cuando se abre el menú para asegurar
    // que los estilos se aplican correctamente
    this.updateMenuButtonWidth();
    
    // Ajustes adicionales específicos para dispositivos móviles
    if (this.isMobile) {
      setTimeout(() => {
        // Seleccionar el panel del menú que está abierto
        const menuPanel = document.querySelector('.mat-mdc-menu-panel.status-menu') as HTMLElement;
        if (menuPanel) {
          // Centrar horizontalmente
          menuPanel.style.left = '50%';
          menuPanel.style.transform = 'translateX(-50%)';
          menuPanel.style.maxWidth = '90vw';
          menuPanel.style.width = '90vw';
          
          // Ajustar elementos internos
          const menuItems = menuPanel.querySelectorAll('.mat-mdc-menu-item');
          menuItems.forEach(item => {
            const itemElement = item as HTMLElement;
            itemElement.style.width = '100%';
            itemElement.style.textAlign = 'center';
            itemElement.style.padding = '8px';
          });
        }
      }, 10);
    }
  }

  /**
   * Detecta si el dispositivo es móvil basado en el tamaño de la pantalla
   * y establece la propiedad isMobile
   */
  private detectMobileDevice(): void {
    this.isMobile = window.innerWidth <= 768;
    this.changeDetectorRef.markForCheck();
  }

  getEnvironmentColor(): string {
    switch (this.development?.environment) {
      case DevelopmentEnvironment.DEVELOPMENT:
        return '#4CAF50'; // Verde
      case DevelopmentEnvironment.TESTING:
        return '#2196F3'; // Azul
      case DevelopmentEnvironment.STAGING:
        return '#FF9800'; // Naranja
      case DevelopmentEnvironment.PRODUCTION:
        return '#F44336'; // Rojo
      default:
        return '#ccc';
    }
  }

  getEnvironmentName(): string {
    if (!this.development.environment) return 'Sin ambiente';
    
    if (typeof this.development.environment === 'string') {
      return this.development.environment;
    }
    
    if (typeof this.development.environment === 'object') {
      const envObj = this.development.environment as any;
      return envObj.name || envObj.type || 'Sin ambiente';
    }
    
    return 'Sin ambiente';
  }

  // Métodos auxiliares para manejar DevelopmentWithRelations
  isDevelopmentWithRelations(): boolean {
    return 'databases' in this.development;
  }

  getComponents(): DevelopmentComponentRelation[] {
    if (this.isDevelopmentWithRelations()) {
      return (this.development as DevelopmentWithRelations).components || [];
    }
    return [];
  }

  getDatabases(): DevelopmentDatabaseRelation[] {
    if (this.isDevelopmentWithRelations()) {
      return (this.development as DevelopmentWithRelations).databases || [];
    }
    return [];
  }

  getComponentName(component: DevelopmentComponentRelation): string {
    return component.component?.name || 'Sin nombre';
  }

  getComponentType(component: DevelopmentComponentRelation): ComponentType | undefined {
    return component.component?.type;
  }

  getComponentTypeLabel(type: ComponentType | undefined): string {
    if (!type) return 'Sin tipo';
    
    switch (type) {
      case ComponentType.MICROSERVICE:
        return 'Microservicio';
      case ComponentType.MICROFRONTEND:
        return 'Microfrontend';
      case ComponentType.MONOLITH:
        return 'Monolito';
      default:
        return 'Desconocido';
    }
  }

  getComponentTypeClass(type: ComponentType | undefined): string {
    if (!type) return 'component-unknown';
    
    switch (type) {
      case ComponentType.MICROSERVICE:
        return 'component-microservice';
      case ComponentType.MICROFRONTEND:
        return 'component-microfrontend';
      case ComponentType.MONOLITH:
        return 'component-monolith';
      default:
        return 'component-unknown';
    }
  }

  getDatabaseName(database: DevelopmentDatabaseRelation): string {
    return database.database?.name || 'Sin nombre';
  }

  getDatabaseType(database: DevelopmentDatabaseRelation): string {
    return database.database?.type || 'Sin tipo';
  }
} 