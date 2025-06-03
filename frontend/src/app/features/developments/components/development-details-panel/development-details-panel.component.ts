import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, transition, style, animate, state, query, stagger, animateChild } from '@angular/animations';
import { Development, DevelopmentStatus } from '../../models/development.model';
import { BadgeUtilsService } from '../../../../shared/services/badge-utils.service';

@Component({
  selector: 'app-development-details-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
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
    ]),
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevelopmentDetailsPanelComponent implements OnDestroy {
  @Input() development!: Development;
  private _isOpen = false;

  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      // Bloquea el scroll del body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Asegura que el panel empiece desde arriba
      requestAnimationFrame(() => {
        const panel = document.querySelector('.details-panel');
        const scrollableContent = document.querySelector('.scrollable-content');
        
        if (panel) {
          panel.scrollTop = 0;
        }
        
        if (scrollableContent) {
          scrollableContent.scrollTop = 0;
        }
      });
    } else {
      // Restaura el scroll del body
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() closePanel = new EventEmitter<void>();
  @Output() editDevelopment = new EventEmitter<void>();
  @Output() changeStatus = new EventEmitter<void>();

  isMobile = window.innerWidth <= 768;

  constructor(private badgeUtils: BadgeUtilsService) {}

  getPanelAnimationParams() {
    return {
      transformEnter: this.isMobile ? 'translateY(100%)' : 'translateX(100%)',
      transformLeave: this.isMobile ? 'translateY(100%)' : 'translateX(100%)'
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnDestroy() {
    if (this._isOpen) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }

  getStatusBadgeClass(status: DevelopmentStatus | string): string {
    return this.badgeUtils.getStatusBadgeClass(status);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateTimeElapsed(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} días`;
  }

  getProgressValue(progress: string | undefined): number {
    if (!progress) return 0;
    const value = parseInt(progress.replace('%', ''));
    return isNaN(value) ? 0 : value;
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
} 