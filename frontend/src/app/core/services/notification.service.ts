import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly horizontalPosition: 'center' | 'end' = 'center';
  private readonly verticalPosition: 'top' | 'bottom' = 'bottom';

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success message
   */
  showSuccess(message: string, duration: number = 4000): void {
    this.snackBar.open(message, '✓', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  /**
   * Show error message
   */
  showError(message: string, duration: number = 6000): void {
    this.snackBar.open(message, '✕', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  /**
   * Show warning message
   */
  showWarning(message: string, duration: number = 5000): void {
    this.snackBar.open(message, '⚠', {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  /**
   * Show info message
   */
  showInfo(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'ℹ', {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }
} 