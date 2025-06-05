import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { EnvironmentService } from '../../../../core/services/environment.service';
import { Environment } from '../../../../core/models/environment.model';

@Component({
  selector: 'app-environment-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './environment-delete-dialog.component.html',
  styleUrls: ['./environment-delete-dialog.component.scss']
})
export class EnvironmentDeleteDialogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  
  constructor(
    private dialogRef: MatDialogRef<EnvironmentDeleteDialogComponent>,
    private environmentService: EnvironmentService,
    @Inject(MAT_DIALOG_DATA) public environment: Environment
  ) {
    this.environmentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onConfirm(): void {
    this.environmentService.deleteEnvironment(this.environment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {}
      });
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
} 