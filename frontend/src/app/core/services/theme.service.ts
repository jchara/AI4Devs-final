import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'devtracker-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getStoredTheme());

  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY) as Theme;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Detectar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#121212');
      root.style.setProperty('--bg-secondary', '#1E1E1E');
      root.style.setProperty('--bg-tertiary', '#2D2D2D');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#888888');
      root.style.setProperty('--color-primary', '#B491F2');
      root.style.setProperty('--color-accent', '#66D9EF');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-hover', '0 8px 25px rgba(0, 0, 0, 0.4)');
    } else {
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-secondary', '#F8F9FA');
      root.style.setProperty('--bg-tertiary', '#F1F3F4');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#333333');
      root.style.setProperty('--color-primary', '#7D2BE3');
      root.style.setProperty('--color-accent', '#66C6EA');
      root.style.setProperty('--border-color', '#E0E0E0');
      root.style.setProperty('--shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-hover', '0 8px 25px rgba(0, 0, 0, 0.15)');
    }

    document.body.className = theme;
  }
}
