import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Observable, combineLatest } from 'rxjs';
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
  shouldShowSidebar$: Observable<boolean>;

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
    
    // Lógica para mostrar/ocultar sidebar
    this.shouldShowSidebar$ = combineLatest([
      this.isMobile$,
      this.isCollapsed$,
      this.isMobileMenuOpen$
    ]).pipe(
      map(([isMobile, isCollapsed, isMobileMenuOpen]) => {
        if (isMobile) {
          return isMobileMenuOpen; // En móvil, mostrar solo si el menú está abierto
        }
        return true; // En desktop, siempre mostrar (pero puede estar colapsado)
      })
    );
  }

  ngOnInit(): void {
    // Subscribirse a los cambios de estado para aplicar clases CSS
    this.isCollapsed$.pipe(takeUntil(this.destroy$)).subscribe(collapsed => {
      if (collapsed) {
        this.renderer.addClass(this.elementRef.nativeElement, 'collapsed');
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, 'collapsed');
      }
      this.cdr.markForCheck();
    });

    this.shouldShowSidebar$.pipe(takeUntil(this.destroy$)).subscribe(show => {
      if (show) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
        this.renderer.removeClass(this.elementRef.nativeElement, 'mobile-hidden');
      } else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
        this.renderer.addClass(this.elementRef.nativeElement, 'mobile-hidden');
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeMobileMenu(): void {
    this.sidebarService.closeMobileMenu();
  }

  onNavigate(): void {
    // En móvil, cerrar el menú al navegar
    this.isMobile$.pipe(takeUntil(this.destroy$)).subscribe(isMobile => {
      if (isMobile) {
        this.closeMobileMenu();
      }
    });
  }

  // Método helper para determinar si mostrar tooltip
  shouldShowTooltip(isCollapsed: boolean | null, isMobile: boolean | null): boolean {
    return !!isCollapsed && !isMobile;
  }
}
