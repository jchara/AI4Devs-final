import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isMobile$: Observable<boolean>;
  isCollapsed$: Observable<boolean>;
  isMobileMenuOpen$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    );
    
    this.isCollapsed$ = this.sidebarService.sidebarCollapsed$;
    this.isMobileMenuOpen$ = this.sidebarService.mobileMenuOpen$;
  }

  ngOnInit(): void {
    // Solo manejar la clase collapsed
    this.isCollapsed$.pipe(takeUntil(this.destroy$)).subscribe(collapsed => {
      if (collapsed) {
        this.renderer.addClass(this.elementRef.nativeElement, 'collapsed');
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, 'collapsed');
      }
      this.cdr.markForCheck();
    });

    // Manejar la clase mobile-menu-open para CSS
    this.isMobileMenuOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => {
      if (isOpen) {
        this.renderer.addClass(this.elementRef.nativeElement, 'mobile-menu-open');
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, 'mobile-menu-open');
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNavigate(): void {
    // Pequeño delay para permitir que la navegación termine antes de cerrar el menú
    setTimeout(() => {
      this.sidebarService.closeMobileMenu();
    }, 100);
  }

  // Método helper para determinar si mostrar tooltip
  shouldShowTooltip(isCollapsed: boolean | null, isMobile: boolean | null): boolean {
    return !!isCollapsed && !isMobile;
  }
}
