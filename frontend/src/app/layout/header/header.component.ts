import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  isMobile$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isDarkMode$ = this.themeService.theme$.pipe(
      map(theme => theme === 'dark')
    );
    
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    );
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleSidebar(): void {
    // En móvil, controla el menu mobile, en desktop controla el collapse
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.sidebarService.toggleMobileMenu();
    } else {
      this.sidebarService.toggleSidebar();
    }
  }
}
