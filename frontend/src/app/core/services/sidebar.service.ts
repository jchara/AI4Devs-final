import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);

  public sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();
  public mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  constructor() {}

  toggleSidebar(): void {
    const currentState = this.sidebarCollapsedSubject.value;
    this.sidebarCollapsedSubject.next(!currentState);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSubject.next(collapsed);
  }

  isSidebarCollapsed(): boolean {
    return this.sidebarCollapsedSubject.value;
  }

  toggleMobileMenu(): void {
    const currentState = this.mobileMenuOpenSubject.value;
    this.mobileMenuOpenSubject.next(!currentState);
  }

  setMobileMenuOpen(open: boolean): void {
    this.mobileMenuOpenSubject.next(open);
  }

  isMobileMenuOpen(): boolean {
    return this.mobileMenuOpenSubject.value;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
  }
} 