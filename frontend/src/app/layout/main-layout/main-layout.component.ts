import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  contentMarginLeft$: Observable<string>;
  isMobile$: Observable<boolean>;
  isMobileMenuOpen$: Observable<boolean>;

  constructor(
    private sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver
  ) {
    // Calcular el margen izquierdo del contenido según el estado del sidebar
    this.contentMarginLeft$ = combineLatest([
      this.sidebarService.sidebarCollapsed$,
      this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
        map(result => result.matches)
      )
    ]).pipe(
      map(([isCollapsed, isMobile]) => {
        if (isMobile) {
          return '0'; // En móvil, no hay margen
        }
        return isCollapsed ? '60px' : '250px'; // Desktop: collapsed = 60px, expanded = 250px
      })
    );

    // Observables para el overlay móvil
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    );
    
    this.isMobileMenuOpen$ = this.sidebarService.mobileMenuOpen$;
  }

  ngOnInit(): void {
  }

  closeMobileMenu(): void {
    this.sidebarService.closeMobileMenu();
  }
}
